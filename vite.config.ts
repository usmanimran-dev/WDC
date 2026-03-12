import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'dev-rss-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
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
