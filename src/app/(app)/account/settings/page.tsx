
// This page is deprecated and should not be rendered.
// Account settings functionality has been removed.
export default function DeprecatedAccountSettingsPage() {
  if (typeof window !== 'undefined') {
    // Attempt client-side redirect as a fallback
    window.location.href = '/dashboard';
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Account Settings (Deprecated)</h1>
      <p>This feature has been removed. Redirecting to dashboard...</p>
    </div>
  );
}
