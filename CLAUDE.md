# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server (uses custom server.js)
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## Project Architecture

### Core Structure
- **app/** - Next.js 16.1.1 App Router
  - **(dashboards)/** - Protected dashboard routes for different user roles:
    - admin-dashboard/ - Admin CRUD operations for sectors, categories, youth, ideas
    - agents-dashboard/ - Field agent interface for issue reporting
    - officer-dashboard/ - Officer dashboard for issue management
    - task-force-dashboard/ - Task force coordination and assessment
    - web-admin-dashboard/ - Web admin for public content (announcements, blog, gallery)
  - **(public)/** - Public-facing pages (about, announcements, blog, contact)
  - **layout.tsx** - Root layout with metadata, JSON-LD for SEO, and ToastProvider
  - **globals.css** - Global CSS including Tailwind directives and custom styles
  - **middleware.ts** - Authentication and route protection logic

### Key Technologies
- **Framework**: Next.js 16.1.1 with React 19.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.18 with shadcn/ui components
- **State Management**: Zustand (global state), React Hook Form (form state)
- **UI Components**: Radix UI primitives, shadcn/ui
- **Rich Text Editing**: TinyMCE
- **Data Visualization**: Recharts, Embla Carousel
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner, SweetAlert2
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF, html2canvas
- **Icons**: Lucide React

### Important Files
- **app/layout.tsx**: Root layout containing site metadata, JSON-LD for SEO, and ToastProvider
- **app/globals.css**: Global CSS including Tailwind directives and custom styles
- **middleware.ts**: Authentication and route protection logic
- **server.js**: Custom Node.js server for additional API routes
- **api_specifications.json**: Detailed API endpoint specifications
- **components.json**: shadcn/ui configuration

### Authentication & Authorization
- Uses JWT tokens stored in cookies/localStorage
- Role-based access control for different dashboard types
- Middleware protects dashboard routes
- Public routes accessible without authentication

### Data Fetching
- Primarily uses Axios for API calls
- Some direct database access via custom server routes
- SWR or React Query may be used in specific components (check implementation)

### Styling Approach
- Tailwind CSS with CSS variables for theming
- shadcn/ui component library for consistent UI
- Custom CSS variables for fonts (Geist Sans/Mono)
- Dark mode support via next-themes