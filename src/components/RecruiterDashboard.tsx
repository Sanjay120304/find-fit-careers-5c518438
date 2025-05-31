
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Briefcase, FileText, User, Users } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import JobCard from "./JobCard";
import JobPostForm from "./JobPostForm";
import RecruiterProfile from "./RecruiterProfile";
import RecruiterApplications from "./RecruiterApplications";

interface RecruiterDashboardProps {
  onBack: () => void;
}

const RecruiterDashboard = ({ onBack }: RecruiterDashboardProps) => {
  const [showJobPostForm, setShowJobPostForm] = useState(false);
  const { data: jobs, isLoading } = useJobs();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Recruiter Dashboard</h1>
            </div>

            <Dialog open={showJobPostForm} onOpenChange={setShowJobPostForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                </DialogHeader>
                <JobPostForm onSuccess={() => setShowJobPostForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              My Jobs
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Browse All Jobs
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <RecruiterApplications />
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Job Postings</h2>
              <Button onClick={() => setShowJobPostForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-lg">Loading jobs...</div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs?.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <h2 className="text-2xl font-bold">All Job Postings</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-lg">Loading jobs...</div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs?.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <RecruiterProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
