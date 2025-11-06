'use client';

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="bg-background/95 backdrop-blur-md">
        <div className="flex justify-between items-center px-6 lg:px-8 py-4 gap-4 h-16 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold">
            My Trip
          </Link>
          <div className="flex gap-4 items-center">
            <SignedIn>
              <Link href="/bookmarks">
                <Button variant="ghost" className="gap-2">
                  <Star className="h-4 w-4" />
                  북마크
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button>로그인</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
