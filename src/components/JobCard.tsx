
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Star, Building } from "lucide-react";

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

const JobCard = ({ job, showRelevancy }: JobCardProps) => {
  const getRelevancyColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Building className="h-4 w-4" />
              {job.company}
            </CardDescription>
          </div>
          {showRelevancy && job.relevancyScore && (
            <Badge className={getRelevancyColor(job.relevancyScore)}>
              <Star className="h-3 w-3 mr-1" />
              {job.relevancyScore}% match
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Job details */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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

          {/* Job description */}
          <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>

          {/* Requirements */}
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {req}
              </Badge>
            ))}
            {job.requirements.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.requirements.length - 3} more
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button className="flex-1">Apply Now</Button>
            <Button variant="outline">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
