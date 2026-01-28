"use client";

import { useEffect, useState } from "react";
import {
  announcementsService,
  Announcement,
} from "@/lib/services/announcements-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function AnnouncementPopup() {
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const checkAnnouncements = async () => {
      try {
        const response = await announcementsService.getPublicAnnouncements();
        if (response.success && response.data.announcements) {
          // Assuming 'readAnnouncements' would be managed elsewhere, for now, we'll just take the first one if any.
          // The original code was looking for 'urgent' and checking sessionStorage.
          // Let's try to reconcile with the original intent of showing an urgent, unseen announcement.
          const urgentAnnouncement = response.data.announcements.find(
            (ann) => ann.priority === "urgent",
          );

          if (urgentAnnouncement) {
            const seenKey = `seen_announcement_${urgentAnnouncement.id}`;
            if (!sessionStorage.getItem(seenKey)) {
              setAnnouncement(urgentAnnouncement);
              // Small delay for better UX
              setTimeout(() => setOpen(true), 2000);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check announcements", error);
      }
    };

    checkAnnouncements();
  }, []);

  const handleClose = () => {
    setOpen(false);
    if (announcement) {
      sessionStorage.setItem(`seen_announcement_${announcement.id}`, "true");
    }
  };

  if (!announcement) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto bg-red-100 p-3 rounded-full w-fit">
            <Bell className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl text-red-700">
            {announcement.title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <p className="text-center text-gray-600">{announcement.content}</p>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            variant="default"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            onClick={handleClose}
          >
            Acknowledge & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
