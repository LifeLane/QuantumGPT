
import SignupForm from "@/components/forms/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-headline font-semibold tracking-tight">Create an Account</h2>
        <p className="text-sm text-muted-foreground">
          Join Quantum GPT to unlock powerful AI crypto tools.
        </p>
      </div>
      <SignupForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
