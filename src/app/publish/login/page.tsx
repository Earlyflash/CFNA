import Link from "next/link";
import { redirect } from "next/navigation";
import { getPublisherUsername } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import Image from "next/image";
import { WWAM_LOGO_URL } from "@/lib/brand";

export const metadata = {
  title: "Publisher sign-in · War With A Mate",
};

export default async function PublishLoginPage() {
  const user = await getPublisherUsername();
  if (user) redirect("/publish");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="border-2 border-np-ink bg-np-paper p-8 shadow-print">
        <div className="mb-6 flex justify-center">
          <div className="relative h-14 w-36">
            <Image src={WWAM_LOGO_URL} alt="War With A Mate" fill className="object-contain opacity-80" sizes="144px" />
          </div>
        </div>
        <h1 className="font-display text-center text-2xl font-bold text-np-ink">Publisher Access</h1>
        <p className="mt-2 text-center text-sm text-np-ink-muted">
          Sign in to add session logs and photos. Listeners use the{" "}
          <Link href="/" className="text-np-red underline underline-offset-2 hover:text-np-red-light">
            public timeline
          </Link>
          .
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
