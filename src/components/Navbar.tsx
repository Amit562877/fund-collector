'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { name: 'Loans', href: '/loans' },
  { name: 'Funds', href: '/funds' },
  { name: 'Users', href: '/users' },
  { name: 'Dashboard', href: '/dashboard' },
];

const Navbar: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav style={{
      background: '#1976d2',
      color: '#fff',
      padding: '0.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Fund Collector</span>
      {/* Hamburger for mobile (always visible on mobile) */}
      <button
        onClick={() => setNavOpen(!navOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '1.5rem',
          display: 'block',
          cursor: 'pointer',
          marginLeft: 'auto',
          marginRight: '0.5rem',
          minWidth: 40,
          minHeight: 40,
        }}
        className="nav-hamburger"
        aria-label="Toggle navigation"
      >
        ☰
      </button>
      {/* Desktop Nav (hidden by default, shown on desktop) */}
      <ul
        style={{
          listStyle: 'none',
          display: 'none',
          gap: '1.5rem',
          margin: 0,
          padding: 0,
        }}
        className="nav-desktop"
      >
        {navLinks.map(link => (
          <li key={link.name}>
            <Link
              href={link.href}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      {/* Mobile Nav Drawer (shown when hamburger is clicked) */}
      {navOpen && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: '1rem',
            background: '#1976d2',
            position: 'absolute',
            top: '3.5rem',
            left: 0,
            right: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
          className="nav-mobile"
        >
          {navLinks.map(link => (
            <li key={link.name}>
              <Link
                href={link.href}
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                }}
                onClick={() => setNavOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {/* Responsive CSS */}
      <style>{`
        .nav-desktop {
          display: none;
        }
        .nav-hamburger {
          display: block;
        }
        @media (min-width: 768px) {
          .nav-desktop {
            display: flex !important;
          }
          .nav-hamburger {
            display: none !important;
          }
          .nav-mobile {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;