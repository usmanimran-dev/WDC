import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { adminLogout } from '@/services/admin.api';
import { LayoutDashboard, Briefcase, BookOpen, LogOut, ExternalLink, Users, DollarSign } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await adminLogout();
        navigate('/login');
    };

    const navItems = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/admin/analytics', icon: LayoutDashboard, label: 'Funnel Analytics' },
        { to: '/admin/projects', icon: Briefcase, label: 'Projects' },
        { to: '/admin/blogs', icon: BookOpen, label: 'Blog Posts' },
        { to: '/admin/developers', icon: Users, label: 'Developers' },
        { to: '/admin/payments', icon: DollarSign, label: 'Payouts' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                {/* Brand */}
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                            <span className="text-white font-black text-sm">P</span>
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Portfolio CMS</p>
                            <p className="text-slate-500 text-xs">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`
                            }
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer actions */}
                <div className="p-4 border-t border-slate-800 space-y-1">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Public Site
                    </a>
                    <button
                        id="admin-logout"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
