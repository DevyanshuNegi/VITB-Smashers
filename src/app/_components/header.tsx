"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              NotesHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Browse Notes
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
              Categories
            </Link>
            {session && (
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                My Purchases
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Image
                  className="h-8 w-8 rounded-full"
                  src={session.user?.image ?? "/default-avatar.png"}
                  alt={session.user?.name ?? "User"}
                  width={32}
                  height={32}
                />
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 p-2 rounded-md"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                Browse Notes
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                Categories
              </Link>
              {session && (
                <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                  My Purchases
                </Link>
              )}
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
