import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, MessagesSquare, Users, Loader2, 
    Link as LinkIcon, ExternalLink, ShieldCheck, 
    Sparkles, Lock, MessageCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
    getMessages, 
    sendMessage, 
    subscribeToMessages, 
    CommunityMessage 
} from '@/services/community.api';
import { formatDistanceToNow } from 'date-fns';

export default function CommunityChat() {
    const navigate = useNavigate();
    const { user, isDeveloper, developerProfile, loading: authLoading } = useAuth();
    const [messages, setMessages] = useState<CommunityMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Load & Auth check
    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate('/join'); return; }

        fetchMessages();

        // Subscribe to Realtime messages
        const channel = subscribeToMessages((payload) => {
            const newMsg = payload.new as CommunityMessage;
            setMessages(prev => [...prev, newMsg]);
        });

        return () => { channel.unsubscribe(); };
    }, [user, authLoading, navigate]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const data = await getMessages();
            setMessages(data);
        } catch (err) {
            console.error('Failed to load chat history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !developerProfile) return;

        setSending(true);
        try {
            await sendMessage(
                user.id, 
                developerProfile.full_name, 
                developerProfile.designation, 
                newMessage
            );
            setNewMessage('');
        } catch (err) {
            console.error('Send failed:', err);
        } finally {
            setSending(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-darkNavy flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-full border-2 border-white/5 border-t-mint animate-spin" />
                <p className="text-white/30 font-bold tracking-[0.3em] uppercase text-xs">Entering Community Chat...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-darkNavy text-white flex flex-col overflow-hidden">
            <Helmet>
                <title>Developer Network Chat | DC Community</title>
                <meta name="description" content="Connect, collaborate, and grow with the Developers of Chicago global developer network." />
            </Helmet>

            <Header />

            <main className="flex-1 pt-32 pb-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col min-h-0">
                
                {/* Chat Container */}
                <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col min-h-0 overflow-hidden">
                    
                    {/* Chat Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-mint/20 text-mint flex items-center justify-center border border-mint/20 shadow-glow-mint/10">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold font-display tracking-tight">Main Lobby</h1>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                        Live Community · Real-time
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white/40 flex items-center gap-2">
                                <Users className="w-3.5 h-3.5" />
                                {developerProfile?.status === 'approved' ? 'Active Member' : 'Pending Membership'}
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar"
                    >
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-10">
                                <Sparkles className="w-12 h-12 text-white/10 mb-6" />
                                <h3 className="text-xl font-bold text-white/40">The conversation starts here.</h3>
                                <p className="text-white/20 text-sm mt-2 max-w-sm font-medium">Be the first to say hello to the Developers of Chicago network!</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <motion.div 
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-4 ${msg.user_id === user?.id ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar Initial */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-lg ${
                                        msg.user_id === user?.id 
                                            ? 'bg-mint text-darkNavy' 
                                            : 'bg-white/5 border border-white/10 text-white/60'
                                    }`}>
                                        {msg.full_name?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`max-w-[70%] space-y-1.5 ${msg.user_id === user?.id ? 'items-end flex flex-col' : ''}`}>
                                        <div className="flex items-center gap-2 text-xs font-bold px-1">
                                            <span className="text-white/80">{msg.full_name}</span>
                                            <span className="text-white/25">·</span>
                                            <span className="text-mint/60">{msg.designation}</span>
                                            <span className="text-white/20 font-medium">
                                                {formatDistanceToNow(new Date(msg.created_at))} ago
                                            </span>
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                                            msg.user_id === user?.id 
                                                ? 'bg-mint/10 border border-mint/20 text-white rounded-tr-none' 
                                                : 'bg-white/5 border border-white/5 text-white/80 rounded-tl-none'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-6 bg-white/[0.03] border-t border-white/10">
                        {developerProfile?.status !== 'approved' && developerProfile?.role !== 'manager' ? (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-center">
                                <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Lock className="w-3.5 h-3.5" />
                                    Account Pending Approval
                                </p>
                                <p className="text-white/30 text-[10px] mt-1">Once you are approved by the DC Admin, you can start chatting!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSend} className="relative flex items-center gap-3">
                                <input 
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message to the community..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-mint transition-all pr-16"
                                />
                                <button 
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-mint hover:bg-mint/90 text-darkNavy flex items-center justify-center transition-all disabled:opacity-50 shadow-glow-mint/20"
                                >
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </form>
                        )}
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-4 text-center">
                            Secure End-to-End Environment · Powered by DC Cloud
                        </p>
                    </div>
                </div>
            </main>

            <div className="pb-8">
                <Footer />
            </div>
        </div>
    );
}
