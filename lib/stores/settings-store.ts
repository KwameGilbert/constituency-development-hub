import { create } from "zustand";

interface SettingsState {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    newAssignments: boolean;
    statusUpdates: boolean;
    weeklyReport: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "auto";
    language: string;
    timezone: string;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: string;
    loginNotifications: boolean;
  };

  // Modals
  showPasswordModal: boolean;
  showEmailConfigModal: boolean;
  showTwoFactorModal: boolean;

  // Actions
  updateNotificationSetting: (key: string, value: boolean) => void;
  updateAppearanceSetting: (key: string, value: string) => void;
  updateSecuritySetting: (key: string, value: boolean | string) => void;
  openPasswordModal: () => void;
  closePasswordModal: () => void;
  openEmailConfigModal: () => void;
  closeEmailConfigModal: () => void;
  openTwoFactorModal: () => void;
  closeTwoFactorModal: () => void;
  saveSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  notifications: {
    email: true,
    push: false,
    sms: false,
    newAssignments: true,
    statusUpdates: true,
    weeklyReport: false,
  },
  appearance: {
    theme: "light",
    language: "en",
    timezone: "GMT+0",
  },
  security: {
    twoFactor: false,
    sessionTimeout: "30",
    loginNotifications: true,
  },

  // Modals
  showPasswordModal: false,
  showEmailConfigModal: false,
  showTwoFactorModal: false,

  updateNotificationSetting: (key: string, value: boolean) => {
    set((state) => ({
      notifications: {
        ...state.notifications,
        [key]: value,
      },
    }));
  },

  updateAppearanceSetting: (key: string, value: string) => {
    set((state) => ({
      appearance: {
        ...state.appearance,
        [key]: value,
      },
    }));
  },

  updateSecuritySetting: (key: string, value: boolean | string) => {
    set((state) => ({
      security: {
        ...state.security,
        [key]: value,
      },
    }));
  },

  openPasswordModal: () => set({ showPasswordModal: true }),
  closePasswordModal: () => set({ showPasswordModal: false }),
  openEmailConfigModal: () => set({ showEmailConfigModal: true }),
  closeEmailConfigModal: () => set({ showEmailConfigModal: false }),
  openTwoFactorModal: () => set({ showTwoFactorModal: true }),
  closeTwoFactorModal: () => set({ showTwoFactorModal: false }),

  saveSettings: async () => {
    // TODO: Implement settings save to backend
    console.log("Saving settings:", get());
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  },
}));
