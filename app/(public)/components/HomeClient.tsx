import HeroCarousel from "@/components/hero/HeroCarousel";
import ProjectsShowcase from "@/components/hero/ProjectsShowcase";
import ArticlesGrid from "@/components/hero/ArticlesGrid";
import GalleryPreview from "@/components/hero/GalleryPreview";
import EventsList from "@/components/hero/EventsList";
import MapPreview from "@/components/hero/MapPreview";
import ReportCTA from "@/components/hero/ReportCTA";
import VisionMission from "@/components/hero/VisionMission";
import FAQAccordion from "@/components/hero/FAQAccordion";
import NewsletterForm from "@/components/hero/NewsletterForm";
import ContactPanel from "@/components/hero/ContactPanel";
import AnnouncementSection from "@/components/hero/AnnouncementSection";
import AnnouncementPopup from "@/components/hero/AnnouncementPopup";

export default function HomeClient() {
  return (
    <div className="bg-white text-slate-900">
      <main className="space-y-0">
        <AnnouncementPopup />
        <HeroCarousel />
        <AnnouncementSection />
        <ArticlesGrid />
        <ProjectsShowcase />
        <GalleryPreview />
        <EventsList />
        <MapPreview />
        <ReportCTA />
        <VisionMission />
        <FAQAccordion />
        <NewsletterForm />
        <ContactPanel />
      </main>
    </div>
  );
}
