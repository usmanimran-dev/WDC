import { supabase } from '@/lib/supabase';

export interface CommunityMessage {
  id: string;
  user_id: string;
  full_name: string;
  designation: string;
  content: string;
  created_at: string;
}

export const getMessages = async (limit = 50) => {
  const { data, error } = await supabase
    .from('community_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as CommunityMessage[]).reverse();
};

export const sendMessage = async (userId: string, fullName: string, designation: string, content: string) => {
  const { data, error } = await supabase
    .from('community_messages')
    .insert([{
      user_id: userId,
      full_name: fullName,
      designation: designation,
      content: content.trim()
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Hook-like listener for realtime
export const subscribeToMessages = (callback: (payload: any) => void) => {
  return supabase
    .channel('community_chat')
    .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'community_messages' 
    }, callback)
    .subscribe();
};
