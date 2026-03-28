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
