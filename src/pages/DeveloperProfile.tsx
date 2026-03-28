import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  User, Mail, Globe, Briefcase, MapPin, Link as LinkIcon,
  Github, Linkedin, Save, Loader2, CheckCircle2, LogOut,
  Shield, Clock, Code2, FolderGit2, DollarSign, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getDeveloperProfile,
  updateDeveloperProfile,
  developerSignOut,
  getAssignedProjects,
  getDeveloperPayments,
  DeveloperProfile as ProfileType,
} from '@/services/developer.api';

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  pending: { label: 'Pending Approval', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock },
  approved: { label: 'Approved', color: 'text-mint bg-mint/10 border-mint/20', icon: CheckCircle2 },
  active: { label: 'Active Developer', color: 'text-mint bg-mint/10 border-mint/20', icon: Shield },
  suspended: { label: 'Suspended', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: Shield },
};

const SKILLS_OPTIONS = [
  'React', 'Next.js', 'Angular', 'Vue.js', 'TypeScript', 'Node.js',
  'Flutter', 'React Native', 'Swift', 'Kotlin',
  'Python', 'Django', 'FastAPI', 'Go', 'Rust',
  'PostgreSQL', 'MongoDB', 'Supabase', 'Firebase',
  'AWS', 'GCP', 'Docker', 'Kubernetes',
  'Shopify', 'WordPress', 'Figma', 'UI/UX',
  'Solana', 'Ethereum', 'Web3',
  'AI/ML', 'OpenAI', 'LangChain',
];

export default function DeveloperProfile() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  
  // New tabs state
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'earnings'>('profile');
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/join'); return; }

    getDeveloperProfile(user.id).then(p => {
      if (p) {
        setProfile(p);
        setFullName(p.full_name);
        setDesignation(p.designation);
        setCountry(p.country);
        setCity(p.city);
        setBio(p.bio);
        setSkills(p.skills || []);
        setPortfolioUrl(p.portfolio_url);
        setLinkedinUrl(p.linkedin_url);
        setGithubUrl(p.github_url);
      } else {
        // Profile doesn't exist yet — set defaults from auth metadata
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
        setFullName(name);
        setProfile({
          id: user.id,
          full_name: name,
          email: user.email || '',
          designation: '', country: '', city: '', bio: '',
          skills: [], portfolio_url: '', linkedin_url: '', github_url: '', avatar_url: '',
          status: 'pending', role: 'developer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return Promise.all([getAssignedProjects(), getDeveloperPayments()]);
    })
    .then((results) => {
        if (results) {
            setProjects(results[0]);
            setPayments(results[1]);
        }
        setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
  }, [user, authLoading, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateDeveloperProfile(user.id, {
        full_name: fullName,
        designation,
        country,
        city,
        bio,
        skills,
        portfolio_url: portfolioUrl,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
      });
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await developerSignOut();
    navigate('/');
  };

  const toggleSkill = (skill: string) => {
    setSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-darkNavy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-mint rounded-full animate-spin" />
      </div>
    );
  }

  const status = STATUS_MAP[profile?.status || 'pending'];
  const StatusIcon = status.icon;

  const inputClass =
    'w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-mint/50 focus:ring-1 focus:ring-mint/30 transition-all duration-300';
  const labelClass = 'text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1.5 block';

  return (
    <div className="min-h-screen bg-darkNavy text-white flex flex-col">
      <Helmet>
        <title>My Profile | DC Developer Network</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Header />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10"
          >
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-mint/20 to-royalBlue/20 border border-white/10 flex items-center justify-center text-3xl font-bold text-mint">
                {fullName?.charAt(0)?.toUpperCase() || 'D'}
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display">{fullName || 'Developer'}</h1>
                <p className="text-white/40 text-sm mt-1">{profile?.email}</p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mt-2 border ${status.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-mint hover:bg-mint/90 disabled:opacity-50 text-darkNavy font-bold text-xs tracking-widest uppercase transition-all">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-400/30 text-white/60 hover:text-red-400 font-bold text-xs tracking-widest uppercase transition-all">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm mb-6">{error}</div>
          )}

          {/* Tab Switcher */}
          <div className="flex bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 mb-8">
            <button
             onClick={() => setActiveTab('profile')}
             className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
               activeTab === 'profile' ? 'bg-mint text-darkNavy shadow-lg shadow-mint/20' : 'text-white/40 hover:text-white/70'
             }`}>
              <User className="w-4 h-4" /> Profile Details
            </button>
            <button
             onClick={() => setActiveTab('projects')}
             className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
               activeTab === 'projects' ? 'bg-mint text-darkNavy shadow-lg shadow-mint/20' : 'text-white/40 hover:text-white/70'
             }`}>
              <FolderGit2 className="w-4 h-4" /> Assigned Projects
            </button>
            <button
             onClick={() => setActiveTab('earnings')}
             className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
               activeTab === 'earnings' ? 'bg-mint text-darkNavy shadow-lg shadow-mint/20' : 'text-white/40 hover:text-white/70'
             }`}>
              <DollarSign className="w-4 h-4" /> My Earnings
            </button>
          </div>

          {/* Profile Form (Tab Content) */}
          {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-mint" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <input type="email" value={profile?.email || ''} disabled
                    className={`${inputClass} opacity-50 cursor-not-allowed`} />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" value={designation} onChange={e => setDesignation(e.target.value)}
                    placeholder="e.g. Full Stack Developer" className={`${inputClass} pl-11`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                    placeholder="e.g. Malaysia" className={`${inputClass} pl-11`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" value={city} onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Kuala Lumpur" className={`${inputClass} pl-11`} />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className={labelClass}>Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)}
                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                rows={4} className={`${inputClass} resize-none`} />
            </div>

            {/* Skills */}
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-mint" />
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {SKILLS_OPTIONS.map(skill => (
                <button key={skill} onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 border ${
                    skills.includes(skill)
                      ? 'bg-mint/20 text-mint border-mint/30'
                      : 'bg-white/[0.02] text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                  }`}>
                  {skill}
                </button>
              ))}
            </div>

            {/* Links */}
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-mint" />
              Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Portfolio</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="url" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)}
                    placeholder="https://yoursite.com" className={`${inputClass} pl-11`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/you" className={`${inputClass} pl-11`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>GitHub</label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/you" className={`${inputClass} pl-11`} />
                </div>
              </div>
            </div>
          </motion.div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                 {projects.length === 0 ? (
                     <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                         <FolderGit2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
                         <h3 className="text-xl font-bold text-white mb-2">No Projects Assigned Yet</h3>
                         <p className="text-white/40 text-sm">When DC assigns you a project, it will appear here with all the details.</p>
                     </div>
                 ) : (
                     projects.map(project => (
                         <div key={project.id} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover:border-mint/30 transition-all">
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold font-display">{project.title}</h3>
                                    <p className="text-white/40 text-sm mt-1 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Deadline: {new Date(project.deadline).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                                    project.status === 'completed' ? 'bg-mint/10 text-mint border-mint/20' :
                                    project.status === 'in_progress' ? 'bg-royalBlue/10 text-royalBlue border-royalBlue/20' :
                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                    {project.status.replace('_', ' ')}
                                </span>
                             </div>
                             <p className="text-white/70 text-sm leading-relaxed mb-6">{project.description}</p>
                             <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                 <span className="text-mint font-bold flex items-center gap-1"><DollarSign className="w-4 h-4"/> Budget Allocated</span>
                                 <button className="flex items-center gap-2 text-white/50 hover:text-mint transition-colors text-sm font-bold uppercase tracking-widest">
                                     Update Status <ArrowUpRight className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                     ))
                 )}
              </motion.div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-mint/20 to-royalBlue/20 border border-mint/20 rounded-3xl p-8">
                          <p className="text-mint font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4"/> Total Earned via DC</p>
                          <h2 className="text-5xl font-bold font-display text-white">${profile?.total_earned?.toLocaleString() || '0'}</h2>
                          <p className="text-white/40 text-xs mt-4 leading-relaxed">All payments securely mediated & processed directly to your payout method.</p>
                      </div>
                      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8">
                          <p className="text-white/50 font-bold text-xs uppercase tracking-widest mb-2">Pending Payouts</p>
                          <h2 className="text-4xl font-bold font-display text-yellow-400">
                             ${payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
                          </h2>
                          <p className="text-white/40 text-xs mt-4">These funds are held securely by DC Agency pending project completion.</p>
                      </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-10 mb-4 px-2">Payment History</h3>
                  {payments.length === 0 ? (
                      <div className="text-center py-10 bg-white/[0.02] border border-white/10 rounded-3xl">
                          <p className="text-white/40 font-medium">No payments processed yet.</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {payments.map(p => (
                              <div key={p.id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                                  <div>
                                      <p className="font-bold text-white">${Number(p.amount).toLocaleString()}</p>
                                      <p className="text-xs text-white/40 mt-1">{p.projects?.title || 'Project Payment'}</p>
                                  </div>
                                  <div className="text-right">
                                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                                          p.status === 'paid' ? 'bg-mint/10 text-mint' : 'bg-yellow-400/10 text-yellow-400'
                                      }`}>
                                          {p.status}
                                      </span>
                                      <p className="text-[10px] text-white/30 mt-2">{new Date(p.created_at).toLocaleDateString()}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </motion.div>
          )}

          {/* Status Info (Only show on profile block) */}
          {activeTab === 'profile' && profile?.status === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-6 text-center"
            >
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Profile Under Review</h3>
              <p className="text-white/40 text-sm max-w-md mx-auto">
                Your profile is being reviewed by the DC team. You'll receive an email once approved.
                In the meantime, complete your profile to speed up the process.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
