import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import {
    X, ArrowLeft, ArrowRight, Check, Loader2,
    Smartphone, Globe, Bot, Workflow, Building2,
    Database, Cloud, Users,
    Palette, ShoppingCart, Gauge, Shield,
    Brain, MessageSquare, Zap, BarChart3,
    Cog, GitBranch, Server, MonitorCheck,
    Layout, FileSpreadsheet, Phone, Mail, User, Briefcase, DollarSign, Clock, Send
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ProjectTypeOption {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    color: string;
}

interface FollowUpOption {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface FormData {
    projectType: string;
    features: string[];
    budget: string;
    timeline: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const projectTypes: ProjectTypeOption[] = [
    { id: 'mobile-app', label: 'Mobile App', icon: Smartphone, description: 'iOS & Android applications', color: 'from-blue-500 to-cyan-400' },
    { id: 'website', label: 'Website', icon: Globe, description: 'Web apps & landing pages', color: 'from-purple-500 to-pink-400' },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot, description: 'Custom AI-powered solutions', color: 'from-emerald-500 to-teal-400' },
    { id: 'n8n-automation', label: 'N8N Automation', icon: Workflow, description: 'Workflow automation flows', color: 'from-orange-500 to-amber-400' },
    { id: 'erp-system', label: 'ERP System', icon: Building2, description: 'Enterprise resource planning', color: 'from-rose-500 to-red-400' },
    { id: 'etl-pipeline', label: 'ETL Pipeline', icon: Database, description: 'Data extraction & transforms', color: 'from-indigo-500 to-violet-400' },
    { id: 'devops', label: 'DevOps', icon: Cloud, description: 'CI/CD & cloud infrastructure', color: 'from-sky-500 to-blue-400' },
    { id: 'crm', label: 'CRM', icon: Users, description: 'Customer relationship tools', color: 'from-lime-500 to-green-400' },
];

const featuresByType: Record<string, FollowUpOption[]> = {
    'mobile-app': [
        { id: 'ios-android', label: 'iOS & Android (Cross-platform)', icon: Smartphone },
        { id: 'push-notifications', label: 'Push Notifications', icon: MessageSquare },
        { id: 'payment-integration', label: 'Payment Integration', icon: ShoppingCart },
        { id: 'realtime-chat', label: 'Real-time Chat/Messaging', icon: MessageSquare },
        { id: 'gps-maps', label: 'GPS & Maps Integration', icon: Globe },
        { id: 'offline-mode', label: 'Offline Mode', icon: Shield },
    ],
    'website': [
        { id: 'ecommerce', label: 'E-Commerce / Online Store', icon: ShoppingCart },
        { id: 'custom-design', label: 'Custom UI/UX Design', icon: Palette },
        { id: 'cms', label: 'Content Management System', icon: FileSpreadsheet },
        { id: 'seo-optimization', label: 'SEO Optimization', icon: Gauge },
        { id: 'dashboard', label: 'Admin Dashboard', icon: Layout },
        { id: 'auth-system', label: 'User Authentication', icon: Shield },
    ],
    'ai-agent': [
        { id: 'chatbot', label: 'Customer Support Chatbot', icon: MessageSquare },
        { id: 'content-gen', label: 'Content Generation', icon: Brain },
        { id: 'data-analysis', label: 'Data Analysis & Insights', icon: BarChart3 },
        { id: 'voice-assistant', label: 'Voice Assistant', icon: Phone },
        { id: 'custom-llm', label: 'Custom LLM Fine-tuning', icon: Cog },
        { id: 'rag-system', label: 'RAG Knowledge Base', icon: Database },
    ],
    'n8n-automation': [
        { id: 'email-auto', label: 'Email Auto-Response', icon: Mail },
        { id: 'crm-sync', label: 'CRM Data Sync', icon: Users },
        { id: 'social-posting', label: 'Social Media Auto-posting', icon: Globe },
        { id: 'lead-scoring', label: 'Lead Scoring & Routing', icon: BarChart3 },
        { id: 'invoice-auto', label: 'Invoice & Payment Automation', icon: DollarSign },
        { id: 'webhook-integration', label: 'Custom Webhook Integrations', icon: Zap },
    ],
    'erp-system': [
        { id: 'inventory', label: 'Inventory Management', icon: Database },
        { id: 'hr-payroll', label: 'HR & Payroll', icon: Users },
        { id: 'accounting', label: 'Accounting & Finance', icon: DollarSign },
        { id: 'supply-chain', label: 'Supply Chain Management', icon: Workflow },
        { id: 'multi-branch', label: 'Multi-Branch Support', icon: Building2 },
        { id: 'reporting', label: 'Custom Reporting & Analytics', icon: BarChart3 },
    ],
    'etl-pipeline': [
        { id: 'data-migration', label: 'Data Migration', icon: Database },
        { id: 'real-time-stream', label: 'Real-Time Data Streaming', icon: Zap },
        { id: 'data-warehouse', label: 'Data Warehousing', icon: Server },
        { id: 'api-integration', label: 'API Data Integration', icon: GitBranch },
        { id: 'data-cleaning', label: 'Data Cleaning & Validation', icon: Shield },
        { id: 'bi-dashboards', label: 'BI Dashboards', icon: BarChart3 },
    ],
    'devops': [
        { id: 'cicd', label: 'CI/CD Pipeline Setup', icon: GitBranch },
        { id: 'docker-k8s', label: 'Docker & Kubernetes', icon: Server },
        { id: 'aws-gcp-azure', label: 'AWS / GCP / Azure Setup', icon: Cloud },
        { id: 'monitoring', label: 'Monitoring & Alerting', icon: MonitorCheck },
        { id: 'security-audit', label: 'Security Audit & Hardening', icon: Shield },
        { id: 'auto-scaling', label: 'Auto-Scaling Infrastructure', icon: Gauge },
    ],
    'crm': [
        { id: 'lead-management', label: 'Lead Management', icon: Users },
        { id: 'sales-pipeline', label: 'Sales Pipeline Tracking', icon: BarChart3 },
        { id: 'email-campaigns', label: 'Email Campaign Management', icon: Mail },
        { id: 'customer-portal', label: 'Customer Self-Service Portal', icon: Globe },
        { id: 'custom-fields', label: 'Custom Fields & Workflows', icon: Cog },
        { id: 'integrations', label: '3rd Party Integrations', icon: Zap },
    ],
};

const budgetOptions = [
    { id: 'under-1k', label: 'Under $1,000', sublabel: 'Small project / MVP' },
    { id: '1k-5k', label: '$1,000 – $5,000', sublabel: 'Standard project' },
    { id: '5k-15k', label: '$5,000 – $15,000', sublabel: 'Complex solution' },
    { id: '15k-plus', label: '$15,000+', sublabel: 'Enterprise-grade' },
    { id: 'not-sure', label: 'Not sure yet', sublabel: 'Need consultation' },
];

const timelineOptions = [
    { id: 'urgent', label: 'ASAP (< 2 weeks)', sublabel: 'Rush delivery' },
    { id: '1-month', label: '1 Month', sublabel: 'Standard timeline' },
    { id: '2-3-months', label: '2 – 3 Months', sublabel: 'Feature-rich build' },
    { id: '3-plus', label: '3+ Months', sublabel: 'Large-scale project' },
    { id: 'flexible', label: 'Flexible', sublabel: 'No hard deadline' },
];

// ─── Step Indicator ──────────────────────────────────────────────────────────
const StepIndicator = ({ current, total }: { current: number; total: number }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
                <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        i < current
                            ? 'bg-mint text-darkNavy'
                            : i === current
                                ? 'bg-mint/20 text-mint border-2 border-mint'
                                : 'bg-white/10 text-white/30 border border-white/10'
                    }`}
                    animate={i === current ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {i < current ? <Check className="w-4 h-4" /> : i + 1}
                </motion.div>
                {i < total - 1 && (
                    <div className={`w-8 h-[2px] rounded-full transition-all duration-500 ${
                        i < current ? 'bg-mint' : 'bg-white/10'
                    }`} />
                )}
            </div>
        ))}
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
interface HireUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HireUsModal({ isOpen, onClose }: HireUsModalProps) {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        projectType: '',
        features: [],
        budget: '',
        timeline: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
    });

    const totalSteps = 5; // 0: Project Type, 1: Features, 2: Budget & Timeline, 3: Contact Info, 4: Review

    const goNext = useCallback(() => {
        setDirection(1);
        setStep(s => Math.min(s + 1, totalSteps - 1));
    }, []);

    const goBack = useCallback(() => {
        setDirection(-1);
        setStep(s => Math.max(s - 1, 0));
    }, []);

    const toggleFeature = (featureId: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.includes(featureId)
                ? prev.features.filter(f => f !== featureId)
                : [...prev.features, featureId],
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // Simulate API call — in production, send to Supabase or email service
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitting(false);
        setSubmitted(true);
    };

    const handleClose = () => {
        onClose();
        // Reset after animation completes
        setTimeout(() => {
            setStep(0);
            setSubmitted(false);
            setFormData({
                projectType: '',
                features: [],
                budget: '',
                timeline: '',
                name: '',
                email: '',
                phone: '',
                company: '',
                message: '',
            });
        }, 300);
    };

    const canProceed = () => {
        switch (step) {
            case 0: return !!formData.projectType;
            case 1: return formData.features.length > 0;
            case 2: return !!formData.budget && !!formData.timeline;
            case 3: return !!formData.name && !!formData.email;
            default: return true;
        }
    };

    const selectedType = projectTypes.find(t => t.id === formData.projectType);

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 80 : -80,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -80 : 80,
            opacity: 0,
        }),
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0c1222] border border-white/10 rounded-3xl shadow-2xl shadow-mint/5"
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 md:p-10">
                            {submitted ? (
                                /* ── Success Screen ── */
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <motion.div
                                        className="w-24 h-24 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-8"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Check className="w-12 h-12 text-mint" />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Request Submitted! 🎉</h2>
                                    <p className="text-white/60 text-lg mb-2">
                                        Thank you, <span className="text-mint font-semibold">{formData.name}</span>!
                                    </p>
                                    <p className="text-white/50 mb-8 max-w-md mx-auto">
                                        We've received your project request for <span className="text-white/80 font-medium">{selectedType?.label}</span>. Our team will review it and get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="px-8 py-3 rounded-xl bg-mint text-darkNavy font-bold hover:bg-mint/90 transition-colors"
                                    >
                                        Close
                                    </button>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Step Indicator */}
                                    <StepIndicator current={step} total={totalSteps} />

                                    {/* Step Content */}
                                    <AnimatePresence mode="wait" custom={direction}>
                                        <motion.div
                                            key={step}
                                            custom={direction}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            {/* STEP 0: Project Type */}
                                            {step === 0 && (
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">What do you need help with?</h2>
                                                    <p className="text-white/50 mb-8">Select the type of project you're looking for.</p>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {projectTypes.map((type) => {
                                                            const Icon = type.icon;
                                                            const isSelected = formData.projectType === type.id;
                                                            return (
                                                                <motion.button
                                                                    key={type.id}
                                                                    onClick={() => setFormData(prev => ({ ...prev, projectType: type.id, features: [] }))}
                                                                    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-center ${
                                                                        isSelected
                                                                            ? 'bg-mint/10 border-mint text-mint shadow-lg shadow-mint/10'
                                                                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                                                                    }`}
                                                                    whileHover={{ y: -2 }}
                                                                    whileTap={{ scale: 0.97 }}
                                                                >
                                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                                        isSelected ? 'bg-mint/20' : 'bg-white/5'
                                                                    }`}>
                                                                        <Icon className="w-6 h-6" />
                                                                    </div>
                                                                    <span className="text-sm font-semibold leading-tight">{type.label}</span>
                                                                    <span className="text-[10px] text-white/40 leading-tight">{type.description}</span>
                                                                    {isSelected && (
                                                                        <motion.div
                                                                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-mint flex items-center justify-center"
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                        >
                                                                            <Check className="w-3 h-3 text-darkNavy" />
                                                                        </motion.div>
                                                                    )}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 1: Features */}
                                            {step === 1 && formData.projectType && (
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                        What features do you need?
                                                    </h2>
                                                    <p className="text-white/50 mb-8">
                                                        Select all that apply for your <span className="text-mint">{selectedType?.label}</span> project.
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {(featuresByType[formData.projectType] || []).map((feature) => {
                                                            const Icon = feature.icon;
                                                            const isSelected = formData.features.includes(feature.id);
                                                            return (
                                                                <motion.button
                                                                    key={feature.id}
                                                                    onClick={() => toggleFeature(feature.id)}
                                                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left ${
                                                                        isSelected
                                                                            ? 'bg-mint/10 border-mint text-white'
                                                                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
                                                                    }`}
                                                                    whileTap={{ scale: 0.97 }}
                                                                >
                                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                                        isSelected ? 'bg-mint text-darkNavy' : 'bg-white/5'
                                                                    }`}>
                                                                        {isSelected ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                                                    </div>
                                                                    <span className="text-sm font-medium">{feature.label}</span>
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 2: Budget & Timeline */}
                                            {step === 2 && (
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Budget & Timeline</h2>
                                                    <p className="text-white/50 mb-8">Help us understand your project scope.</p>

                                                    {/* Budget */}
                                                    <div className="mb-8">
                                                        <label className="flex items-center gap-2 text-sm font-semibold text-mint mb-4 tracking-wider uppercase">
                                                            <DollarSign className="w-4 h-4" /> Estimated Budget
                                                        </label>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {budgetOptions.map(opt => (
                                                                <motion.button
                                                                    key={opt.id}
                                                                    onClick={() => setFormData(prev => ({ ...prev, budget: opt.id }))}
                                                                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                                                                        formData.budget === opt.id
                                                                            ? 'bg-mint/10 border-mint'
                                                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                                    }`}
                                                                    whileTap={{ scale: 0.97 }}
                                                                >
                                                                    <div className="text-sm font-bold text-white">{opt.label}</div>
                                                                    <div className="text-xs text-white/40 mt-1">{opt.sublabel}</div>
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Timeline */}
                                                    <div>
                                                        <label className="flex items-center gap-2 text-sm font-semibold text-mint mb-4 tracking-wider uppercase">
                                                            <Clock className="w-4 h-4" /> Expected Timeline
                                                        </label>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {timelineOptions.map(opt => (
                                                                <motion.button
                                                                    key={opt.id}
                                                                    onClick={() => setFormData(prev => ({ ...prev, timeline: opt.id }))}
                                                                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                                                                        formData.timeline === opt.id
                                                                            ? 'bg-mint/10 border-mint'
                                                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                                    }`}
                                                                    whileTap={{ scale: 0.97 }}
                                                                >
                                                                    <div className="text-sm font-bold text-white">{opt.label}</div>
                                                                    <div className="text-xs text-white/40 mt-1">{opt.sublabel}</div>
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 3: Contact Info */}
                                            {step === 3 && (
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Tell us about yourself</h2>
                                                    <p className="text-white/50 mb-8">So we can get back to you with a proposal.</p>
                                                    <div className="space-y-5">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="flex items-center gap-2 text-xs font-semibold text-mint uppercase tracking-wider mb-2">
                                                                    <User className="w-3 h-3" /> Full Name *
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.name}
                                                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                                    placeholder="John Doe"
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:bg-white/10 focus:outline-none transition-all"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="flex items-center gap-2 text-xs font-semibold text-mint uppercase tracking-wider mb-2">
                                                                    <Briefcase className="w-3 h-3" /> Company
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={formData.company}
                                                                    onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                                                    placeholder="Acme Inc."
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:bg-white/10 focus:outline-none transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="flex items-center gap-2 text-xs font-semibold text-mint uppercase tracking-wider mb-2">
                                                                    <Mail className="w-3 h-3" /> Email *
                                                                </label>
                                                                <input
                                                                    type="email"
                                                                    value={formData.email}
                                                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                                    placeholder="john@example.com"
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:bg-white/10 focus:outline-none transition-all"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="flex items-center gap-2 text-xs font-semibold text-mint uppercase tracking-wider mb-2">
                                                                    <Phone className="w-3 h-3" /> Phone
                                                                </label>
                                                                <input
                                                                    type="tel"
                                                                    value={formData.phone}
                                                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                                    placeholder="+1 (555) 123-4567"
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:bg-white/10 focus:outline-none transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="flex items-center gap-2 text-xs font-semibold text-mint uppercase tracking-wider mb-2">
                                                                <MessageSquare className="w-3 h-3" /> Additional Details
                                                            </label>
                                                            <textarea
                                                                value={formData.message}
                                                                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                                                placeholder="Tell us more about your vision, challenges, or specific requirements..."
                                                                rows={3}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:bg-white/10 focus:outline-none transition-all resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* STEP 4: Review */}
                                            {step === 4 && (
                                                <div>
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Review Your Request</h2>
                                                    <p className="text-white/50 mb-8">Make sure everything looks good before submitting.</p>
                                                    <div className="space-y-4">
                                                        {/* Project Type */}
                                                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                                            <div className="text-xs text-mint font-semibold uppercase tracking-wider mb-2">Project Type</div>
                                                            <div className="flex items-center gap-3">
                                                                {selectedType && <selectedType.icon className="w-5 h-5 text-mint" />}
                                                                <span className="text-white font-bold">{selectedType?.label}</span>
                                                            </div>
                                                        </div>

                                                        {/* Features */}
                                                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                                            <div className="text-xs text-mint font-semibold uppercase tracking-wider mb-3">Selected Features</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {formData.features.map(fId => {
                                                                    const feature = featuresByType[formData.projectType]?.find(f => f.id === fId);
                                                                    return feature ? (
                                                                        <span key={fId} className="text-xs bg-mint/10 text-mint px-3 py-1.5 rounded-full border border-mint/20">
                                                                            {feature.label}
                                                                        </span>
                                                                    ) : null;
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Budget & Timeline */}
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                                                <div className="text-xs text-mint font-semibold uppercase tracking-wider mb-2">Budget</div>
                                                                <span className="text-white font-bold text-sm">
                                                                    {budgetOptions.find(b => b.id === formData.budget)?.label}
                                                                </span>
                                                            </div>
                                                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                                                <div className="text-xs text-mint font-semibold uppercase tracking-wider mb-2">Timeline</div>
                                                                <span className="text-white font-bold text-sm">
                                                                    {timelineOptions.find(t => t.id === formData.timeline)?.label}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Contact */}
                                                        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                                            <div className="text-xs text-mint font-semibold uppercase tracking-wider mb-2">Contact</div>
                                                            <div className="text-sm text-white/80 space-y-1">
                                                                <p><span className="text-white font-semibold">{formData.name}</span> {formData.company && `· ${formData.company}`}</p>
                                                                <p>{formData.email} {formData.phone && `· ${formData.phone}`}</p>
                                                                {formData.message && <p className="text-white/50 mt-2 text-xs italic">"{formData.message}"</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
                                        {step > 0 ? (
                                            <button
                                                onClick={goBack}
                                                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
                                            >
                                                <ArrowLeft className="w-4 h-4" /> Back
                                            </button>
                                        ) : (
                                            <div />
                                        )}

                                        {step < totalSteps - 1 ? (
                                            <motion.button
                                                onClick={goNext}
                                                disabled={!canProceed()}
                                                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                                                    canProceed()
                                                        ? 'bg-mint text-darkNavy hover:bg-mint/90 shadow-lg shadow-mint/20'
                                                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                                                }`}
                                                whileHover={canProceed() ? { scale: 1.02 } : {}}
                                                whileTap={canProceed() ? { scale: 0.98 } : {}}
                                            >
                                                Continue <ArrowRight className="w-4 h-4" />
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                onClick={handleSubmit}
                                                disabled={submitting}
                                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-mint to-emerald-500 text-darkNavy hover:shadow-lg hover:shadow-mint/30 transition-all duration-300 disabled:opacity-60"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" /> Submit Request
                                                    </>
                                                )}
                                            </motion.button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
