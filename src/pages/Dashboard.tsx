
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, FileText, TrendingUp } from "lucide-react";
import JobSeekerDashboard from "@/components/JobSeekerDashboard";
import RecruiterDashboard from "@/components/RecruiterDashboard";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<'jobseeker' | 'recruiter' | null>(null);

  if (userRole === 'jobseeker') {
    return <JobSeekerDashboard onBack={() => setUserRole(null)} />;
  }

  if (userRole === 'recruiter') {
    return <RecruiterDashboard onBack={() => setUserRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TalentMatch Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Recruitment Platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Smart Matching</h3>
                <p className="text-sm text-gray-600">AI-powered job matching</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">ATS Scoring</h3>
                <p className="text-sm text-gray-600">Automated CV analysis</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Briefcase className="h-12 w-12 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">Job Management</h3>
                <p className="text-sm text-gray-600">Easy job posting tools</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-gray-600">Recruitment insights</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setUserRole('jobseeker')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Job Seeker Portal
              </CardTitle>
              <CardDescription>
                Find your dream job with AI-powered matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  Upload CV for ATS analysis
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  Get job relevancy scores
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  AI-powered job recommendations
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  Track application status
                </li>
              </ul>
              <Button className="w-full" onClick={() => setUserRole('jobseeker')}>
                Enter as Job Seeker
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setUserRole('recruiter')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-purple-600" />
                Recruiter Portal
              </CardTitle>
              <CardDescription>
                Post jobs and find the perfect candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  Post and manage job listings
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  Review candidate applications
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  AI-powered candidate ranking
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  Analytics and insights
                </li>
              </ul>
              <Button className="w-full" onClick={() => setUserRole('recruiter')}>
                Enter as Recruiter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
