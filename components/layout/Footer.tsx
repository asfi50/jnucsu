"use client";

import Link from "next/link";
import { Github, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import NewsletterSubscription from "@/components/shared/NewsletterSubscription";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-orange-500 text-white font-bold text-xl px-3 py-1 rounded">
                JnU
              </div>
              <span className="font-semibold text-white text-xl">CSU</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Empowering student leaders at Jagannath University. Building
              stronger communities through democratic participation and
              innovative leadership.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="https://github.com/asfi50/jnucsu"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/candidates"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  Student Candidates
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  Blog & Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/candidates/add"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  Add Candidate Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/write"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  Write Article
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/developers"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  Developers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <NewsletterSubscription />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} JnUCSU. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm">
                Developed and maintained by{" "}
                <Link
                  href="/developers"
                  className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
                >
                  JnU CSE Club
                </Link>
              </p>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-orange-400 transition-colors duration-200"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
