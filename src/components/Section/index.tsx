// components/Section.tsx
"use client";

import { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-900 p-6 border rounded-lg shadow mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
