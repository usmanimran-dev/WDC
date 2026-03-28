import { supabase } from '@/lib/supabase';

export interface DeveloperProfile {
  id: string;
  full_name: string;
  email: string;
  designation: string;
  country: string;
  city: string;
  bio: string;
  skills: string[];
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
  avatar_url: string;
  status: 'pending' | 'approved' | 'active' | 'suspended';
  role: 'developer' | 'lead' | 'manager';
  total_earned?: number;
  created_at: string;
  updated_at: string;
}

export const developerSignUp = async (
  email: string,
  password: string,
  fullName: string,
  designation: string,
  country: string
) => {
  // 1. Create the auth user (trigger auto-creates profile row)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: 'developer' },
    },
  });
  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error('Sign up failed. Please try again.');

  // 2. Update the auto-created profile with extra fields
  const { error: profileError } = await supabase
    .from('developer_profiles')
    .update({
      full_name: fullName,
      designation,
      country,
    })
    .eq('id', authData.user.id);
  if (profileError) console.warn('Profile update after signup:', profileError.message);

  return authData;
};

export const developerSignIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
};

export const developerForgotPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/profile`,
  });
  if (error) throw new Error(error.message);
};

export const developerSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getDeveloperProfile = async (userId: string): Promise<DeveloperProfile | null> => {
  const { data, error } = await supabase
    .from('developer_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
};

export const updateDeveloperProfile = async (
  userId: string,
  updates: Partial<Omit<DeveloperProfile, 'id' | 'email' | 'status' | 'role' | 'created_at' | 'updated_at'>>
) => {
  const { data, error } = await supabase
    .from('developer_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// --- Projects & Payments ---

export const getAssignedProjects = async () => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
};

export const getDeveloperPayments = async () => {
    const { data, error } = await supabase
        .from('payments')
        .select(`
            *,
            projects:project_id (title)
        `)
        .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
};

export const updateProjectStatus = async (projectId: string, status: string) => {
    const { data, error } = await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId)
        .select()
        .single();
        
    if (error) throw new Error(error.message);
    return data;
};
