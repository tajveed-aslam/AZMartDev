"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: { email: string; full_name: string; password: string; confirm: string }) => {
    setError("");
    try {
      await registerUser(data.email, data.full_name, data.password);
      addToast("Account created! Welcome to A&Z Mart!");
      router.push("/");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">🛒 A&amp;Z Mart</Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join A&amp;Z Mart today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" {...register("full_name")} error={errors.full_name?.message as string} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message as string} />
          <Input label="Password" type="password" {...register("password")} error={errors.password?.message as string} />
          <Input label="Confirm Password" type="password" {...register("confirm")} error={errors.confirm?.message as string} />
          {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Create Account</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
