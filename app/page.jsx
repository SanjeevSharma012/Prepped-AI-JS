import Link from "next/link";
import { Nav } from "@/components/nav";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <section style={{
          maxWidth: 1100, margin: "0 auto", padding: "80px 40px 60px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
        }}>
          <div className="fade-up">
            <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8502a", fontWeight: 500, display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ width: 24, height: 1, background: "#c8502a", display: "block" }} />
              AI-powered interview prep
            </div>

            <h1 style={{ fontFamily: "Instrument Serif, Georgia, serif", fontSize: "clamp(38px,5vw,58px)", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 20, color: "#1a1814" }}>
              Walk in{" "}
              <em style={{ fontStyle: "italic", color: "#c8502a" }}>ready.</em>
              <br />Not hoping.
            </h1>

            <p style={{ fontSize: 16, color: "#6b6760", lineHeight: 1.65, marginBottom: 36, fontWeight: 300, maxWidth: 420 }}>
              Pick your role. Get 8 tailored questions starting with &ldquo;Tell me about yourself&rdquo;.
              Answer by text or voice. Get honest AI feedback per question.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/interview" style={{ padding: "14px 32px", background: "#1a1814", color: "#faf9f6", borderRadius: 4, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                Start a mock interview
              </Link>
              <Link href="/dashboard" style={{ padding: "14px 32px", background: "transparent", color: "#1a1814", border: "1px solid #e8e5de", borderRadius: 4, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>
                View dashboard
              </Link>
            </div>

            <p style={{ fontSize: 12, color: "#9e9b96", marginTop: 16 }}>
              100% free · No account needed · No credit card · Open source
            </p>
          </div>

          {/* Preview card */}
          <div className="fade-up-2" style={{ background: "#1a1814", borderRadius: 16, padding: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "#c8502a", opacity: 0.12 }} />
            <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e8a87c", marginBottom: 16, fontWeight: 500 }}>
              Question 1 of 8 — always
            </div>
            <div style={{ fontFamily: "Instrument Serif, Georgia, serif", fontSize: 19, color: "#f5f3ee", lineHeight: 1.45, marginBottom: 20, fontStyle: "italic" }}>
              &ldquo;Tell me about yourself and your journey into this field.&rdquo;
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {["HR", "Always first", "Free forever"].map(t => (
                <span key={t} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, fontWeight: 500, background: "rgba(200,80,42,0.25)", color: "#e8a87c" }}>{t}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(200,80,42,0.2)", border: "1.5px solid #c8502a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia,serif", fontSize: 20, color: "#e8a87c" }}>8</div>
              <div>
                <div style={{ color: "#7ec89a", fontSize: 13, fontWeight: 500 }}>Strong answer</div>
                <div style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>Good use of STAR · Add outcome metric</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }}>
          {[
            { n: "01", t: "Intro always first", d: "Every session opens with 'Tell me about yourself' then 7 role-specific questions tailored to your level." },
            { n: "02", t: "Honest AI feedback", d: "Score per question, what worked, what was missing, and a stronger model answer — powered by Claude." },
            { n: "03", t: "177 questions, 7 roles", d: "Dev, Data & AI, DevOps, QA, Security, Design, Management. Different questions every session." },
          ].map((f, i) => (
            <div key={f.n} className={`fade-up-${i + 2}`} style={{ padding: 32, background: "#f2f0eb", borderRadius: i === 0 ? "10px 4px 4px 10px" : i === 2 ? "4px 10px 10px 4px" : 4 }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 36, color: "#e8e5de", fontStyle: "italic", marginBottom: 14, lineHeight: 1 }}>{f.n}</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{f.t}</div>
              <div style={{ fontSize: 13, color: "#6b6760", lineHeight: 1.6 }}>{f.d}</div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
