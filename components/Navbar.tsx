"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar({ onAddProject}: { onAddProject: (name:string) => void}) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
      {/* Left: Header Title */}
      <div className="flex items-center gap-8">
      <h1 className="text-3xl font-extrabold font-serif ml-10">
        TaskManager
      </h1>
      {/* Middle: Search */}
      <Input
        type="text"
        placeholder="Search..."
        className="w-[400px] translate-y-1 ml-10" // adjust vertical alignment
      />
      </div>
      {/* Right: Button */}
      <Button
        onClick={() => {
          const name = prompt("Enter project name");
          if (name) onAddProject(name);
        }}
        variant="default"
        className="px-4 py-2 rounded text-sm"
      >
        + Create Project
      </Button>

    </nav>
  );
}
