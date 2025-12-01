"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
// TODO: put this in a file
interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function CustomSelect({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-gray-300 mb-2 text-sm">{label}</label>
      )}

      {/* Select Box */}
      <div
        onClick={() => setOpen(!open)}
        className={`
          w-full px-4 py-3 rounded-lg cursor-pointer flex justify-between items-center
          bg-black border border-stone-700 backdrop-blur-sm
          transition-all duration-200
          ${open ? "border-emerald-500" : "hover:border-emerald-500/50"}
        `}
      >
        <span
          className={`text-sm ${
            selectedOption ? "text-white" : "text-gray-400"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180 text-emerald-400" : "text-gray-400"
          }`}
        />
      </div>

      {/* Dropdown List */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="
  absolute left-0 right-0 mt-2 z-[9999]
  bg-black backdrop-blur-md border border-stone-700 rounded-lg
  shadow-lg overflow-hidden
"
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`
                  px-4 py-3 text-sm cursor-pointer 
                  transition-all duration-150
                  ${
                    value === opt.value
                      ? "bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-400"
                      : "text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400"
                  }
                `}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
