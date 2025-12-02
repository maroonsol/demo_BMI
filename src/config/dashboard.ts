import {
  ScanLine,
} from "lucide-react";

export interface DialogContentItem {
  title: string;
  description: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

export interface DashboardBox {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  dialog?: boolean;
  dialogContent?: DialogContentItem[];
  link?: string;
}

export const dashboardBoxes: DashboardBox[] = [
  {
    id: "foot-scanning",
    title: "Foot Scanning",
    description: "Manage patient foot scans",
    icon: ScanLine,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    borderColor: "border-l-purple-500",
    dialogContent: [
      {
        title: "New Scan",
        description: "Create new foot scan",
        link: "/dashboard/foot-scanning/create",
        icon: ScanLine,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        borderColor: "border-l-green-500",
      },
    ],
  },
];
