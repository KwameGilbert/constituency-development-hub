"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ideasService, IdeaSubmissionData } from "@/lib/services/ideas-service";
import { Loader2, Send } from "lucide-react";
import { Upload, X } from "lucide-react";
import { uploadService } from "@/lib/services/upload-service";
import { toast } from "sonner";

interface SubmitIdeaDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function SubmitIdeaDialog({
  onSuccess,
  trigger,
}: SubmitIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IdeaSubmissionData>({
    title: "",
    description: "",
    category: "",
    submitter_name: "",
    submitter_email: "",
    submitter_contact: "",
    location: "",
    documents: [],
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];

      // Allow common document types (PDF, Word, Excel, text) and common images
      const allowedMime = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedMime.includes(selected.type)) {
        toast.error("Invalid file format. Allowed: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG, GIF, WEBP");
        return;
      }

      setFile(selected);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.submitter_name ||
      !formData.submitter_email
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      let documentUrl = "";
      if (file) {
        try {
          // Hint to backend that this is an ideas/document upload
          const uploadResponse = await uploadService.uploadFile(file, "ideas", "document");
          documentUrl = uploadResponse.data.url;
        } catch (err: any) {
          const message = err?.message || err?.toString() || "Could not upload the attached file. Please try again.";
          toast.error("File upload failed", {
            description: message,
          });
          setLoading(false);
          return;
        }
      }

      const submissionData = {
        ...formData,
        documents: documentUrl ? [documentUrl] : [],
      };

      const response = await ideasService.submitIdea(submissionData);

      if (response.success) {
        toast.success("Your idea has been submitted successfully!", {
          description: "It will be visible once reviewed by our team.",
        });
        setOpen(false);
        setFormData({
          title: "",
          description: "",
          category: "",
          submitter_name: "",
          submitter_email: "",
          submitter_contact: "",
          location: "",
          documents: [],
        });
        setFile(null);
        if (onSuccess) onSuccess();
      } else {
        toast.error("Submission failed", {
          description: response.message || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong", {
        description: "Failed to submit idea. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md">
            <Send className="w-4 h-4 mr-2" />
            Submit Your Idea
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Submit a Community Idea
          </DialogTitle>
          <DialogDescription>
            Share your suggestions for improving our constituency. Your idea
            will be reviewed by our team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Project Details
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Idea Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Solar Street Lights for Main Road"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={handleCategoryChange}
                    value={formData.category}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infrastructure">
                        Infrastructure
                      </SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                      <SelectItem value="community">
                        Community Development
                      </SelectItem>
                      <SelectItem value="youth">Youth & Sports</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Expected Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Sefwi Wiawso Central"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Describe your idea in detail. What problem does it solve? Who will benefit?"
                  height={250}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Attachment (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/*"
                  />
                  {!file ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file")?.click()}
                      className="w-full border-dashed"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                        Upload Document (PDF, DOCX, XLSX, TXT) or Image
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between w-full p-2 border rounded-md bg-gray-50">
                      <span className="text-sm truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-t pt-4">
              Your Contact Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="submitter_name">
                  Your Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="submitter_name"
                  name="submitter_name"
                  placeholder="John Doe"
                  value={formData.submitter_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submitter_email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="submitter_email"
                  name="submitter_email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.submitter_email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="submitter_contact">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="submitter_contact"
                  name="submitter_contact"
                  placeholder="+233 20 000 0000"
                  value={formData.submitter_contact}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Proposal
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
