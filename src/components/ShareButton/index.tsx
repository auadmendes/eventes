"use client";

import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaFacebook, FaLinkedin, FaTwitter, FaShareAlt } from "react-icons/fa";

interface ShareButtonProps {
  title: string;
  id: string;
  type: "event" | "place"; // ✅ new prop
  url?: string; // extra link (optional)
}

export default function ShareButton({ title, id, type, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const siteUrl = "https://www.lucianohorta.com";
  const baseUrl = `${siteUrl}/${type}/${id}`; // ✅ now flexible

  const togglePopup = () => setIsOpen(!isOpen);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const encodedUrl = encodeURIComponent(baseUrl);
  const message = `${title} - EventES\n${baseUrl}${url ? `\n${url}` : ""}`;
  const encodedMessage = encodeURIComponent(message);

  const shareLinks = [
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodedMessage}`,
      icon: <FaWhatsapp size={16} />,
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      icon: <FaTwitter size={16} />,
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      icon: <FaFacebook size={16} />,
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title)}&summary=${encodedMessage}`,
      icon: <FaLinkedin size={16} />,
    },
    {
      name: "Copy Link",
      copy: message,
      icon: <FaShareAlt size={16} />,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={togglePopup}
        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
      >
        <FaShareAlt size={18} />
        <span className="text-xs">Share</span>
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute left-0 mt-1 w-44 bg-white border rounded-lg shadow-lg z-50"
        >
          {shareLinks.map((link) =>
            "url" in link ? (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.name}
              </a>
            ) : (
              <button
                key={link.name}
                onClick={() => {
                  navigator.clipboard.writeText(link.copy);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                {link.icon}
                {copied ? "Copied!" : link.name}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
