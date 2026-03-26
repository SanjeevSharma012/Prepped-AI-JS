"use client";
import Link from "next/link";


export function Nav() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(250,249,246,0.92)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e8e5de", padding: "0 40px", height: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link href="/" style={{
        fontFamily: "Instrument Serif, Georgia, serif",
        fontSize: 22, color: "#1a1814", letterSpacing: "-0.02em",
        textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8502a", display: "inline-block" }} />
        Prepped
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link href="/" style={{ fontSize: 13, color: "#6b6760", textDecoration: "none" }}>Home</Link>
        <Link href="/dashboard" style={{ fontSize: 13, color: "#6b6760", textDecoration: "none" }}>Dashboard</Link>
        <Link href="/interview" style={{
          fontSize: 13, fontWeight: 500, color: "#faf9f6",
          background: "#1a1814", padding: "7px 16px", borderRadius: 4,
          textDecoration: "none",
        }}>
          Start interview
        </Link>
      </div>
    </nav>
  );
}
