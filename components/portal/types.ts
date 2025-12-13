export type PortalIconKey =
  | "users"
  | "shield"
  | "briefcase"
  | "radio"
  | "building";

export type PortalRole = {
  id: string;
  title: string;
  description: string;
  href: string;
  iconKey: PortalIconKey;
  colorTheme: "blue" | "green" | "red" | "purple" | "orange";
};
