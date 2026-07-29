import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-paper-line py-4 px-4 text-center text-xs text-ink-muted bg-white/50">
      © {new Date().getFullYear()} IIIT Kota Resources · Built by students, for
      students
    </footer>
  );
};

export default Footer;
