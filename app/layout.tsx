import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Puppy Picker - AI Dog Breed Matcher",
  description:
    "Find the dog breed that suits you best with AI-powered recommendations",
  keywords:
    "dog breed, puppy picker, AI recommendations, dog matching, breed finder",
  authors: [{ name: "Puppy Picker" }],
  openGraph: {
    title: "Puppy Picker - AI Dog Breed Matcher",
    description:
      "Find the dog breed that suits you best with AI-powered recommendations",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Puppy Picker - AI Dog Breed Matcher",
    description:
      "Find the dog breed that suits you best with AI-powered recommendations",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
