
import { useApplications } from "@/hooks/useApplications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Building, FileText, CheckCircle, XCircle, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'reviewing':
      return <FileText className="h-4 w-4" />;
    case 'interview_scheduled':
      return <Calendar className="h-4 w-4" />;
    case 'accepted':
      return <CheckCircle className="h-4 w-4" />;
    case 'rejected':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'reviewing':
      return 'bg-blue-100 text-blue-800';
    case 'interview_scheduled':
      return 'bg-purple-100 text-purple-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ApplicationsList = () => {
  const { data: applications, isLoading, error } = useApplications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading your applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading applications. Please try again.</p>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p className="text-gray-600">Start applying to jobs to see your applications here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>
      {applications.map((application) => (
        <Card key={application.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {application.job.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  {application.job.company.name} • Applied {formatDistanceToNow(new Date(application.applied_at))} ago
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                {getStatusIcon(application.status)}
                {application.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          {application.cover_letter && (
            <CardContent>
              <div className="text-sm text-gray-600">
                <strong>Cover Letter:</strong>
                <p className="mt-1 line-clamp-3">{application.cover_letter}</p>
              </div>
              {application.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <strong className="text-sm">Recruiter Notes:</strong>
                  <p className="text-sm text-gray-700 mt-1">{application.notes}</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ApplicationsList;
