import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnnouncementBar = () => {
    const [latestBlog, setLatestBlog] = useState<{ title: string; link: string } | null>(null);

    useEffect(() => {
        // Fetch latest article from dev.to API
        fetch('https://dev.to/api/articles?username=muhammad_osman_1fb87a4a12&per_page=1')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const latest = data[0];
                    if (latest.title && latest.url) {
                        setLatestBlog({ title: latest.title, link: latest.url });
                    }
                } else {
                    // Fallback announcement until you publish your first Dev.to post
                    setLatestBlog({ 
                        title: "Welcome to WDC! Book your free consultation today.", 
                        link: "#contact" 
                    });
                }
            })
            .catch(console.error);
    }, []);

    if (!latestBlog) return null;

    const isExternal = !latestBlog.link.startsWith('#');

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-mint text-darkNavy py-2 px-4 text-center text-sm font-semibold w-full"
            >
                {isExternal ? '🚀 New Blog Post: ' : '🎉 '}
                <a 
                    href={latestBlog.link} 
                    target={isExternal ? '_blank' : '_self'}
                    rel={isExternal ? 'noopener noreferrer' : ''}
                    className="underline hover:text-white transition-colors ml-1"
                    onClick={(e) => {
                        if (!isExternal) {
                            e.preventDefault();
                            const element = document.querySelector(latestBlog.link);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    }}
                >
                    {latestBlog.title}
                </a>
            </motion.div>
        </AnimatePresence>
    );
};
