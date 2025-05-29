
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Building, Star } from "lucide-react";
import JobApplicationForm from './JobApplicationForm';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  relevancyScore?: number;
  description: string;
  requirements: string[];
  postedDate: string;
}

interface JobCardProps {
  job: Job;
  showRelevancy?: boolean;
}

const JobCard = ({ job, showRelevancy = false }: JobCardProps) => {
  const [showApplication, setShowApplication] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleApply = () => {
    setShowApplication(true);
  };

  const handleApplicationSubmit = () => {
    setShowApplication(false);
    // You could add additional logic here like updating the UI
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Building className="h-4 w-4" />
                {job.company}
              </CardDescription>
            </div>
            {showRelevancy && job.relevancyScore && (
              <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                <Star className="h-3 w-3" />
                {job.relevancyScore}% match
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {job.salary}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.postedDate}
              </div>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary">{job.type}</Badge>
              {job.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline">{req}</Badge>
              ))}
              {job.requirements.length > 3 && (
                <Badge variant="outline">+{job.requirements.length - 3} more</Badge>
              )}
            </div>

            <p className="text-gray-700 line-clamp-3">
              {job.description}
            </p>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1"
              >
                {showDetails ? 'Hide Details' : 'View Details'}
              </Button>
              <Button onClick={handleApply} className="flex-1">
                Apply Now
              </Button>
            </div>

            {showDetails && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-gray-700">{job.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showApplication && (
        <JobApplicationForm
          job={job}
          onClose={() => setShowApplication(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </>
  );
};

export default JobCard;
