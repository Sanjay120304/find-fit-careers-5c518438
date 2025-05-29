
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Search, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/hooks/useJobs";
import { useProfile } from "@/hooks/useProfile";
import CVUploader from "@/components/CVUploader";
import JobCard from "@/components/JobCard";

interface JobSeekerDashboardProps {
  onBack: () => void;
}

const JobSeekerDashboard = ({ onBack }: JobSeekerDashboardProps) => {
  const [cvUploaded, setCvUploaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: jobs, isLoading } = useJobs();

  const handleCVUpload = (score: number) => {
    setCvUploaded(true);
    setAtsScore(score);
  };

  const filteredJobs = jobs?.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Seeker Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile?.full_name || 'Job Seeker'}!</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* CV Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  CV Analysis
                </CardTitle>
                <CardDescription>
                  Upload your CV to get ATS score and job recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVUploader onUpload={handleCVUpload} />
                {atsScore && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">ATS Score</span>
                      <Badge variant={atsScore >= 80 ? "default" : atsScore >= 60 ? "secondary" : "destructive"}>
                        {atsScore}/100
                      </Badge>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${atsScore}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Summary */}
            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge>{profile.role === 'job_seeker' ? 'Job Seeker' : 'Recruiter'}</Badge>
                    {profile.location && <Badge variant="outline">{profile.location}</Badge>}
                    <Badge>React Developer</Badge>
                    <Badge>5+ Years Experience</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs by title, company, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button>Search</Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {cvUploaded ? 'Recommended Jobs' : 'All Jobs'}
                </h2>
                <Badge variant="outline">{filteredJobs.length} jobs found</Badge>
              </div>

              {isLoading ? (
                <div className="text-center py-8">Loading jobs...</div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={{
                      id: parseInt(job.id),
                      title: job.title,
                      company: job.company.name,
                      location: job.location,
                      salary: job.salary_min && job.salary_max 
                        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                        : 'Salary not specified',
                      type: job.employment_type,
                      relevancyScore: cvUploaded ? Math.floor(Math.random() * 20) + 80 : undefined,
                      description: job.description,
                      requirements: job.requirements || [],
                      postedDate: new Date(job.created_at).toLocaleDateString()
                    }} 
                    showRelevancy={cvUploaded} 
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
