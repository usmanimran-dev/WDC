import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Globe, Briefcase, ArrowRight,
  Loader2, CheckCircle2, Eye, EyeOff, Code2, Users, DollarSign, Shield
} from 'lucide-react';
import {
  developerSignUp,
  developerSignIn,
  developerForgotPassword,
} from '@/services/developer.api';

type AuthView = 'signin' | 'signup' | 'forgot';

const COUNTRIES = [
  'United States', 'Malaysia', 'Pakistan', 'India', 'United Kingdom',
  'Canada', 'Germany', 'Australia', 'UAE', 'Saudi Arabia',
  'Bangladesh', 'Indonesia', 'Philippines', 'Turkey', 'Nigeria',
  'Egypt', 'South Africa', 'Brazil', 'Mexico', 'Other',
];

const DESIGNATIONS = [
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'Flutter Developer', 'React Native Developer', 'Mobile App Developer',
  'UI/UX Designer', 'DevOps Engineer', 'Project Manager',
  'QA Engineer', 'Data Scientist', 'AI/ML Engineer',
  'Shopify Developer', 'WordPress Developer', 'Blockchain Developer',
];

const benefits = [
  { icon: Code2, title: 'Work on Real Projects', desc: 'Get assigned to enterprise-grade client projects under the DC brand.' },
  { icon: DollarSign, title: 'Guaranteed Payments', desc: 'DC handles all client billing. You get paid reliably, every time.' },
  { icon: Users, title: 'Global Network', desc: 'Collaborate with top developers from around the world.' },
  { icon: Shield, title: 'Brand Authority', desc: 'Work under an established US-based software agency name.' },
];

export default function Join() {
  const navigate = useNavigate();
  const { user, isDeveloper, loading: authLoading } = useAuth();
  const [view, setView] = useState<AuthView>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [country, setCountry] = useState('');

  const resetForm = () => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setFullName('');
    setDesignation('');
    setCountry('');
  };

  // Redirect if already logged in as developer
  useEffect(() => {
    if (!authLoading && user && isDeveloper) {
      navigate('/profile');
    }
  }, [user, isDeveloper, authLoading, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await developerSignUp(email, password, fullName, designation, country);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err: any) {
      setError(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await developerSignIn(email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await developerForgotPassword(email);
      setSuccess('Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-mint/50 focus:ring-1 focus:ring-mint/30 transition-all duration-300';
  const labelClass = 'text-[10px] font-bold text-mint/80 uppercase tracking-[0.2em] mb-1.5 block';
  const iconClass = 'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30';

  return (
    <div className="min-h-screen bg-darkNavy text-white flex flex-col">
      <Helmet>
        <title>Join DC | Developers of Chicago Developer Network</title>
        <meta name="description" content="Join the Developers of Chicago network. Work on premium US projects, get guaranteed payments, and build your career under an established agency brand." />
        <link rel="canonical" href="https://www.developersofchicago.com/join" />
      </Helmet>

      <Header />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 text-mint text-xs font-bold tracking-[0.2em] uppercase mb-8">
                <Users className="w-3.5 h-3.5" />
                DC Developer Network
              </span>

              <h1 className="text-5xl xl:text-6xl font-bold font-display leading-tight mb-6">
                Build With Us.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-royalBlue">
                  Get Paid.
                </span>
              </h1>

              <p className="text-white/50 text-lg mb-12 max-w-lg">
                Join a global network of developers working under the Developers of Chicago brand.
                We handle clients, contracts, and payments — you focus on what you do best: building great software.
              </p>

              <div className="space-y-6">
                {benefits.map((b, i) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-mint/20 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center shrink-0">
                      <b.icon className="w-5 h-5 text-mint" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{b.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Auth Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Mobile heading */}
              <div className="lg:hidden text-center mb-10">
                <h1 className="text-4xl font-bold font-display mb-3">
                  Join <span className="text-mint">DC Network</span>
                </h1>
                <p className="text-white/50 text-sm">Work on premium projects. Get paid reliably.</p>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 mb-8">
                <button
                  onClick={() => { setView('signup'); resetForm(); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                    view === 'signup'
                      ? 'bg-mint text-darkNavy shadow-lg shadow-mint/20'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => { setView('signin'); resetForm(); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                    view === 'signin'
                      ? 'bg-mint text-darkNavy shadow-lg shadow-mint/20'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Form Card */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
                <AnimatePresence mode="wait">

                  {/* ── SIGN UP ── */}
                  {view === 'signup' && (
                    <motion.form
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSignUp}
                      className="space-y-5"
                    >
                      <div>
                        <label className={labelClass}>Full Name</label>
                        <div className="relative">
                          <User className={iconClass} />
                          <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                            placeholder="Muhammad Usman" className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Email</label>
                        <div className="relative">
                          <Mail className={iconClass} />
                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="you@company.com" className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Password</label>
                        <div className="relative">
                          <Lock className={iconClass} />
                          <input type={showPassword ? 'text' : 'password'} required minLength={6}
                            value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="Min 6 characters" className={`${inputClass} pr-11`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Designation</label>
                        <div className="relative">
                          <Briefcase className={iconClass} />
                          <select required value={designation} onChange={e => setDesignation(e.target.value)}
                            className={`${inputClass} appearance-none cursor-pointer`}>
                            <option value="" className="bg-darkNavy">Select your role...</option>
                            {DESIGNATIONS.map(d => (
                              <option key={d} value={d} className="bg-darkNavy">{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Country</label>
                        <div className="relative">
                          <Globe className={iconClass} />
                          <select required value={country} onChange={e => setCountry(e.target.value)}
                            className={`${inputClass} appearance-none cursor-pointer`}>
                            <option value="" className="bg-darkNavy">Select country...</option>
                            {COUNTRIES.map(c => (
                              <option key={c} value={c} className="bg-darkNavy">{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
                      )}
                      {success && (
                        <div className="bg-mint/10 border border-mint/30 rounded-xl px-4 py-3 text-mint text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          {success}
                        </div>
                      )}

                      <button type="submit" disabled={loading}
                        className="w-full py-4 rounded-xl bg-mint hover:bg-mint/90 disabled:opacity-50 text-darkNavy font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> :
                          <>Join DC Network <ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </motion.form>
                  )}

                  {/* ── SIGN IN ── */}
                  {view === 'signin' && (
                    <motion.form
                      key="signin"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSignIn}
                      className="space-y-5"
                    >
                      <div>
                        <label className={labelClass}>Email</label>
                        <div className="relative">
                          <Mail className={iconClass} />
                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="you@company.com" className={inputClass} />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Password</label>
                        <div className="relative">
                          <Lock className={iconClass} />
                          <input type={showPassword ? 'text' : 'password'} required
                            value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••••••" className={`${inputClass} pr-11`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button type="button" onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                        className="text-mint/60 hover:text-mint text-xs font-medium tracking-wider uppercase transition-colors">
                        Forgot Password?
                      </button>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
                      )}

                      <button type="submit" disabled={loading}
                        className="w-full py-4 rounded-xl bg-mint hover:bg-mint/90 disabled:opacity-50 text-darkNavy font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</> :
                          <>Sign In <ArrowRight className="w-4 h-4" /></>}
                      </button>
                    </motion.form>
                  )}

                  {/* ── FORGOT PASSWORD ── */}
                  {view === 'forgot' && (
                    <motion.form
                      key="forgot"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleForgot}
                      className="space-y-5"
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-white mb-2">Reset Password</h3>
                        <p className="text-white/40 text-sm">Enter your email and we'll send a reset link.</p>
                      </div>

                      <div>
                        <label className={labelClass}>Email</label>
                        <div className="relative">
                          <Mail className={iconClass} />
                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="you@company.com" className={inputClass} />
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
                      )}
                      {success && (
                        <div className="bg-mint/10 border border-mint/30 rounded-xl px-4 py-3 text-mint text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          {success}
                        </div>
                      )}

                      <button type="submit" disabled={loading}
                        className="w-full py-4 rounded-xl bg-mint hover:bg-mint/90 disabled:opacity-50 text-darkNavy font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> :
                          'Send Reset Link'}
                      </button>

                      <button type="button" onClick={() => { setView('signin'); setError(''); setSuccess(''); }}
                        className="w-full text-center text-white/40 hover:text-white text-xs font-medium tracking-wider uppercase transition-colors">
                        ← Back to Sign In
                      </button>
                    </motion.form>
                  )}

                </AnimatePresence>
              </div>

              <p className="text-center text-white/20 text-[10px] mt-6 font-medium tracking-[0.25em] uppercase">
                DC Developer Network · Secured by Supabase
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
