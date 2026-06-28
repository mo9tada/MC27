"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoBackground from "@/components/video-background";

import { adminLogin } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLogin, undefined);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 text-white">
      <VideoBackground overlayClassName="bg-[linear-gradient(180deg,_rgba(7,21,38,0.92),_rgba(16,44,78,0.92))]" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.17, 0.67, 0.12, 0.99] as const }}
        className="w-full max-w-sm"
      >
      <Card className="w-full max-w-sm border-white/10 bg-[#102c4e]/60 text-white shadow-xl backdrop-blur">
        <CardHeader>
          <CardDescription className="text-[#c58d5a]">MC27 Coffee</CardDescription>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="size-5 text-[#c58d5a]" />
            Admin login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <Input id="password" name="password" type="password" required autoFocus />
            </div>

            {state?.error && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-300"
              >
                {state.error}
              </motion.p>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit" disabled={isPending} className="w-full bg-[#163b66] text-white hover:bg-[#102c4e]">
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </main>
  );
}
