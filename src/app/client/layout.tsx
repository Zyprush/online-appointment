import ClientRouteGuard from '@/components/ClientRouteGuard';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientRouteGuard>
      {children}
    </ClientRouteGuard>
  );
}