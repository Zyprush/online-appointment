import { User, CreditCard, LayoutDashboard, Clock, ClipboardList } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/employee", icon: User, label: "Clearance" },
    { href: "/attendance", icon: ClipboardList, label: "Settings" },
    { href: "/payroll", icon: CreditCard, label: "Account" },
    { href: "/history", icon: Clock, label: "History" },
];

export default navItems;
