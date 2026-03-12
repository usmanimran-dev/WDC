import { supabase } from '@/lib/supabase';
import { Project, BlogPost } from '@/types';

// ─── Projects ────────────────────────────────────────────────────────────────

export const fetchAllProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[fetchAllProjects]', error.message);
        return [];
    }
    return data as Project[];
};

export const fetchProjectBySlug = async (slug: string): Promise<Project | null> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('[fetchProjectBySlug]', error.message);
        return null;
    }
    return data as Project;
};

// ─── Blogs ────────────────────────────────────────────────────────────────────

const MOCK_BLOGS: BlogPost[] = [
    {
        id: '1',
        title: 'The Future of AI in Enterprise Architecture',
        slug: 'future-of-ai-enterprise',
        excerpt: 'How artificial intelligence is reshaping cloud infrastructure and scalable system design for modern tech startups.',
        content: `Artificial intelligence is fundamentally changing how we design enterprise systems.

The integration of LLMs (Large Language Models) into backend architectures has necessitated a new way of thinking about data storage. Using pgvector inside PostgreSQL, alongside embeddings generation, allows us to create semantic search engines directly inside our existing SQL databases.

In a recent enterprise project, we implemented a Zero-Trust architecture that perfectly encapsulated the AI models to prevent data leakage, ensuring that the fintech application could use intelligent document parsing without ever transmitting sensitive consumer data directly to public endpoints.

As SaaS platforms scale, adopting intelligent edge nodes powered by AI logic will be the new standard in delivering micro-personalized experiences.`,
        featured_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        tags: ['AI', 'Enterprise', 'Architecture'],
        created_at: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Building Scalable Blockchain Applications',
        slug: 'scalable-blockchain-applications',
        excerpt: 'A deep dive into Web3, Solana integrations, and high-performance decentralized architectures.',
        content: `As Web3 technologies continue to mature, the focus shifts to scalability and seamless user experience.

Building on high-throughput networks like Solana requires a fundamentally different mental model than traditional HTTP backend systems. In our latest logistics enterprise integration, we utilized blockchain as an immutable ledger to track real-time container movements, eliminating disputes among B2B stakeholders.

Using Rust for smart contracts and Next.js for the frontend, we established a resilient, zero-downtime architecture. One of the key learnings was how to effectively manage RPC node fallbacks to ensure the UI remained snappy even during mainnet congestion.

For fintech systems, the transparency of the blockchain combined with zero-knowledge proofs offers the perfect balance of compliance and privacy.`,
        featured_image: 'https://images.unsplash.com/photo-1618142385311-5dc79d4791e8?auto=format&fit=crop&q=80&w=800',
        tags: ['Blockchain', 'Web3', 'Solana'],
        created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
        id: '3',
        title: 'Next.js 14 and the New Routing Paradigm',
        slug: 'nextjs-14-routing-paradigm',
        excerpt: 'Mastering the App Router and Server Components to dramatically improve WebApp performance.',
        content: `The transition from pages to the App Router in Next.js represents one of the largest shifts in frontend software development.

By default, everything is a Server Component, a paradigm shift that forces developers to think explicitly about where their code runs. This mental shift eliminates massive amounts of JavaScript that used to be sent to the client, leading to huge improvements in Core Web Vitals.

During a recent migration of a massive e-commerce platform bridge, we transitioned from standard React SPA architecture to Next.js 14. The result? Time to Interactive (TTI) dropped by 45%. We utilized Edge Runtime for lighting-fast regional API responses and React Suspense for complex data streaming.

Software development agencies must mandate Server Components as the default for new SaaS platforms—it's simply that much better.`,
        featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        tags: ['Software Dev', 'Next.js', 'React'],
        created_at: new Date(Date.now() - 86400000 * 12).toISOString()
    }
];

export const fetchAllBlogs = async (): Promise<BlogPost[]> => {
    try {
        const response = await fetch('https://dev.to/api/articles?username=muhammad_osman_1fb87a4a12');
        const data = await response.json();
        
        return data.map((article: any) => ({
            id: article.id.toString(),
            title: article.title,
            slug: article.slug,
            excerpt: article.description,
            content: article.body_markdown || article.description,
            featured_image: article.cover_image || article.social_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800', // fallback image
            tags: article.tag_list,
            created_at: article.published_at
        }));
    } catch (error) {
        console.error('Error fetching Dev.to articles:', error);
        return [];
    }
};

export const fetchBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
        const response = await fetch(`https://dev.to/api/articles/muhammad_osman_1fb87a4a12/${slug}`);
        if (!response.ok) return null;
        const article = await response.json();
        
        return {
            id: article.id.toString(),
            title: article.title,
            slug: article.slug,
            excerpt: article.description,
            content: article.body_html || article.body_markdown || article.description,
            featured_image: article.cover_image || article.social_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: article.tag_list,
            created_at: article.published_at
        };
    } catch (error) {
        console.error('Error fetching Dev.to article:', error);
        return null;
    }
};
