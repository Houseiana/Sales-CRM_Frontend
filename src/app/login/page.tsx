"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md">
        {/* Language switcher top-right */}
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-lg font-semibold text-white shadow-sm">
            H
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-950">
            {t.appName}
          </h1>
          <p className="mt-1 text-sm text-stone-500">{t.signInToAccount}</p>
        </div>

        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  {t.email}
                </label>
                <Input
                  type="email"
                  placeholder={t.enterEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-2xl border-stone-200"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  {t.password}
                </label>
                <Input
                  type="password"
                  placeholder={t.enterPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-2xl border-stone-200"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-2xl bg-stone-950 text-white hover:bg-stone-800"
              >
                {loading ? t.signingIn : t.signIn}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-stone-400">
          {t.appSubtitle}
        </p>
      </div>
    </div>
  );
}
