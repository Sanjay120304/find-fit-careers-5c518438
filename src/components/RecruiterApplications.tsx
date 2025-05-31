
import { useRecruiterApplications, useUpdateApplicationStatus } from "@/hooks/useApplications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Building, FileText, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const RecruiterApplications = () => {
  const { data: applications, isLoading, error } = useRecruiterApplications();
  const updateStatus = useUpdateApplicationStatus();
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  const handleStatusUpdate = async (applicationId: string) => {
    if (!newStatus) return;

    try {
      await updateStatus.mutateAsync({
        id: applicationId,
        status: newStatus as any,
        notes: notes || undefined,
      });

      toast({
        title: "Application updated",
        description: "The application status has been updated successfully.",
      });

      setSelectedApp(null);
      setNewStatus('');
      setNotes('');
    } catch (error) {
      toast({
        title: "Error updating application",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading applications...</div>
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
        <p className="text-gray-600">Applications for your job postings will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Job Applications</h2>
      {applications.map((application) => (
        <Card key={application.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {application.applicant.full_name || 'Anonymous'}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {application.applicant.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {application.job.title}
                  </span>
                  <span>Applied {formatDistanceToNow(new Date(application.applied_at))} ago</span>
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(application.status)}`}>
                {application.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.cover_letter && (
              <div>
                <strong className="text-sm">Cover Letter:</strong>
                <p className="text-sm text-gray-700 mt-1">{application.cover_letter}</p>
              </div>
            )}
            
            {application.resume_url && (
              <div>
                <strong className="text-sm">Resume:</strong>
                <p className="text-sm text-blue-600 mt-1">{application.resume_url}</p>
              </div>
            )}

            {application.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <strong className="text-sm">Your Notes:</strong>
                <p className="text-sm text-gray-700 mt-1">{application.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>

              {selectedApp === application.id && (
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Add notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(application.id)}
                      disabled={!newStatus || updateStatus.isPending}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedApp(null);
                        setNewStatus('');
                        setNotes('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {selectedApp !== application.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApp(application.id)}
                >
                  Add Notes & Update
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
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

export default RecruiterApplications;
