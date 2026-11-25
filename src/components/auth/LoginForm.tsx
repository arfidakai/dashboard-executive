"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const message = result && typeof result === "object" && typeof (result as { message?: unknown }).message === "string"
          ? (result as { message: string }).message
          : "Login gagal. Periksa kembali kredensial.";
        setError(message);
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <Image
          className="login-logo"
          src="/Logo Tarekat Idrisiyyah - Ijo.png"
          alt="Tarekat Idrisiyyah"
          width={168}
          height={46}
          priority
        />
        <p className="login-eyebrow">Akses internal</p>
        <h1 id="login-title">Masuk ke Dashboard</h1>
        <p className="login-description">Gunakan akun yang diberikan oleh administrator.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}
