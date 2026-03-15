import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'dev-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // Local dev implementation for Stripe Checkout
            if (req.url === '/api/create-checkout-session' && req.method === 'POST') {
              let bodyText = '';
              req.on('data', chunk => bodyText += chunk);
              req.on('end', async () => {
                try {
                  const body = JSON.parse(bodyText);
                  const { clientId, clientName, clientEmail, serviceName, servicePrice, discountApplied } = body;
                  
                  const Stripe = (await import('stripe')).default;
                  const stripe = new Stripe(env.STRIPE_SECRET_KEY as string);

                  const lineItems = [
                    {
                      price_data: {
                        currency: 'usd',
                        product_data: { name: serviceName, description: `WDC ${serviceName} — Client ${clientId}` },
                        unit_amount: servicePrice * 100,
                      },
                      quantity: 1,
                    },
                  ];

                  if (!discountApplied) {
                    lineItems.push({
                      price_data: {
                        currency: 'usd',
                        product_data: { name: 'Onboarding Fee', description: 'One-time client onboarding and setup fee' },
                        unit_amount: 1000 * 100,
                      },
                      quantity: 1,
                    });
                  }

                  const origin = req.headers.origin || 'http://localhost:5173';
                  const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    customer_email: clientEmail,
                    line_items: lineItems,
                    metadata: { clientId, clientName, clientEmail, serviceName, discountApplied: String(discountApplied) },
                    success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${origin}/?payment=cancelled`,
                  });

                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ url: session.url }));
                } catch (e: any) {
                  console.error('Local Stripe Error:', e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
              return;
            }

            // Local dev implementation for RSS
            if (req.url === '/rss.xml') {
              const supabaseUrl = env.VITE_SUPABASE_URL;
              const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
              if (!supabaseUrl || !supabaseKey) {
                  res.setHeader('Content-Type', 'text/plain');
                  res.end('Missing Supabase variables');
                  return;
              }
              try {
                const response = await fetch(`${supabaseUrl}/rest/v1/blogs?select=*&order=created_at.desc`, {
                  headers: {
                    'apikey': supabaseKey as string,
                    'Authorization': `Bearer ${supabaseKey}`
                  }
                });
                const blogs = await response.json();
                
                let rss = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n  <title>Usman Imran - Blog</title>\n  <link>http://localhost:5173</link>\n  <description>Latest insights and articles.</description>\n`;
                if(Array.isArray(blogs)) {
                  for (const blog of blogs) {
                    rss += `  <item>\n    <title>${blog.title}</title>\n    <link>http://localhost:5173/blog/${blog.slug}</link>\n    <description>${blog.excerpt}</description>\n    <pubDate>${new Date(blog.created_at).toUTCString()}</pubDate>\n  </item>\n`;
                  }
                }
                rss += `</channel>\n</rss>`;
                res.setHeader('Content-Type', 'application/rss+xml');
                res.end(rss);
                return;
              } catch (err) {
                console.error(err);
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
