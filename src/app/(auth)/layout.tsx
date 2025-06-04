
import { LogoIcon } from "@/components/icons/LogoIcon";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Link href="/" className="flex flex-col items-center gap-2 text-primary">
          <LogoIcon className="w-12 h-12" />
          <h1 className="text-3xl font-headline font-bold">Quantum GPT</h1>
          <p className="text-sm text-muted-foreground">Powered by BlockSmithAI</p>
        </Link>
      </div>
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-xl">
        {children}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Quantum GPT by BlockSmithAI. All rights reserved.
      </p>
    </div>
  );
}
