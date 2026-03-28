import { supabase } from '@/lib/supabase';
import { InsertProject, UpdateProject, InsertBlog, UpdateBlog } from '@/types';

// ─── Projects ────────────────────────────────────────────────────────────────

export const adminCreateProject = async (project: InsertProject) => {
    const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const adminUpdateProject = async ({ id, ...updates }: UpdateProject) => {
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const adminDeleteProject = async (id: string) => {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
};

// ─── Blogs ────────────────────────────────────────────────────────────────────

export const adminCreateBlog = async (blog: InsertBlog) => {
    const { data, error } = await supabase
        .from('blogs')
        .insert([blog])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const adminUpdateBlog = async ({ id, ...updates }: UpdateBlog) => {
    const { data, error } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const adminDeleteBlog = async (id: string) => {
    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const adminLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
};

export const adminLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
};

// ─── Developers ──────────────────────────────────────────────────────────────

export const adminGetDevelopers = async () => {
    const { data, error } = await supabase
        .from('developer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};

export const adminUpdateDeveloperStatus = async (id: string, status: string) => {
    const { data, error } = await supabase
        .from('developer_profiles')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
};

// ─── Agency Projects ─────────────────────────────────────────────────────────

export const adminGetAgencyProjects = async () => {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *,
            developer:assigned_developer_id (full_name)
        `)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};

// ─── Payments & Financials ──────────────────────────────────────────────────

export const adminGetPayments = async () => {
    const { data, error } = await supabase
        .from('payments')
        .select(`
            *,
            developer:developer_id (full_name, email, designation),
            project:project_id (title)
        `)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
};

export const adminCreatePayment = async (paymentData: any) => {
    const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();
        
    if (error) throw new Error(error.message);
    return data;
};

export const adminUpdatePaymentStatus = async (id: string, status: string) => {
    const { data, error } = await supabase
        .from('payments')
        .update({ 
            status,
            paid_at: status === 'paid' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();

    // If paid, update the developer's total_earned
    if (status === 'paid' && data) {
        const { data: dev } = await supabase.from('developer_profiles').select('total_earned').eq('id', data.developer_id).single();
        const currentTotal = dev?.total_earned || 0;
        
        await supabase.from('developer_profiles')
            .update({ total_earned: Number(currentTotal) + Number(data.amount) })
            .eq('id', data.developer_id);
    }

    if (error) throw new Error(error.message);
    return data;
};
