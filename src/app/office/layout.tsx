import OfficeRouteGuard from "@/components/OfficeRouteGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <OfficeRouteGuard>
      {children}
    </OfficeRouteGuard>
  );
}