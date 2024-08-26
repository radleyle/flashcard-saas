import { Inter } from "next/font/google";
import "./globals.css";
import {ClerkProvider, SignedIn, SignedOut, SignInButton, SignOutButton,UserButton } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Flashcard SaaS",
  description: "Create flashcards for your next quiz or test",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">

      <body className={inter.className}>
        <SignedOut>
        <SignInButton />
        </SignedOut>
        <SignedIn>
        <UserButton />
        </SignedIn>
      {children}</body>
    </html>
    </ClerkProvider>
  );
}
