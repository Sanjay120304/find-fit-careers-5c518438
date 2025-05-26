
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Search, Star, MapPin, Clock, DollarSign } from "lucide-react";
import CVUploader from "@/components/CVUploader";
import JobCard from "@/components/JobCard";

interface JobSeekerDashboardProps {
  onBack: () => void;
}

const JobSeekerDashboard = ({ onBack }: JobSeekerDashboardProps) => {
  const [cvUploaded, setCvUploaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);

  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      type: "Full-time",
      relevancyScore: 92,
      description: "We're looking for a senior frontend developer with React expertise...",
      requirements: ["React", "TypeScript", "5+ years experience"],
      postedDate: "2 days ago"
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$100k - $130k",
      type: "Full-time",
      relevancyScore: 87,
      description: "Join our fast-growing startup as a full stack engineer...",
      requirements: ["React", "Node.js", "MongoDB"],
      postedDate: "1 week ago"
    },
    {
      id: 3,
      title: "UI/UX Developer",
      company: "Design Studio",
      location: "New York, NY",
      salary: "$90k - $110k",
      type: "Full-time",
      relevancyScore: 78,
      description: "Creative UI/UX developer needed for innovative projects...",
      requirements: ["Figma", "React", "CSS"],
      postedDate: "3 days ago"
    }
  ];

  const handleCVUpload = (score: number) => {
    setCvUploaded(true);
    setAtsScore(score);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Job Seeker Dashboard</h1>
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
            {cvUploaded && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge>React Developer</Badge>
                    <Badge>5+ Years Experience</Badge>
                    <Badge>Full Stack</Badge>
                    <Badge>TypeScript</Badge>
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
                <Badge variant="outline">{mockJobs.length} jobs found</Badge>
              </div>

              {mockJobs.map((job) => (
                <JobCard key={job.id} job={job} showRelevancy={cvUploaded} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
