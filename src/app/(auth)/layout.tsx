
// This file is intentionally left minimal to prevent rendering old auth layout.
// The application should now be using src/app/(app)/layout.tsx for its main structure.
export default function DeprecatedAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
