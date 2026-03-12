import { useState, useEffect } from 'react';
import { fetchAllBlogs } from '@/services/public.api';
import { BlogPost as BlogPostType } from '@/types';
import { formatDate, readingTime } from '@/utils/formatters';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlogList() {
    const [blogs, setBlogs] = useState<BlogPostType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAllBlogs().then(data => {
            setBlogs(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-darkNavy text-white">
            <Header />
            <main className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold font-display mb-12">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-royalBlue">Blog</span> Posts
                </h1>
                
                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading blogs...</div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">No blog posts available right now.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map(blog => (
                            <Link 
                                to={`/blog/${blog.slug}`} 
                                key={blog.id}
                                className="group relative block p-8 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mint/50 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-mint/10 rounded-xl text-mint transition-all">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-mint group-hover:text-darkNavy border border-white/10 text-white/50 transition-colors duration-300">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-white leading-tight mb-4 group-hover:text-mint transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-sm text-white/60 leading-relaxed mb-6 line-clamp-3">
                                        {blog.excerpt}
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="inline-block text-mint text-sm font-semibold group-hover:underline mb-4">Read More</span>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                                        <span className="text-[10px] font-bold tracking-widest text-mint uppercase">
                                            {formatDate(blog.created_at)}
                                        </span>
                                        <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase border border-white/10 px-3 py-1 rounded-md group-hover:border-white/20 transition-colors">
                                            {readingTime(blog.content)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
