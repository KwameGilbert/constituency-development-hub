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
    timeline: string;
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
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  currentIssueId: null,
  assessment: {
    decision: "",
    comments: "",
    recommendations: "",
    estimatedBudget: "",
    timeline: "",
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
        timeline: "",
      },
      files: [],
      isSubmitting: false,
      errors: {},
      touched: {},
    });
  },
}));
