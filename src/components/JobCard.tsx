
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, MapPin, Clock, DollarSign, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Job } from "@/hooks/useJobs";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import JobApplicationForm from "./JobApplicationForm";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { user } = useAuth();
  const { data: profile } = useProfile();
  
  const canApply = user && profile?.role === 'job_seeker';

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {job.company.name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDistanceToNow(new Date(job.created_at))} ago
              </span>
            </CardDescription>
          </div>
          {job.company.logo_url && (
            <img 
              src={job.company.logo_url} 
              alt={`${job.company.name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700 line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{job.employment_type}</Badge>
          {job.experience_level && (
            <Badge variant="outline">{job.experience_level}</Badge>
          )}
          {job.remote_policy && (
            <Badge variant="outline">{job.remote_policy}</Badge>
          )}
        </div>

        {(job.salary_min || job.salary_max) && (
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <DollarSign className="h-4 w-4" />
            {formatSalary(job.salary_min, job.salary_max)}
          </div>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {job.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {req}
                </li>
              ))}
              {job.requirements.length > 3 && (
                <li className="text-gray-400">+{job.requirements.length - 3} more...</li>
              )}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            Posted by {job.posted_by_profile.full_name || 'Recruiter'}
          </div>
          
          {canApply && (
            <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
              <DialogTrigger asChild>
                <Button>Apply Now</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Apply for {job.title}</DialogTitle>
                </DialogHeader>
                <JobApplicationForm
                  jobId={job.id}
                  jobTitle={job.title}
                  companyName={job.company.name}
                  onSuccess={() => setShowApplicationForm(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
