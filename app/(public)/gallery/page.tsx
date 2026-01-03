import { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery - Our Moments',
  description: 'Photo gallery of events, programs, and community development initiatives in Sefwi Wiawso Constituency.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
