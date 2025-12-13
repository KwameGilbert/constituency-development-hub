import PortalLayout from "@/components/portal/PortalLayout";
import { type PortalRole } from "@/components/portal/types";

const portalRoles: PortalRole[] = [
  {
    id: "agent",
    title: "Agent",
    description:
      "Manage field activities and submit community intelligence for rapid response.",
    href: "/agent-login",
    colorTheme: "green",
    iconKey: "users",
  },
  {
    id: "officer",
    title: "Officer",
    description:
      "Coordinate operations, dispatch resources, and keep frontline teams aligned.",
    href: "/officer-login",
    colorTheme: "blue",
    iconKey: "shield",
  },
  {
    id: "task-force",
    title: "Task Force",
    description:
      "Monitor escalated incidents, track deployments, and maintain rapid briefings.",
    href: "/task-force-dashboard",
    colorTheme: "purple",
    iconKey: "radio",
  },
  {
    id: "admin",
    title: "Web Admin",
    description:
      "Oversee the full system, manage content, and audit public-facing portals.",
    href: "/web-admin-login",
    colorTheme: "orange",
    iconKey: "briefcase",
  },
  {
    id: "super-admin",
    title: "Constituency Admin",
    description:
      "Run high-level reporting, approve accounts, and manage access policies.",
    href: "/(dashboards)/adim-dashboard",
    colorTheme: "red",
    iconKey: "building",
  },
];

function PortalSelectionPage() {
  return (
    <PortalLayout
      heading="Admins Portal"
      subheading="Select your role to continue to the login page"
      roles={portalRoles}
    />
  );
}

export default PortalSelectionPage;
