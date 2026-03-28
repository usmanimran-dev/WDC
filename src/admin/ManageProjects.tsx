import { useEffect, useState } from 'react';
import { fetchAllProjects } from '@/services/public.api';
import { adminCreateProject, adminDeleteProject, adminGetDevelopers } from '@/services/admin.api';
import { Project, InsertProject } from '@/types';
import { formatDate } from '@/utils/formatters';
import { Plus, Trash2, ExternalLink, Github, Loader2, X } from 'lucide-react';

const defaultForm: InsertProject = {
    title: '',
    description: '',
    tech_stack: [],
    architecture_overview: '',
    image_url: '',
    live_url: '',
    github_url: '',
    client_name: '',
    budget: 0,
    assigned_developer_id: '',
    status: 'pending',
};

const ManageProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<InsertProject>(defaultForm);
    const [techInput, setTechInput] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [developers, setDevelopers] = useState<any[]>([]);

    const loadData = async () => {
        setLoading(true);
        const [projData, devData] = await Promise.all([
            fetchAllProjects(),
            adminGetDevelopers()
        ]);
        setProjects(projData);
        setDevelopers(devData.filter(d => ['approved', 'active'].includes(d.status)));
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleAddTech = () => {
        if (techInput.trim() && !form.tech_stack.includes(techInput.trim())) {
            setForm(prev => ({ ...prev, tech_stack: [...prev.tech_stack, techInput.trim()] }));
            setTechInput('');
        }
    };

    const handleRemoveTech = (tech: string) => {
        setForm(prev => ({ ...prev, tech_stack: prev.tech_stack.filter(t => t !== tech) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await adminCreateProject({
                ...form,
                assigned_developer_id: form.assigned_developer_id || null, // send null if empty
            });
            setForm(defaultForm);
            setShowForm(false);
            await loadData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try {
            await adminDeleteProject(id);
            await loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Projects</h1>
                    <p className="text-slate-400 text-sm mt-1">{projects.length} projects in your portfolio</p>
                </div>
                <button
                    id="add-project-btn"
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-xl transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Project
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8">
                    <h2 className="text-white font-bold text-lg mb-6">New Project</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Title *</label>
                                <input
                                    required
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder="My Fintech Project"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Image URL</label>
                                <input
                                    value={form.image_url || ''}
                                    onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Client Name / Company</label>
                                <input
                                    value={form.client_name || ''}
                                    onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))}
                                    placeholder="Acme Corp"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Assign Developer (Optional)</label>
                                <select 
                                    value={form.assigned_developer_id || ''} 
                                    onChange={e => setForm({ ...form, assigned_developer_id: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                                >
                                    <option value="">-- No Assignment (Internal) --</option>
                                    {developers.map(d => (
                                        <option key={d.id} value={d.id}>{d.full_name} ({d.designation})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Budget Allocation (USD)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.budget || ''}
                                    onChange={e => setForm(p => ({ ...p, budget: Number(e.target.value) }))}
                                    placeholder="5000"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Target Deadline</label>
                                <input
                                    type="date"
                                    value={form.deadline ? new Date(form.deadline).toISOString().split('T')[0] : ''}
                                    onChange={e => setForm(p => ({ ...p, deadline: new Date(e.target.value).toISOString() }))}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Description *</label>
                            <textarea
                                required
                                rows={3}
                                value={form.description}
                                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                placeholder="Brief description of the project..."
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Architecture Overview *</label>
                            <textarea
                                required
                                rows={4}
                                value={form.architecture_overview}
                                onChange={e => setForm(p => ({ ...p, architecture_overview: e.target.value }))}
                                placeholder="Describe the system architecture, patterns, and key design decisions..."
                                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                            />
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Tech Stack</label>
                            <div className="flex gap-2 mb-3 flex-wrap">
                                {form.tech_stack.map(tech => (
                                    <span key={tech} className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs rounded-full">
                                        {tech}
                                        <button type="button" onClick={() => handleRemoveTech(tech)}>
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={techInput}
                                    onChange={e => setTechInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                    placeholder="e.g. React, Supabase, TypeScript"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTech}
                                    className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-xl transition-all"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">Live URL</label>
                                <input
                                    value={form.live_url || ''}
                                    onChange={e => setForm(p => ({ ...p, live_url: e.target.value }))}
                                    placeholder="https://myproject.com"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest font-semibold block mb-2">GitHub URL</label>
                                <input
                                    value={form.github_url || ''}
                                    onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))}
                                    placeholder="https://github.com/..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                id="submit-project"
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white font-semibold text-sm rounded-xl transition-all"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {submitting ? 'Creating...' : 'Create Project'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setForm(defaultForm); }}
                                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Projects List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <p className="text-lg">No projects yet.</p>
                    <p className="text-sm mt-1">Click "Add Project" to create your first one.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {projects.map(project => (
                        <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-5 hover:border-slate-700 transition-all">
                            {project.image_url && (
                                <img src={project.image_url} alt={project.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-bold">{project.title}</h3>
                                <p className="text-slate-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
                                    {project.tech_stack.slice(0, 5).map(tech => (
                                        <span key={tech} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full border border-slate-700">{tech}</span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Client</p>
                                        <p className="text-sm text-slate-300 font-medium">{project.client_name || 'Internal'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Assigned To</p>
                                        <p className="text-sm text-slate-300 font-medium">{
                                            project.assigned_developer_id 
                                                ? developers.find(d => d.id === project.assigned_developer_id)?.full_name || 'Assigned'
                                                : 'Unassigned'
                                        }</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Budget</p>
                                        <p className="text-sm text-emerald-400 font-medium font-display">${project.budget?.toLocaleString() || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Status</p>
                                        <span className={`inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-md ${
                                            project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                            project.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                                            'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                            {project.status?.replace('_', ' ') || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-xs mt-2">Created {formatDate(project.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {project.live_url && (
                                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                {project.github_url && (
                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
                                        <Github className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    onClick={() => handleDelete(project.id, project.title)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageProjects;
