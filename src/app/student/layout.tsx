import StudentRouteGuard from '@/components/StudentRouteGuard';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <StudentRouteGuard>
      {children}
    </StudentRouteGuard>
  );
}