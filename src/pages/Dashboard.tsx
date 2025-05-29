
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import JobSeekerDashboard from "@/components/JobSeekerDashboard";
import RecruiterDashboard from "@/components/RecruiterDashboard";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  if (profile.role === 'job_seeker') {
    return <JobSeekerDashboard onBack={() => navigate('/')} />;
  }

  if (profile.role === 'recruiter') {
    return <RecruiterDashboard onBack={() => navigate('/')} />;
  }

  // Default fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to TalentMatch Pro</h1>
        <p className="text-gray-600">Your account is being set up...</p>
      </div>
    </div>
  );
};

export default Dashboard;
