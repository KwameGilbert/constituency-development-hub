import { create } from "zustand";

interface AssessmentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadDate: string;
  file?: File;
}

interface AssessmentState {
  currentIssueId: number | null;
  assessment: {
    decision: string;
    comments: string;
    recommendations: string;
    estimatedBudget: string;
    startDate: string;
    endDate: string;
  };
  files: AssessmentFile[];
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;

  // Actions
  setCurrentIssue: (issueId: number) => void;
  updateAssessment: (field: string, value: string) => void;
  addFile: (file: File) => void;
  removeFile: (fileId: string) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  setTouched: (field: string) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  resetAssessment: () => void;
  saveDraft: () => void;
  loadDraft: (issueId: number) => boolean;
  clearDraft: (issueId: number) => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentIssueId: null,
  assessment: {
    decision: "",
    comments: "",
    recommendations: "",
    estimatedBudget: "",
    startDate: "",
    endDate: "",
  },
  files: [],
  isSubmitting: false,
  errors: {},
  touched: {},

  setCurrentIssue: (issueId: number) => {
    set({ currentIssueId: issueId });
  },

  updateAssessment: (field: string, value: string) => {
    set((state) => ({
      assessment: {
        ...state.assessment,
        [field]: value,
      },
    }));
    // Clear error when user starts typing
    get().clearError(field);
  },

  addFile: (file: File) => {
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const assessmentFile: AssessmentFile = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      file,
    };

    set((state) => ({
      files: [...state.files, assessmentFile],
    }));
  },

  removeFile: (fileId: string) => {
    set((state) => ({
      files: state.files.filter((file) => file.id !== fileId),
    }));
  },

  setError: (field: string, message: string) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: message,
      },
    }));
  },

  clearError: (field: string) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [field]: "",
      },
    }));
  },

  setTouched: (field: string) => {
    set((state) => ({
      touched: {
        ...state.touched,
        [field]: true,
      },
    }));
  },

  setSubmitting: (isSubmitting: boolean) => {
    set({ isSubmitting });
  },

  resetAssessment: () => {
    set({
      currentIssueId: null,
      assessment: {
        decision: "",
        comments: "",
        recommendations: "",
        estimatedBudget: "",
        startDate: "",
        endDate: "",
      },
      files: [],
      isSubmitting: false,
      errors: {},
      touched: {},
    });
  },

  saveDraft: () => {
    const { currentIssueId, assessment } = get();
    if (!currentIssueId) return;
    try {
      const key = `assessment_draft_${currentIssueId}`;
      const draft = {
        assessment,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to save draft:", e);
    }
  },

  loadDraft: (issueId: number): boolean => {
    try {
      const key = `assessment_draft_${issueId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const draft = JSON.parse(raw);
      if (draft?.assessment) {
        set({ assessment: draft.assessment });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to load draft:", e);
      return false;
    }
  },

  clearDraft: (issueId: number) => {
    try {
      localStorage.removeItem(`assessment_draft_${issueId}`);
    } catch (e) {
      console.error("Failed to clear draft:", e);
    }
  },
}));
