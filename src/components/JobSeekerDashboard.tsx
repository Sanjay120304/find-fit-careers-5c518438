
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, FileText, User, Briefcase } from "lucide-react";
import { useJobs } from "@/hooks/useJobs";
import JobCard from "./JobCard";
import JobSeekerProfile from "./JobSeekerProfile";
import ApplicationsList from "./ApplicationsList";

interface JobSeekerDashboardProps {
  onBack: () => void;
}

const JobSeekerDashboard = ({ onBack }: JobSeekerDashboardProps) => {
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
              <h1 className="text-xl font-semibold">Job Seeker Dashboard</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Available Jobs</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Briefcase className="h-4 w-4" />
                {jobs?.length || 0} jobs available
              </div>
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

          <TabsContent value="applications">
            <ApplicationsList />
          </TabsContent>

          <TabsContent value="profile">
            <JobSeekerProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
