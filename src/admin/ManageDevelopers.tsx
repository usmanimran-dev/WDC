import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminGetDevelopers, adminUpdateDeveloperStatus } from '@/services/admin.api';
import { 
  Users, CheckCircle, XCircle, Clock, 
  MapPin, Globe, Loader2, Eye, Shield, 
  Github, Linkedin, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ManageDevelopers() {
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const data = await adminGetDevelopers();
      setDevelopers(data);
    } catch (err: any) {
      toast.error('Failed to load developers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await adminUpdateDeveloperStatus(id, status);
      toast.success(`Status updated to ${status}!`);
      setDevelopers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    } catch (err: any) {
      toast.error('Update failed: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-mint/10 text-mint border-mint/20';
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'suspended': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/10 text-white/50 border-white/20';
    }
  };

  return (
    <div className="space-y-8 min-h-screen pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
            <Users className="w-10 h-10 text-mint" />
            Developer Network
          </h1>
          <p className="text-white/40 mt-2 font-medium tracking-wide">
            Manage international developer network, approve profiles, and assign roles.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-mint" />
          <p className="text-white/30 font-medium tracking-widest uppercase text-xs">Loading Developers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {developers.map((dev, index) => (
              <motion.div
                key={dev.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white/[0.03] border border-white/10 hover:border-mint/30 rounded-3xl p-8 backdrop-blur-sm transition-all hover:shadow-2xl hover:shadow-mint/5 overflow-hidden"
              >
                {/* Status Badge */}
                <div className={`absolute top-8 right-8 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border ${getStatusColor(dev.status)}`}>
                  {dev.status}
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Photo Profile / Initial */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-mint/20 to-royalBlue/20 border border-white/10 flex items-center justify-center text-3xl font-bold text-mint shadow-inner">
                      {dev.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">{dev.full_name}</h2>
                      <p className="text-mint font-medium text-sm mt-1">{dev.designation || 'No Designation Set'}</p>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2 text-white/50 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <Globe className="w-4 h-4 text-royalBlue" />
                        {dev.country || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-white/50 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <MapPin className="w-4 h-4 text-royalBlue" />
                        {dev.city || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-white/50 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <Shield className="w-4 h-4 text-royalBlue" />
                        {dev.role}
                      </div>
                    </div>

                    {dev.bio && (
                      <p className="text-white/40 text-sm leading-relaxed max-w-2xl bg-white/[0.02] p-4 rounded-2xl border border-white/5 italic">
                        "{dev.bio}"
                      </p>
                    )}

                    {/* Socials & Profiles */}
                    <div className="flex gap-4 pt-2">
                      {dev.github_url && (
                        <a href={dev.github_url} target="_blank" className="p-3 bg-white/5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-mint transition-all">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {dev.linkedin_url && (
                        <a href={dev.linkedin_url} target="_blank" className="p-3 bg-white/5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-mint transition-all">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {dev.portfolio_url && (
                        <a href={dev.portfolio_url} target="_blank" className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-mint transition-all text-xs font-bold tracking-widest uppercase">
                          <Eye className="w-4 h-4" /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions (Right Side) */}
                  <div className="flex flex-col gap-3 shrink-0 lg:w-48">
                    {dev.status === 'pending' ? (
                      <button
                        onClick={() => updateStatus(dev.id, 'approved')}
                        disabled={updating === dev.id}
                        className="w-full py-4 rounded-2xl bg-mint hover:bg-mint/90 text-darkNavy font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-glow-mint"
                      >
                        {updating === dev.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Approve Dev
                      </button>
                    ) : dev.status === 'approved' ? (
                      <button
                        onClick={() => updateStatus(dev.id, 'active')}
                        className="w-full py-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 hover:bg-emerald-500/30"
                      >
                        Set Active
                      </button>
                    ) : null}

                    <button
                      onClick={() => updateStatus(dev.id, 'suspended')}
                      className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 hover:bg-red-500/20"
                    >
                      <XCircle className="w-4 h-4" />
                      Suspend
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {developers.length === 0 && (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-20 text-center">
              <Users className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white/40">No Developers Found</h3>
              <p className="text-white/20 mt-2">When someone joins the network, they will appear here for approval.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
