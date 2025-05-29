
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Search, LogOut, User, FileText, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useJobs } from "@/hooks/useJobs";
import { useProfile } from "@/hooks/useProfile";
import CVUploader from "@/components/CVUploader";
import JobCard from "@/components/JobCard";
import JobSeekerProfile from "@/components/JobSeekerProfile";

interface JobSeekerDashboardProps {
  onBack: () => void;
}

const JobSeekerDashboard = ({ onBack }: JobSeekerDashboardProps) => {
  const [cvUploaded, setCvUploaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('jobs');
  
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

  // Mock applications data
  const mockApplications = [
    {
      id: 1,
      jobTitle: 'Frontend Developer',
      company: 'TechCorp',
      appliedDate: '2024-01-15',
      status: 'pending' as const,
    },
    {
      id: 2,
      jobTitle: 'React Developer',
      company: 'StartupXYZ',
      appliedDate: '2024-01-10',
      status: 'interview_scheduled' as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'interview_scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Interview Scheduled</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Seeker Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile?.full_name || 'Job Seeker'}!</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Resume
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
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

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applications</span>
                      <Badge>{mockApplications.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interviews</span>
                      <Badge>1</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Views</span>
                      <Badge>23</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
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
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track the status of your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{application.jobTitle}</h3>
                        <p className="text-gray-600">{application.company}</p>
                        <p className="text-sm text-gray-500">Applied on {application.appliedDate}</p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <JobSeekerProfile />
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Management</CardTitle>
                <CardDescription>Upload and manage your resume files</CardDescription>
              </CardHeader>
              <CardContent>
                <CVUploader onUpload={handleCVUpload} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
