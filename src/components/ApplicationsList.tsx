
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Download, Eye, Star, Calendar, Filter } from "lucide-react";

const ApplicationsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');

  // Mock applications data
  const mockApplications = [
    {
      id: 1,
      candidateName: "Sarah Johnson",
      email: "sarah.j@email.com",
      position: "Senior Frontend Developer",
      appliedDate: "2024-01-20",
      status: "Under Review",
      atsScore: 92,
      experience: "5 years",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      email: "m.chen@email.com",
      position: "Senior Frontend Developer",
      appliedDate: "2024-01-19",
      status: "Interview Scheduled",
      atsScore: 88,
      experience: "6 years",
      location: "Remote",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      candidateName: "Emily Rodriguez",
      email: "emily.r@email.com",
      position: "Full Stack Engineer",
      appliedDate: "2024-01-18",
      status: "New",
      atsScore: 85,
      experience: "4 years",
      location: "New York, NY",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      candidateName: "David Kim",
      email: "david.kim@email.com",
      position: "UI/UX Developer",
      appliedDate: "2024-01-17",
      status: "Rejected",
      atsScore: 73,
      experience: "3 years",
      location: "Austin, TX",
      avatar: "/placeholder.svg"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Interview Scheduled': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesJob = jobFilter === 'all' || app.position === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="Senior Frontend Developer">Senior Frontend Developer</SelectItem>
                <SelectItem value="Full Stack Engineer">Full Stack Engineer</SelectItem>
                <SelectItem value="UI/UX Developer">UI/UX Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Applications</h2>
          <Badge variant="outline">{filteredApplications.length} applications</Badge>
        </div>

        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.avatar} />
                    <AvatarFallback>
                      {application.candidateName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{application.candidateName}</h3>
                    <p className="text-gray-600">{application.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Applied for: <strong>{application.position}</strong></span>
                      <span>•</span>
                      <span>{application.experience} experience</span>
                      <span>•</span>
                      <span>{application.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Applied {application.appliedDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getATSScoreColor(application.atsScore)}`}>
                      {application.atsScore}
                    </div>
                    <div className="text-xs text-gray-500">ATS Score</div>
                  </div>
                  
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      CV
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-700 mb-2">No applications found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationsList;
