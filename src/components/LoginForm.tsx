"use client";

import { useActionState } from "react";
import { loginPublisher, type LoginState } from "@/app/actions/auth";

const initial: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginPublisher, initial);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <p
          className="rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      <label className="block text-sm">
        <span className="font-medium text-wwam-cream">Username</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-1.5 w-full rounded-xl border border-wwam-gold/25 bg-wwam-void/80 px-4 py-3 text-wwam-cream placeholder:text-wwam-cream-muted/50 focus:border-wwam-gold focus:outline-none focus:ring-1 focus:ring-wwam-gold"
          placeholder="Publisher username"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-wwam-cream">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-xl border border-wwam-gold/25 bg-wwam-void/80 px-4 py-3 text-wwam-cream placeholder:text-wwam-cream-muted/50 focus:border-wwam-gold focus:outline-none focus:ring-1 focus:ring-wwam-gold"
          placeholder="••••••••"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-gradient-to-r from-wwam-gold to-wwam-gold-light py-3 text-sm font-semibold text-wwam-ink shadow-lg shadow-wwam-gold/20 transition hover:brightness-105 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in to publish"}
      </button>
    </form>
  );
}
