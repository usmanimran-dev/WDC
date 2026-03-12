import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Newspaper } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { gsap } from '../utils/gsapConfig';
import { supabase } from '@/lib/supabase';

interface AINewsItem {
    id: string;
    title: string;
    excerpt: string;
    link: string;
    published_at: string;
    created_at: string;
}

export default function AIAnnouncements() {
    const sectionRef = useRef<HTMLElement>(null);
    const [news, setNews] = useState<AINewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const { data, error } = await supabase
                    .from('ai_news')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (error) throw error;
                setNews(data || []);
            } catch (err) {
                console.error('Failed to fetch AI news:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    useEffect(() => {
        if (news.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.from('.ai-news-card', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [news]);

    if (loading) return null;
    if (news.length === 0) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <section ref={sectionRef} id="ai-news" className="py-24 bg-darkNavy relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.06),transparent_60%)]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-mint/10 rounded-lg">
                            <Sparkles className="w-5 h-5 text-mint" />
                        </div>
                        <span className="text-mint font-mono text-sm tracking-widest uppercase">Live Feed</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-display leading-tight text-white">
                        Latest AI{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-royalBlue">
                            Announcements
                        </span>
                    </h2>
                    <p className="text-textSecondary text-lg mt-4 max-w-2xl">
                        Stay ahead of the curve with the latest developments in artificial intelligence, updated automatically.
                    </p>
                </motion.div>

                {/* News Grid */}
                <div className="space-y-4">
                    {news.map((item, index) => (
                        <a
                            key={item.id}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ai-news-card group block"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-mint/30 hover:bg-white/10 transition-all duration-300">
                                {/* Number */}
                                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-mint/10 text-mint font-mono font-bold text-lg flex-shrink-0">
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                {/* Content */}
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-mint transition-colors leading-tight mb-2 line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-white/50 line-clamp-1">
                                        {item.excerpt}
                                    </p>
                                </div>

                                {/* Date & Arrow */}
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <span className="text-xs font-mono text-white/40 tracking-wider uppercase hidden sm:block">
                                        {formatDate(item.published_at || item.created_at)}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-mint group-hover:text-darkNavy group-hover:border-mint transition-all duration-300">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* View All Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-10 text-center"
                >
                    <a
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-mint transition-colors tracking-wider uppercase group"
                    >
                        <Newspaper className="w-4 h-4" />
                        Read All AI Articles
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
