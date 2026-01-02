"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Images, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// Gallery categories
type GalleryCategory = "All" | "Events" | "Programs" | "Community" | "Infrastructure";

// Gallery item type
interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: GalleryCategory;
  date: string;
  location: string;
  coverImage: string;
  images: {
    url: string;
    caption: string;
  }[];
}

// Dummy gallery data
const galleryData: GalleryItem[] = [
  {
    id: "1",
    title: "Youth Skills Development Workshop",
    description: "Hands-on training session for youth in digital skills and entrepreneurship",
    category: "Programs",
    date: "December 15, 2025",
    location: "Sefwi Wiawso Community Center",
    coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", caption: "Opening ceremony" },
      { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", caption: "Group discussion session" },
      { url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80", caption: "Hands-on computer training" },
      { url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80", caption: "Mentorship breakout session" },
      { url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80", caption: "Certificate presentation" },
    ],
  },
  {
    id: "2",
    title: "Community Health Outreach",
    description: "Free medical screening and health education for residents",
    category: "Events",
    date: "December 10, 2025",
    location: "Asafo Community Park",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80", caption: "Medical team setup" },
      { url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=800&q=80", caption: "Blood pressure screening" },
      { url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80", caption: "Health education session" },
      { url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80", caption: "Community members receiving care" },
    ],
  },
  {
    id: "3",
    title: "Road Rehabilitation Project",
    description: "Progress of the feeder road rehabilitation connecting farming communities",
    category: "Infrastructure",
    date: "November 28, 2025",
    location: "Wiawso-Boako Road",
    coverImage: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80", caption: "Road construction in progress" },
      { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80", caption: "Heavy equipment at work" },
      { url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80", caption: "Bridge construction" },
    ],
  },
  {
    id: "4",
    title: "Women in Agriculture Forum",
    description: "Annual gathering celebrating women farmers and their contributions",
    category: "Community",
    date: "November 20, 2025",
    location: "Municipal Assembly Hall",
    coverImage: "https://images.unsplash.com/photo-1595508064774-5ff825a62d61?auto=format&fit=crop&w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1595508064774-5ff825a62d61?auto=format&fit=crop&w=800&q=80", caption: "Forum opening" },
      { url: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=800&q=80", caption: "Women farmers showcase" },
      { url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80", caption: "Panel discussion" },
      { url: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80", caption: "Award ceremony" },
      { url: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?auto=format&fit=crop&w=800&q=80", caption: "Group photo" },
      { url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80", caption: "Networking session" },
    ],
  },
  {
    id: "5",
    title: "School Renovation Handover",
    description: "Official handover of renovated classrooms to the community",
    category: "Events",
    date: "November 15, 2025",
    location: "Wiawso Methodist Primary School",
    coverImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80", caption: "Renovated classroom" },
      { url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80", caption: "New library section" },
      { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", caption: "Students in new classroom" },
      { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80", caption: "Handover ceremony" },
    ],
  },
  {
    id: "6",
    title: "Constituency Town Hall Meeting",
    description: "Quarterly engagement with constituents on development priorities",
    category: "Events",
    date: "November 8, 2025",
    location: "Sefwi Wiawso Community Hall",
    coverImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80", caption: "Town hall in session" },
      { url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80", caption: "MP addressing constituents" },
      { url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80", caption: "Q&A session" },
    ],
  },
  {
    id: "7",
    title: "Clean Water Project Launch",
    description: "Inauguration of new boreholes serving 5 communities",
    category: "Infrastructure",
    date: "October 25, 2025",
    location: "Pokuase Township",
    coverImage: "https://images.unsplash.com/photo-1541544741670-35e9c1c0f7af?auto=format&fit=crop&w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1541544741670-35e9c1c0f7af?auto=format&fit=crop&w=800&q=80", caption: "Borehole inauguration" },
      { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", caption: "Clean water flowing" },
      { url: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?auto=format&fit=crop&w=800&q=80", caption: "Community celebration" },
    ],
  },
  {
    id: "8",
    title: "Youth Sports Tournament",
    description: "Inter-community football tournament promoting youth engagement",
    category: "Programs",
    date: "October 18, 2025",
    location: "Wiawso Sports Complex",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80", caption: "Match in progress" },
      { url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=800&q=80", caption: "Team celebration" },
      { url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80", caption: "Award ceremony" },
      { url: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80", caption: "Team photo" },
    ],
  },
];

const categories: GalleryCategory[] = ["All", "Events", "Programs", "Community", "Infrastructure"];

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter items by category
  const filteredItems = activeCategory === "All" 
    ? galleryData 
    : galleryData.filter(item => item.category === activeCategory);

  // Open lightbox
  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  // Navigate images
  const nextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 mb-4">
              Photo Gallery
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Our Moments
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Browse through photos from our events, programs, and community development 
              initiatives across Sefwi Wiawso Constituency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-emerald-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            <Images className="inline h-4 w-4 mr-1" />
            {filteredItems.length} {filteredItems.length === 1 ? 'album' : 'albums'} · Click to view photos
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              onClick={() => openLightbox(item)}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-56 bg-slate-100 overflow-hidden">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Image Count Badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Images className="h-3 w-3" />
                  {item.images.length} photos
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Main Content */}
            <div 
              className="relative w-full max-w-5xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                <p className="text-white/70 text-sm">{selectedItem.date} • {selectedItem.location}</p>
                <p className="text-white/50 text-xs mt-1">
                  {currentImageIndex + 1} of {selectedItem.images.length} photos
                </p>
              </div>

              {/* Image Container */}
              <div className="relative bg-black rounded-xl overflow-hidden">
                <div className="relative h-[60vh] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={selectedItem.images[currentImageIndex].url}
                        alt={selectedItem.images[currentImageIndex].caption}
                        fill
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-center text-sm">
                    {selectedItem.images[currentImageIndex].caption}
                  </p>
                </div>

                {/* Navigation Arrows */}
                {selectedItem.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {selectedItem.images.length > 1 && (
                <div className="mt-4 flex justify-center gap-2 overflow-x-auto py-2">
                  {selectedItem.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        currentImageIndex === index 
                          ? "border-emerald-500 opacity-100" 
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.caption}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Close Button (mobile) */}
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={closeLightbox}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Close Gallery
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalleryPage;
