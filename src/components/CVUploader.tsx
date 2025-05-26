
import { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CVUploaderProps {
  onUpload: (score: number) => void;
}

const CVUploader = ({ onUpload }: CVUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const simulateAnalysis = () => {
    setAnalyzing(true);
    // Simulate AI analysis with random ATS score
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60; // Score between 60-100
      setAnalyzing(false);
      setUploaded(true);
      onUpload(score);
      toast({
        title: "CV Analysis Complete",
        description: `Your ATS score is ${score}/100`,
      });
    }, 3000);
  };

  const handleFileUpload = useCallback((file: File) => {
    if (file.type !== 'application/pdf' && !file.type.includes('document')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      simulateAnalysis();
    }, 1500);
  }, [toast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  if (uploaded) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-green-800 mb-2">CV Uploaded Successfully</h3>
            <p className="text-sm text-green-600">Your CV has been analyzed and jobs are now personalized for you.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analyzing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-blue-600 mx-auto animate-pulse" />
            <div>
              <h3 className="font-semibold mb-2">Analyzing Your CV</h3>
              <p className="text-sm text-gray-600 mb-4">Our AI is processing your CV and calculating ATS compatibility...</p>
              <Progress value={66} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (uploading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Upload className="h-12 w-12 text-blue-600 mx-auto animate-bounce" />
            <div>
              <h3 className="font-semibold mb-2">Uploading CV</h3>
              <Progress value={33} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`border-2 border-dashed transition-colors ${
        dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <FileText className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="font-semibold mb-2">Upload Your CV</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop your CV here, or click to browse
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="cv-upload"
            />
            <label htmlFor="cv-upload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVUploader;
