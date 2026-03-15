export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { projectDescription } = req.body;

        if (!projectDescription || projectDescription.length < 10) {
            return res.status(400).json({ error: 'Please provide a more detailed project description.' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        const prompt = `You are a Senior Project Manager at WDC (Web App Developers of Chicago), a premium software agency.
A potential client wants to build the following project:
"${projectDescription}"

Analyze this project and estimate the cost, timeline, and key features required.
WDC's minimum engagement is $5,000. Complex apps usually range from $15,000 to $50,000+.
Provide a realistic but slightly premium agency estimate.

You MUST respond with a perfectly formatted JSON object EXACTLY matching this structure:
{
  "minPrice": number, 
  "maxPrice": number,
  "timeline": "string (e.g. 8-12 weeks)",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "techStack": ["React", "Node.js", "etc"],
  "summary": "A 2-sentence professional breakdown of what it takes to build this."
}
Do not include markdown blocks, just the raw JSON object.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.4, // lower temp for more consistent JSON structure
                        responseMimeType: "application/json" // Force Gemini to return valid JSON
                    },
                }),
            }
        );

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Gemini API error ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) throw new Error('Empty response from Gemini');

        // Parse and return the JSON directly to the frontend
        const estimateData = JSON.parse(content);
        return res.status(200).json(estimateData);

    } catch (err) {
        console.error('AI Estimator Error:', err);
        return res.status(500).json({ error: 'Failed to generate estimate. Please try again later.' });
    }
}
