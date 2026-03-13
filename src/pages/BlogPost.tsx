import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogBySlug } from '@/services/public.api';
import { BlogPost as BlogPostType } from '@/types';
import { formatDate, readingTime, getValidImageUrl } from '@/utils/formatters';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (slug) {
            fetchBlogBySlug(slug).then(data => {
                setBlog(data);
                setLoading(false);
            });
        }
    }, [slug]);

    return (
        <div className="min-h-screen bg-darkNavy text-white">
            <Header />
            <main className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <Link to="/blog" className="inline-flex items-center text-mint hover:underline mb-8 font-semibold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blogs
                </Link>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-mint animate-spin" />
                    </div>
                ) : !blog ? (
                    <div className="text-center py-20">
                        <h2 className="text-3xl font-bold mb-4">Blog Post Not Found</h2>
                        <p className="text-white/60">The article you are looking for does not exist.</p>
                    </div>
                ) : (
                    <article>
                        <header className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6">
                                {blog.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-white/50 border-b border-white/10 pb-8">
                                <span className="font-semibold text-white/80">{formatDate(blog.created_at)}</span>
                                <span>•</span>
                                <span>{readingTime(blog.content)}</span>
                            </div>
                        </header>
                        
                        {blog.featured_image && (
                            <img 
                                src={getValidImageUrl(blog.featured_image)} 
                                alt={blog.title} 
                                className="w-full h-auto rounded-2xl mb-12 shadow-2xl object-cover max-h-[500px]"
                            />
                        )}

                        <div 
                            className="prose prose-invert prose-lg max-w-none 
                                        prose-headings:font-display prose-a:text-mint hover:prose-a:underline
                                        whitespace-pre-wrap leading-relaxed text-white/80"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </article>
                )}
            </main>
            <Footer />
        </div>
    );
}
