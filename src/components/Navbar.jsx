import { Circle, Menu, X } from "lucide-react";
import { useState } from "react";
import { navbarStyles as s } from "../assets/dummyStyles";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={s.nav}>
      <div className={s.innerContainer}>
        <a href="#top" className={s.logo}>
          FootBuzz
        </a>

        {/* Desktop nav */}
        <div className={s.desktopNav}>
          <a href="#match-center" className={s.desktopNavLink}>
            Matches
          </a>
          <a href="#standings" className={s.desktopNavLink}>
            Standings
          </a>
          <a href="#fixtures" className={s.desktopNavLink}>
            Fixtures
          </a>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a href="#live" className={s.liveButton}>
            <Circle size={7} className={s.liveIcon} />
            <span className={s.liveTextFull}>Live Stream</span>
            <span className={s.liveTextShort}>Live</span>
          </a>

          {/* Mobile hamburger */}
          <button
            className={s.hamburgerButton}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className={s.mobileMenu}>
          {[
            ["#match-center", "Matches"],
            ["#standings", "Standings"],
           
            ["#fixtures", "Fixtures"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className={s.mobileMenuLink}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}