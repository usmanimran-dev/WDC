import { useState, useEffect } from 'react';
import { adminGetPayments, adminCreatePayment, adminUpdatePaymentStatus, adminGetAgencyProjects, adminGetDevelopers } from '@/services/admin.api';
import { DollarSign, Plus, CheckCircle2, ArrowRightLeft, Clock, Loader2 } from 'lucide-react';

export default function ManagePayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [developers, setDevelopers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        project_id: '',
        developer_id: '',
        amount: '',
        payment_method: 'Wise',
        status: 'pending'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [pys, prjs, devs] = await Promise.all([
                adminGetPayments(),
                adminGetAgencyProjects(),
                adminGetDevelopers()
            ]);
            setPayments(pys);
            
            // Only show approved/active devs to pay
            setDevelopers(devs.filter(d => ['approved', 'active'].includes(d.status)));
            setProjects(prjs);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await adminCreatePayment({
                project_id: form.project_id || null,
                developer_id: form.developer_id,
                amount: Number(form.amount),
                payment_method: form.payment_method,
                status: form.status
            });
            setShowForm(false);
            setForm({ project_id: '', developer_id: '', amount: '', payment_method: 'Wise', status: 'pending' });
            loadData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id: string, currentStatus: string) => {
        let nextStatus = 'processing';
        if (currentStatus === 'processing') nextStatus = 'paid';
        if (currentStatus === 'paid') return; // Cannot reverse payment tracking easily

        if (!confirm(`Mark payment as ${nextStatus.toUpperCase()}?`)) return;

        try {
            await adminUpdatePaymentStatus(id, nextStatus);
            loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-violet-500" />
                        Payouts Ledger
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage global developer payouts and project funding.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-xl transition-all"
                >
                    <Plus className="w-4 h-4" /> Issue Payout
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
                    <h2 className="text-white font-bold text-lg mb-6">Create New Payout</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Developer *</label>
                                <select required value={form.developer_id} onChange={e => setForm({ ...form, developer_id: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-violet-500">
                                    <option value="">Select Developer</option>
                                    {developers.map(d => <option key={d.id} value={d.id}>{d.full_name} ({d.designation})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Project</label>
                                <select value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-violet-500">
                                    <option value="">No specific project (Bonus/Other)</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Amount (USD) *</label>
                                <input required type="number" min="1" step="0.01" placeholder="500.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-violet-500" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Payment Route</label>
                                <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-violet-500">
                                    <option>Wise</option><option>Payoneer</option><option>Stripe</option><option>Crypto (USDT)</option><option>Bank Transfer</option>
                                </select>
                            </div>
                        </div>
                        {error && <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</div>}
                        <div className="pt-2">
                            <button disabled={submitting} type="submit" className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-all">
                                {submitting ? 'Creating...' : 'Record Payout'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                 <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-violet-400 animate-spin" /></div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50">
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Developer</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Project / Details</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Route</th>
                                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {payments.map(p => (
                                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-white">{p.developer?.full_name || 'Deleted User'}</p>
                                        <p className="text-xs text-slate-400">{p.developer?.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-slate-300">{p.project?.title || 'General Payout'}</p>
                                    </td>
                                    <td className="p-4 font-display font-bold text-violet-400 text-lg">
                                        ${Number(p.amount).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 font-medium">
                                        {p.payment_method}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleUpdateStatus(p.id, p.status)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all ${
                                                p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default' :
                                                p.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                                            }`}
                                        >
                                            {p.status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5"/> : p.status === 'processing' ? <ArrowRightLeft className="w-3.5 h-3.5"/> : <Clock className="w-3.5 h-3.5"/>}
                                            {p.status}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-slate-500">
                                        No payouts recorded.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
