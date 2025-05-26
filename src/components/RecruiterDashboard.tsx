
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Users, Eye, Calendar, TrendingUp } from "lucide-react";
import JobPostForm from "@/components/JobPostForm";
import ApplicationsList from "@/components/ApplicationsList";

interface RecruiterDashboardProps {
  onBack: () => void;
}

const RecruiterDashboard = ({ onBack }: RecruiterDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'post-job' | 'applications'>('overview');

  // Mock data
  const mockStats = {
    activeJobs: 12,
    totalApplications: 156,
    scheduledInterviews: 8,
    avgApplicationsPerJob: 13
  };

  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      applications: 23,
      status: "Active",
      postedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      applications: 45,
      status: "Active",
      postedDate: "2024-01-10"
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Analytics",
      location: "New York, NY",
      applications: 31,
      status: "Draft",
      postedDate: "2024-01-20"
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold">{mockStats.activeJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold">{mockStats.totalApplications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-2xl font-bold">{mockStats.scheduledInterviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg/Job</p>
                <p className="text-2xl font-bold">{mockStats.avgApplicationsPerJob}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                  <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{job.applications}</p>
                    <p className="text-xs text-gray-500">Applications</p>
                  </div>
                  <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
          </div>
          <Button onClick={() => setActiveTab('post-job')}>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === 'post-job' ? 'default' : 'outline'}
            onClick={() => setActiveTab('post-job')}
          >
            Post Job
          </Button>
          <Button 
            variant={activeTab === 'applications' ? 'default' : 'outline'}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'post-job' && <JobPostForm />}
        {activeTab === 'applications' && <ApplicationsList />}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
