
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to dashboard page now that login is removed
  redirect('/dashboard'); 
  // return null; // redirect will handle this
}
