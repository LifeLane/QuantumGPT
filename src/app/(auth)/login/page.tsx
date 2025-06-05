
// This page is deprecated and should not be rendered.
// The application now redirects from / to /dashboard.
export default function DeprecatedLoginPage() {
  if (typeof window !== 'undefined') {
    // Attempt client-side redirect as a fallback if server-side isn't caught
    window.location.href = '/dashboard';
  }
  return (
    <div>
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
