"use client";

import { useEffect, useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/app/assets/header-logo.png';
import { useCartStore } from '@/app/lib/cartStore';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.qty, 0));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
    { href: "/product", label: "Shop" },
  ];

  return (
    <header className="relative top-0 flex flex-row w-full z-1 justify-between items-center px-6 md:px-10 py-4 shadow-sm bg-[#0A0A0A]">
      <a href="#" className="text-lg font-semibold">
        <Image src={Logo} className="w-24" alt="header logo" />
      </a>
      <nav className="hidden md:block">
        <ul className="flex space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-white hover:text-gray-500">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center gap-2">


        <a
          href="/cart"
          className="relative p-2 rounded-full border border-white/30 hover:border-white/70 transition"
          aria-label="Cart"
        >
          <ShoppingCart size={20} className="text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-white text-black font-semibold rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}
        </a>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-800"
        >
          {isMenuOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 md:hidden">
          <ul className="flex flex-col space-y-4 p-4 text-base font-medium text-gray-800 dark:text-gray-100">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block w-full hover:text-gray-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {/* <li>
              <a
                href="/book-table"
                className="block w-full hover:text-gray-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Table
              </a>
            </li> */}
            <li>
              <a
                href="/cart"
                className="block w-full hover:text-gray-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart ({cartCount})
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
