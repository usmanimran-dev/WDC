import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Users, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { AnnouncementBar } from './AnnouncementBar';
import logoUrl from '../assets/dc-logo-white.png';
import HireUsModal from './HireUsModal';
import { AIEstimatorModal } from './AIEstimatorModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isDeveloper, developerProfile } = useAuth();

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Services', href: '/#services' },
        { label: 'Projects', href: '/#projects' },
        { label: 'Blog', href: '/blog' },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            if (location.pathname !== '/') {
                e.preventDefault();
                navigate(href);
                setIsMobileMenuOpen(false);
            } else {
                e.preventDefault();
                const element = document.querySelector(href.replace('/', ''));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                }
            }
        } else if (href.startsWith('/')) {
            e.preventDefault();
            navigate(href);
            setIsMobileMenuOpen(false);
        }
    };

    return (<>
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex flex-col ${isScrolled
                ? 'bg-darkNavy/80 backdrop-blur-xl shadow-premium border-b border-white/5 supports-[backdrop-filter]:bg-darkNavy/60'
                : 'bg-transparent'
                }`}
        >
            <AnnouncementBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex items-center justify-between h-24 md:h-28 relative">
                    {/* Logo (Left) */}
                    {/* Logo (Left) */}
                    <div className="flex-shrink-0">
                        <motion.a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                if (location.pathname === '/') {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                } else {
                                    navigate('/');
                                }
                            }}
                            className="flex items-center group py-2 cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="relative h-16 md:h-20 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img src={logoUrl} alt="Agency Logo" className="w-auto h-full object-contain mix-blend-multiply" />
                            </motion.div>
                        </motion.a>
                    </div>

                    {/* Desktop Navigation (Center) */}
                    <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
                        {navItems.map((item, index) => (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                onMouseEnter={() => setHoveredPath(item.href)}
                                onMouseLeave={() => setHoveredPath(null)}
                                className="relative px-4 py-2 rounded-lg font-medium text-textSecondary hover:text-white transition-colors"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                <span className="relative z-10">{item.label}</span>
                                {hoveredPath === item.href && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/10 rounded-lg -z-0"
                                        layoutId="navbar-hover"
                                        transition={{
                                            type: "spring",
                                            bounce: 0.2,
                                            duration: 0.6
                                        }}
                                    />
                                )}
                            </motion.a>
                        ))}
                    </nav>

                    {/* CTA Buttons (Right) */}
                    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                        {/* Community Chat Button (Archived)
                        {user && isDeveloper && (
                            <motion.button
                                onClick={() => navigate('/community')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/5 hover:bg-mint/10 hover:border-mint/30 transition-all text-white/40 hover:text-white"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                title="Community Chat"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm font-bold tracking-tight">Chat</span>
                            </motion.button>
                        )}
                        */}

                        {/* Join DC / Profile Button */}
                        {user && isDeveloper ? (
                            <motion.button
                                onClick={() => navigate('/profile')}
                                className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/10 hover:border-mint/30 transition-all group"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mint/20 to-royalBlue/20 flex items-center justify-center text-xs font-bold text-mint">
                                    {developerProfile?.full_name?.charAt(0)?.toUpperCase() || 'D'}
                                </div>
                                <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                                    {developerProfile?.full_name?.split(' ')[0] || 'Profile'}
                                </span>
                            </motion.button>
                        ) : (
                            <motion.button
                                onClick={() => navigate('/join')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-mint/30 text-mint font-medium text-sm hover:bg-mint/10 hover:border-mint transition-all"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Users className="w-4 h-4" />
                                Join DC
                            </motion.button>
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button
                                variant="mint"
                                className="shadow-glow-mint hover:shadow-glow-mint-lg transition-shadow duration-300"
                                onClick={() => setIsHireModalOpen(true)}
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-royalBlue via-mint to-royalBlue origin-left"
                style={{ scaleX }}
            />

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden bg-darkNavy/95 backdrop-blur-xl border-t border-white/10"
                    >
                        <nav className="px-4 py-4 space-y-2">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="block px-4 py-3 rounded-lg font-medium text-textSecondary hover:bg-white/10 hover:text-white transition-colors"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                            <motion.div
                                className="pt-2 flex flex-col gap-3"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <button
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-mint/30 text-mint font-medium hover:bg-mint/10 transition-all"
                                    onClick={() => {
                                        navigate(user && isDeveloper ? '/profile' : '/join');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <Users className="w-4 h-4" />
                                    {user && isDeveloper ? 'My Profile' : 'Join DC'}
                                </button>
                                <Button
                                    variant="mint"
                                    className="w-full"
                                    onClick={() => {
                                        setIsHireModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    Get Started
                                </Button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>

        {/* Hire Us Modal */}
        <HireUsModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
        {/* AI Estimator Modal */}
        <AIEstimatorModal isOpen={isEstimateModalOpen} onClose={() => setIsEstimateModalOpen(false)} />
    </>);
}
