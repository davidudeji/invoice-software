'use client';

import { useActionState } from 'react';
import { registerUser } from '@/app/actions/auth';
import Link from 'next/link';
import { Loader2, Zap, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { SubmitButton } from '@/components/SubmitButton';

const initialState = { message: null };

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Invoice<span className="text-indigo-400">Pay</span>
          </h1>
        </div>

        <h2 className="text-center text-3xl font-bold tracking-tight text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 py-8 px-6 shadow-2xl sm:rounded-2xl">
          {state?.message && !state.success && (
            <div className="mb-6 flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-300">{state.message}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 text-sm transition-all"
                placeholder="Jane Smith"
              />
              {state?.errors?.name && (
                <p className="mt-1 text-xs text-red-400">{state.errors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email address
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 text-sm transition-all"
                placeholder="you@example.com"
              />
              {state?.errors?.email && (
                <p className="mt-1 text-xs text-red-400">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 text-sm transition-all"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {state?.errors?.password && (
                <p className="mt-1 text-xs text-red-400">{state.errors.password[0]}</p>
              )}
            </div>

            <SubmitButton
              pendingLabel="Creating account…"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed border border-transparent rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            By registering, you agree to our{' '}
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
            {' & '}
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
