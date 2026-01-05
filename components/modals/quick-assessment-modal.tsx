import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Calendar
} from 'lucide-react';
import type { Issue } from '@/lib/data';
import { createAssessment, getMetadata } from '@/lib/data';

interface QuickAssessmentModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (issueId: string, decision: string, reason: string) => void;
}

export function QuickAssessmentModal({ issue, isOpen, onClose, onSubmit }: QuickAssessmentModalProps) {
  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!issue) return null;

  const metadata = getMetadata();
  const priority = metadata.priorities.find(p => p.level === issue.priority);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!decision) {
      setError('Please select a decision');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for your decision');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Create assessment record
      const assessment = {
        decision: decision,
        comments: reason.trim(),
        recommendations: decision === 'approved' ? 'Implementation Planning, Budget Allocation' : 'Issue Resolution, Community Notification',
        estimatedBudget: decision === 'approved' ? issue.impactAssessment?.estimatedCost : undefined,
        timeline: decision === 'approved' ? '2-3 months' : '1 week'
      };

      // Call the data function
      await createAssessment(issue.id, assessment);

      // Call the callback if provided
      if (onSubmit) {
        onSubmit(issue.id.toString(), decision, reason.trim());
      }

      // Reset form
      setDecision('');
      setReason('');
      onClose();
    } catch (err) {
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setDecision('');
      setReason('');
      setError('');
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-purple-600" />
            Quick Assessment
          </DialogTitle>
          <DialogDescription>
            Make a quick assessment decision for this constituency issue
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Issue Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                <p className="text-sm text-gray-600 mt-1">ID: {issue.id}</p>
              </div>
              {priority && (
                <Badge className={`bg-${priority.color}-100 text-${priority.color}-800`}>
                  {priority.name}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{issue.community}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{issue.submitter.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">{formatDate(issue.submissionDate)}</span>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-gray-700 text-sm line-clamp-3">{issue.description}</p>
            </div>

            {issue.impactAssessment?.estimatedCost && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-900">
                  Estimated Cost: ${issue.impactAssessment.estimatedCost.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Decision Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Assessment Decision <span className="text-red-500">*</span>
              </label>
              <Select value={decision} onValueChange={setDecision}>
                <SelectTrigger className={decision ? getDecisionColor(decision) : ''}>
                  <div className="flex items-center gap-2">
                    {decision && getDecisionIcon(decision)}
                    <SelectValue placeholder="Select your decision" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Approve for Implementation</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Reject Application</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reason for Decision */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Reason for Decision <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder={
                  decision === 'approved'
                    ? 'Explain why this issue should be approved for implementation...'
                    : decision === 'rejected'
                    ? 'Explain why this issue cannot be approved...'
                    : 'Provide detailed reasoning for your assessment decision...'
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Minimum 20 characters required. Be specific and constructive.
              </p>
            </div>

            {/* Assessment Guidelines */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Assessment Guidelines:</strong> Consider feasibility, budget impact, community benefit, 
                alignment with development priorities, and available resources. Provide clear, constructive feedback 
                regardless of your decision.
              </AlertDescription>
            </Alert>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form Actions */}
            <Separator />
            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-gray-600">
                This assessment will be recorded in the issue timeline.
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!decision || !reason.trim() || reason.trim().length < 20 || isSubmitting}
                  className={
                    decision === 'approved' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : decision === 'rejected'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}