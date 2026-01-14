import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-white font-bold text-xl tracking-tight">
            <span className="text-purple-400">todo</span>app
          </div>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Simple. Fast. Organized.
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Manage your tasks
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              effortlessly
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            A minimalist todo app that helps you stay focused. Create lists, 
            break down tasks into subtasks, and get things done.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              Start for free
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-medium text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              I have an account
            </Link>
          </div>

          {/* Features Preview */}
          <div className="mt-20 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">Unlimited</div>
              <div className="text-sm text-gray-500">Todo Lists</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">Nested</div>
              <div className="text-sm text-gray-500">Subtasks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">Secure</div>
              <div className="text-sm text-gray-500">Authentication</div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600/20 rounded-full blur-[128px] pointer-events-none"></div>
      </main>
    </div>
  );
}
