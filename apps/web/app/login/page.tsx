"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: String(form.get("email")),
        password: String(form.get("password"))
      });
      if (authError) throw authError;
      window.location.assign("/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
      setBusy(false);
    }
  }

  return <main className="login-wrap"><form className="login-card" onSubmit={submit}>
    <div className="brand-mark">A</div><p className="eyebrow">DEALERSHIP OPERATIONS</p>
    <h1>Welcome back</h1><p className="muted">Sign in to your Akshay DMS workspace.</p>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="primary wide" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    <p className="muted small">Accounts are managed in your Supabase project.</p>
  </form></main>;
}
