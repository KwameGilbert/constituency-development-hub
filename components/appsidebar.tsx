import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

interface Props {
  navItems: NavItem[];
}

export function AppSidebar({ navItems }: Props) {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
