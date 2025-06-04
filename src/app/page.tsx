
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to login page, will be enhanced with auth check later
  redirect('/login'); 
  // return null; // redirect will handle this
}
