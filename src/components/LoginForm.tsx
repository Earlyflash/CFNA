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
          className="border border-np-red/40 bg-np-paper-dark px-3 py-2 text-sm text-np-red"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      <label className="block text-sm">
        <span className="font-semibold text-np-ink">Username</span>
        <input
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-1.5 w-full border-b-2 border-np-ink bg-transparent px-1 py-2 text-np-ink placeholder:text-np-ink-muted/50 focus:border-np-red focus:outline-none"
          placeholder="Publisher username"
        />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-np-ink">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full border-b-2 border-np-ink bg-transparent px-1 py-2 text-np-ink placeholder:text-np-ink-muted/50 focus:border-np-red focus:outline-none"
          placeholder="••••••••"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full border-2 border-np-ink bg-np-ink py-3 text-sm font-bold uppercase tracking-wider text-np-paper transition hover:bg-np-ink-light disabled:opacity-60"
      >
        {pending ? "Signing in\u2026" : "Sign in to publish"}
      </button>
    </form>
  );
}
