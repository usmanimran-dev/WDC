import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, CreditCard, Filter } from 'lucide-react';

export default function FunnelAnalytics() {
    const [funnelData, setFunnelData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        qualified: 0,
        paid: 0,
        conversionRate: 0
    });

    useEffect(() => {
        loadFunnelData();
    }, []);

    const loadFunnelData = async () => {
        setLoading(true);
        try {
            // First check if the table exists by doing a simple count
            const { count, error } = await supabase
                .from('funnel_events')
                .select('*', { count: 'exact', head: true });
                
            if (error) {
                console.error("Funnel events table likely missing:", error);
                setLoading(false);
                return;
            }

            // Get all events
            const { data: events } = await supabase
                .from('funnel_events')
                .select('*')
                .order('created_at', { ascending: true });

            if (events && events.length > 0) {
                const uniqueSessions = new Set();
                const qualifiedSessions = new Set();
                const paidSessions = new Set();

                events.forEach(event => {
                    const sid = event.session_id;
                    if (event.event_name === 'opened_modal') uniqueSessions.add(sid);
                    if (event.event_name === 'passed_qualification') qualifiedSessions.add(sid);
                    if (event.event_name === 'initiate_checkout' || event.event_name === 'completed_payment') paidSessions.add(sid);
                });

                const views = uniqueSessions.size;
                const qualified = qualifiedSessions.size;
                const paid = paidSessions.size;

                setStats({
                    totalViews: views,
                    qualified: qualified,
                    paid: paid,
                    conversionRate: views > 0 ? ((paid / views) * 100) : 0
                });

                setFunnelData([
                    { name: 'Opened Modal', count: views, fill: '#64748b' },
                    { name: 'Qualified', count: qualified, fill: '#0ea5e9' },
                    { name: 'Paid / Checkout', count: paid, fill: '#00e5a0' },
                ]);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 pb-32">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Funnel Analytics</h1>
                <p className="text-slate-400 mt-1 text-sm">Track conversion rates from the Hire Us modal.</p>
            </div>

            {/* Warning Message if no data / table missing */}
            {funnelData.length === 0 && !loading && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 text-amber-200 text-sm">
                    <strong>Note:</strong> No funnel data was found. If you haven't run the SQL setup script yet to create the <code>funnel_events</code> table, please do so. Then test opening the "Hire Us" modal to generate event data.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-400 text-sm font-medium">Modal Opens</p>
                        <div className="p-2 bg-slate-800 rounded-lg"><Users className="w-4 h-4 text-slate-300" /></div>
                    </div>
                    <p className="text-3xl font-bold text-white">{loading ? '—' : stats.totalViews}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-400 text-sm font-medium">Qualified Leads</p>
                        <div className="p-2 bg-cyan-900/30 rounded-lg"><Filter className="w-4 h-4 text-cyan-400" /></div>
                    </div>
                    <p className="text-3xl font-bold text-white">{loading ? '—' : stats.qualified}</p>
                    <p className="text-xs text-slate-500 mt-2">
                        {stats.totalViews > 0 ? Math.round((stats.qualified / stats.totalViews) * 100) : 0}% of opens
                    </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-slate-400 text-sm font-medium">Converted (Paid)</p>
                        <div className="p-2 bg-mint/10 rounded-lg"><CreditCard className="w-4 h-4 text-mint" /></div>
                    </div>
                    <p className="text-3xl font-bold text-white">{loading ? '—' : stats.paid}</p>
                    <p className="text-xs text-mint mt-2 font-bold">
                        {loading ? '—' : stats.conversionRate.toFixed(1)}% Conversion Rate
                    </p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-96">
                <h3 className="text-white font-bold mb-6">Conversion Funnel Drop-off</h3>
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                         <div className="w-8 h-8 border-4 border-slate-700 border-t-mint rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart
                            data={funnelData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                            <XAxis type="number" stroke="#475569" />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                cursor={{fill: '#1e293b'}}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
