
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateApplication } from "@/hooks/useApplications";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText } from "lucide-react";

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
}

const JobApplicationForm = ({ jobId, jobTitle, companyName, onSuccess }: JobApplicationFormProps) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createApplication = useCreateApplication();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, we'll just store the filename. In a real app, you'd upload to Supabase storage
      const resumeUrl = resumeFile ? `resumes/${resumeFile.name}` : undefined;
      
      await createApplication.mutateAsync({
        job_id: jobId,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
      });

      toast({
        title: "Application submitted successfully!",
        description: `Your application for ${jobTitle} at ${companyName} has been sent.`,
      });

      setCoverLetter('');
      setResumeFile(null);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error submitting application",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Apply for {jobTitle}
        </CardTitle>
        <CardDescription>
          Submit your application for this position at {companyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're interested in this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="resume">Resume (Optional)</Label>
            <div className="mt-1">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {resumeFile && (
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                  <Upload className="h-4 w-4" />
                  {resumeFile.name}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobApplicationForm;
