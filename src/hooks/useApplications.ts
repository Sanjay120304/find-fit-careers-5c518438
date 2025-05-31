
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: 'pending' | 'reviewing' | 'interview_scheduled' | 'rejected' | 'accepted';
  cover_letter?: string;
  resume_url?: string;
  applied_at: string;
  ats_score?: number;
  notes?: string;
  job: {
    title: string;
    company: {
      name: string;
    };
  };
  applicant: {
    full_name?: string;
    email: string;
  };
}

export const useApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(title, company:companies(name)),
          applicant:profiles!applicant_id(full_name, email)
        `)
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user,
  });
};

export const useRecruiterApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['recruiter-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs!inner(title, posted_by, company:companies(name)),
          applicant:profiles!applicant_id(full_name, email)
        `)
        .eq('job.posted_by', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (applicationData: {
      job_id: string;
      cover_letter?: string;
      resume_url?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          ...applicationData,
          applicant_id: user.id,
          status: 'pending',
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, notes }: {
      id: string;
      status: 'pending' | 'reviewing' | 'interview_scheduled' | 'rejected' | 'accepted';
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, notes })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-applications'] });
    },
  });
};
