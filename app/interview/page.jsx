"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { pickSessionQuestions } from "@/lib/questions";

const CATALOGUE = [
  { cat: "dev", label: "Development", roles: [
    { name: "Frontend Developer",      icon: "🖥",  kw: "frontend react" },
    { name: "Backend Developer",       icon: "⚙️",  kw: "backend api" },
    { name: "Full Stack Developer",    icon: "🔀",  kw: "full stack" },
    { name: "Mobile App Developer",    icon: "📱",  kw: "mobile app" },
    { name: "Game Developer",          icon: "🎮",  kw: "game developer" },
  ]},
  { cat: "data", label: "Data & AI", roles: [
    { name: "Data Analyst",            icon: "📊",  kw: "data analyst" },
    { name: "Data Scientist",          icon: "🔬",  kw: "data scientist" },
    { name: "Data Engineer",           icon: "🏗",  kw: "data engineer" },
    { name: "Machine Learning Engineer",icon: "🤖", kw: "machine learning" },
    { name: "AI Engineer",             icon: "✨",  kw: "ai engineer" },
  ]},
  { cat: "devops", label: "DevOps & Cloud", roles: [
    { name: "DevOps Engineer",         icon: "🔧",  kw: "devops cicd" },
    { name: "Cloud Engineer",          icon: "☁️",  kw: "cloud aws azure" },
    { name: "Site Reliability Engineer",icon: "📡", kw: "sre reliability" },
  ]},
  { cat: "qa", label: "Testing & QA", roles: [
    { name: "QA Engineer",             icon: "✅",  kw: "qa quality" },
    { name: "Automation Tester",       icon: "⚡",  kw: "automation selenium" },
    { name: "Manual Tester",           icon: "🔍",  kw: "manual tester" },
  ]},
  { cat: "sec", label: "Security", roles: [
    { name: "Cybersecurity Analyst",   icon: "🛡",  kw: "cybersecurity" },
    { name: "Ethical Hacker",          icon: "🔐",  kw: "ethical hacker penetration" },
    { name: "Security Engineer",       icon: "🔒",  kw: "security engineer" },
  ]},
  { cat: "design", label: "UI/UX & Design", roles: [
    { name: "UI Designer",             icon: "🎨",  kw: "ui designer" },
    { name: "UX Designer",             icon: "🧩",  kw: "ux designer" },
    { name: "Product Designer",        icon: "💎",  kw: "product designer" },
  ]},
  { cat: "mgmt", label: "Management & Support", roles: [
    { name: "Project Manager",         icon: "📋",  kw: "project manager" },
    { name: "Product Manager",         icon: "🗺",  kw: "product manager" },
    { name: "Business Analyst",        icon: "📈",  kw: "business analyst" },
    { name: "IT Support Engineer",     icon: "🖱",  kw: "it support" },
  ]},
];

const TYPE_COLOR = { Technical:"#2d5a3d", Behavioural:"#c8502a", Situational:"#8a5c00", HR:"#5b4fcf" };
const HINTS = [
  "Intro tip: Cover your background, key skills, and why you are here — keep it under 2 minutes",
  "Tip: Use a specific example, not a general statement",
  "Tip: Quantify your impact with numbers where possible",
  "Tip: Show your reasoning, not just what you did",
  "Tip: Technical answers benefit from named tools and tradeoffs",
  "Tip: End with what you learned or would do differently",
  "Tip: Be specific — vague answers score lower",
  "Tip: Keep it to 2–3 minutes when speaking out loud",
];

const s = (obj) => obj; // inline style helper shorthand

export default function InterviewPage() {
  const router = useRouter();

  const [view, setView]         = useState("roles");
  const [search, setSearch]     = useState("");
  const [role, setRole]         = useState("");
  const [cat, setCat]           = useState("");
  const [level, setLevel]       = useState("mid");
  const [company, setCompany]   = useState("");
  const [jobDesc, setJobDesc]   = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");

  const [questions, setQuestions]       = useState([]);
  const [answers, setAnswers]           = useState([]);
  const [allAttempts, setAllAttempts]   = useState({});
  const [currentQ, setCurrentQ]         = useState(0);
  const [mode, setMode]                 = useState("text");
  const [feedback, setFeedback]         = useState([]);

  const [timeLeft, setTimeLeft] = useState(120);
  const [recSecs, setRecSecs]   = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const timerRef = useRef(null);
  const recRef   = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText]     = useState("");
  const recogRef = useRef(null);

  const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(120);
    timerRef.current = setInterval(() =>
      setTimeLeft(t => { if (t<=1){clearInterval(timerRef.current);return 0;} return t-1; }), 1000);
  }, []);

  const startRecTimer = useCallback(() => {
    if (recRef.current) clearInterval(recRef.current);
    setRecSecs(0);
    recRef.current = setInterval(() => setRecSecs(s => s+1), 1000);
  }, []);

  const currentAnswer = mode === "text" ? (answers[currentQ] ?? "") : voiceText;

  function saveAnswer() {
    const text = currentAnswer.trim();
    const ts = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    setAnswers(prev => { const a=[...prev]; a[currentQ]=text; return a; });
    setAllAttempts(prev => {
      const ex = prev[currentQ] ?? [];
      return {...prev, [currentQ]: [...ex, {text, score:0, ts}]};
    });
  }

  function goToQ(idx) {
    saveAnswer();
    setCurrentQ(idx);
    setVoiceText(answers[idx] ?? "");
    setWordCount((answers[idx]??"").trim().split(/\s+/).filter(Boolean).length);
    setRecSecs(0);
    startTimer(); startRecTimer();
  }

  async function startInterview() {
    setView("loading");
    const msgs = [
      `Analysing ${role} requirements…`,
      `Calibrating for ${level} level…`,
      "Crafting your question set…",
      "Almost ready…",
    ];
    let i = 0; setLoadingMsg(msgs[0]);
    const iv = setInterval(() => { i=Math.min(i+1,msgs.length-1); setLoadingMsg(msgs[i]); }, 750);

    let qs = pickSessionQuestions(cat, level);

    if (jobDesc.trim().length > 80) {
      try {
        const res = await fetch("/api/generate-questions", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({role, level, company, jobDesc}),
        });
        if (res.ok) { const d = await res.json(); if (d.questions?.length>=6) qs=d.questions; }
      } catch { /* use curated */ }
    }

    clearInterval(iv);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(""));
    setAllAttempts({}); setCurrentQ(0); setVoiceText(""); setWordCount(0);
    setView("interview"); startTimer(); startRecTimer();
  }

  function nextQ() {
    saveAnswer();
    if (currentQ < questions.length-1) goToQ(currentQ+1);
    else submitInterview();
  }

  function skipQ() {
    setAnswers(prev => { const a=[...prev]; a[currentQ]=""; return a; });
    if (currentQ < questions.length-1) goToQ(currentQ+1);
    else submitInterview();
  }

  async function submitInterview() {
    saveAnswer();
    if (timerRef.current) clearInterval(timerRef.current);
    if (recRef.current)   clearInterval(recRef.current);
    setView("evaluating");

    try {
      const res = await fetch("/api/evaluate", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({questions, answers, role, roleCat:cat, level, company}),
      });
      const data = await res.json();
      const fb = data.feedback;

      setAllAttempts(prev => {
        const upd = {...prev};
        fb.forEach((f,i) => {
          if (upd[i]?.length) {
            const last = upd[i][upd[i].length-1];
            upd[i] = [...upd[i].slice(0,-1), {...last, score:f.score}];
          }
        });
        return upd;
      });
      setFeedback(fb);
    } catch {
      setFeedback(questions.map(() => ({score:5, good:"AI unavailable — check your ANTHROPIC_API_KEY in .env", missing:"", better:""})));
    }
    setView("feedback");
  }

  function toggleVoice() {
    if (isRecording) { recogRef.current?.stop(); setIsRecording(false); return; }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR(); r.continuous=true; r.interimResults=true;
    r.onresult = e => { let t=""; for(let i=0;i<e.results.length;i++) t+=e.results[i][0].transcript; setVoiceText(t); setWordCount(t.trim().split(/\s+/).filter(Boolean).length); };
    r.start(); recogRef.current=r; setIsRecording(true);
  }

  const filtered = CATALOGUE
    .map(c => ({...c, roles: c.roles.filter(r => !search || r.kw.includes(search.toLowerCase()) || r.name.toLowerCase().includes(search.toLowerCase()))}))
    .filter(c => c.roles.length);

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (view === "loading" || view === "evaluating") return (
    <>
      <Nav />
      <div style={{minHeight:"60vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20}}>
        <div style={{display:"flex",gap:8}}>
          {[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:"#6b6760",animation:`bounce 1.2s ${i*.15}s ease infinite`}}/>)}
        </div>
        <p style={{fontFamily:"Georgia,serif",fontSize:22,color:"#6b6760",fontStyle:"italic"}}>{view==="loading"?loadingMsg:"Evaluating your answers…"}</p>
        {view==="evaluating"&&<p style={{fontSize:13,color:"#9e9b96"}}>This usually takes 5–10 seconds</p>}
      </div>
    </>
  );

  // ── ROLE BROWSER ─────────────────────────────────────────────────────────
  if (view === "roles") return (
    <>
      <Nav />
      <div style={{maxWidth:960,margin:"0 auto",padding:"50px 40px 120px"}}>
        <div className="fade-up" style={{marginBottom:32}}>
          <h2 style={{fontFamily:"Instrument Serif,Georgia,serif",fontSize:36,letterSpacing:"-0.02em",marginBottom:8}}>Choose your role</h2>
          <p style={{fontSize:14,color:"#6b6760",fontWeight:300}}>Questions will be tailored to your role and level.</p>
        </div>

        <div className="fade-up-2" style={{position:"relative",marginBottom:32}}>
          <svg style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#9e9b96"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search roles… e.g. backend, QA, ML" style={{width:"100%",padding:"13px 16px 13px 44px",background:"#faf9f6",border:"1px solid #e8e5de",borderRadius:10,fontFamily:"inherit",fontSize:14,color:"#1a1814",outline:"none"}}/>
        </div>

        <div className="fade-up-3" style={{display:"flex",flexDirection:"column",gap:28}}>
          {filtered.map(c=>(
            <div key={c.cat}>
              <div style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:"#9e9b96",fontWeight:500,marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
                {c.label}<span style={{flex:1,height:1,background:"#e8e5de",display:"block"}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:8}}>
                {c.roles.map(r=>(
                  <div key={r.name} onClick={()=>{setRole(r.name);setCat(c.cat);}}
                    style={{padding:"14px 16px",border:`1px solid ${role===r.name?"#1a1814":"#e8e5de"}`,borderRadius:10,cursor:"pointer",background:role===r.name?"#1a1814":"#faf9f6",display:"flex",alignItems:"center",gap:10,transition:"all .15s"}}>
                    <div style={{width:32,height:32,borderRadius:8,background:"#f2f0eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{r.icon}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500,color:role===r.name?"#faf9f6":"#1a1814"}}>{r.name}</div>
                      <div style={{fontSize:11,color:role===r.name?"rgba(255,255,255,.4)":"#9e9b96",marginTop:1}}>{c.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {role && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(250,249,246,.95)",backdropFilter:"blur(12px)",borderTop:"1px solid #e8e5de",padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:50}}>
          <p style={{fontSize:14,color:"#3d3a34"}}>Interviewing as <strong style={{fontWeight:500,color:"#1a1814"}}>{role}</strong></p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setRole("")} style={{padding:"8px 14px",background:"transparent",border:"none",color:"#6b6760",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>← Back</button>
            <button onClick={()=>setView("detail")} style={{padding:"10px 22px",background:"#1a1814",color:"#faf9f6",border:"none",borderRadius:4,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Continue →</button>
          </div>
        </div>
      )}
    </>
  );

  // ── DETAIL FORM ───────────────────────────────────────────────────────────
  if (view === "detail") return (
    <>
      <Nav />
      <div style={{maxWidth:680,margin:"0 auto",padding:"60px 40px 80px"}}>
        <div className="fade-up" style={{marginBottom:40}}>
          <h2 style={{fontFamily:"Instrument Serif,Georgia,serif",fontSize:36,letterSpacing:"-0.02em",marginBottom:8}}>{role} interview</h2>
          <p style={{fontSize:14,color:"#6b6760",fontWeight:300}}>Add context for more targeted questions.</p>
        </div>
        <div className="fade-up-2">
          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:"#6b6760",marginBottom:8}}>
              Company <span style={{color:"#9e9b96",fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span>
            </label>
            <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="e.g. Google, Stripe, startup" style={{width:"100%",padding:"12px 14px",background:"#faf9f6",border:"1px solid #e8e5de",borderRadius:4,fontFamily:"inherit",fontSize:14,color:"#1a1814",outline:"none"}}/>
          </div>

          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:"#6b6760",marginBottom:8}}>Seniority level</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {["junior","mid","senior"].map(l=>(
                <div key={l} onClick={()=>setLevel(l)} style={{padding:"14px 12px",border:`1px solid ${level===l?"#1a1814":"#e8e5de"}`,borderRadius:4,cursor:"pointer",textAlign:"center",background:level===l?"#1a1814":"#faf9f6",transition:"all .15s"}}>
                  <div style={{fontSize:13,fontWeight:500,color:level===l?"#faf9f6":"#1a1814",textTransform:"capitalize"}}>{l}</div>
                  <div style={{fontSize:11,color:level===l?"rgba(255,255,255,.5)":"#9e9b96"}}>{l==="junior"?"0–2 yrs":l==="mid"?"2–5 yrs":"5+ yrs"}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{marginBottom:32}}>
            <label style={{display:"block",fontSize:12,fontWeight:500,letterSpacing:"0.06em",textTransform:"uppercase",color:"#6b6760",marginBottom:8}}>
              Job description <span style={{color:"#9e9b96",fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional — paste for AI-targeted questions)</span>
            </label>
            <textarea value={jobDesc} onChange={e=>setJobDesc(e.target.value)} placeholder="Paste the full job description here for best results…" style={{width:"100%",minHeight:120,padding:"12px 14px",background:"#faf9f6",border:"1px solid #e8e5de",borderRadius:4,fontFamily:"inherit",fontSize:14,color:"#1a1814",outline:"none",resize:"vertical",lineHeight:1.6}}/>
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <button onClick={()=>setView("roles")} style={{padding:"8px 14px",background:"transparent",border:"none",color:"#6b6760",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Change role</button>
            <button onClick={startInterview} style={{padding:"14px 32px",background:"#1a1814",color:"#faf9f6",border:"none",borderRadius:4,fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Generate questions →</button>
          </div>
        </div>
      </div>
    </>
  );

  // ── INTERVIEW SESSION ─────────────────────────────────────────────────────
  if (view === "interview") {
    const q = questions[currentQ];
    const pct = ((currentQ+1)/questions.length)*100;
    return (
      <>
        <Nav />
        <div style={{maxWidth:820,margin:"0 auto",padding:"40px 40px 80px"}}>
          {/* Top bar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <div style={{fontSize:13,color:"#6b6760"}}><strong style={{color:"#1a1814"}}>{role}</strong>{company&&<> at {company}</>}</div>
            <div style={{flex:1,margin:"0 40px"}}>
              <div style={{height:3,background:"#e8e5de",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:"#1a1814",borderRadius:99,transition:"width .4s ease"}}/>
              </div>
              <div style={{fontSize:11,color:"#9e9b96",marginTop:5,textAlign:"center"}}>Question {currentQ+1} of {questions.length}</div>
            </div>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,color:timeLeft<=30?"#c8502a":"#6b6760",letterSpacing:"-0.02em",minWidth:60,textAlign:"right"}}>{fmt(timeLeft)}</div>
          </div>

          {/* Navigator dots */}
          <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
            {questions.map((qn,i)=>{
              const done = answers[i]&&answers[i].length>0;
              const active = i===currentQ;
              return (
                <div key={i} onClick={()=>goToQ(i)} title={`Q${i+1}: ${qn.type}`}
                  style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:500,cursor:"pointer",flexShrink:0,
                    background:active?(TYPE_COLOR[qn.type]??"#1a1814"):done?"#e8e5de":"transparent",
                    color:active?"white":done?"#6b6760":"#9e9b96",
                    border:active?"none":"1px solid #e8e5de",transition:"all .2s"}}>
                  {done&&!active?"✓":qn.type[0]}
                </div>
              );
            })}
          </div>

          {/* Type badge */}
          <div style={{fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:500,color:TYPE_COLOR[q?.type]??"#6b6760",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:TYPE_COLOR[q?.type]??"#6b6760",display:"inline-block"}}/>
            {q?.type}
          </div>

          {/* Question */}
          <div className="fade-up" style={{fontFamily:"Instrument Serif,Georgia,serif",fontSize:"clamp(20px,3vw,28px)",lineHeight:1.35,color:"#1a1814",letterSpacing:"-0.02em",marginBottom:36}}>
            {q?.text}
          </div>

          {/* Mode toggle */}
          <div style={{display:"flex",gap:6,marginBottom:16}}>
            {["text","voice"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{padding:"6px 14px",borderRadius:4,fontSize:12,fontWeight:500,cursor:"pointer",border:`1px solid ${mode===m?"#1a1814":"#e8e5de"}`,background:mode===m?"#1a1814":"#faf9f6",color:mode===m?"#faf9f6":"#6b6760",fontFamily:"inherit",textTransform:"capitalize"}}>
                {m==="text"?"Type":"Speak"}
              </button>
            ))}
          </div>

          {/* Answer input */}
          {mode==="text"?(
            <div>
              <textarea
                value={answers[currentQ]??""}
                onChange={e=>{const v=e.target.value;setAnswers(p=>{const a=[...p];a[currentQ]=v;return a;});setWordCount(v.trim().split(/\s+/).filter(Boolean).length);}}
                placeholder="Write your answer. Use STAR: Situation → Task → Action → Result…"
                style={{width:"100%",minHeight:200,padding:18,background:"#faf9f6",border:"1px solid #e8e5de",borderRadius:10,fontFamily:"inherit",fontSize:15,color:"#1a1814",lineHeight:1.7,resize:"vertical",outline:"none"}}
              />
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#f2f0eb",border:"1px solid #e8e5de",borderRadius:4,marginTop:10,fontSize:12,color:"#6b6760"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#c8502a",animation:"recpulse 1s ease infinite",flexShrink:0}}/>
                <span>Recording</span>
                <span style={{fontFamily:"monospace"}}>{fmt(recSecs)}</span>
                <span style={{marginLeft:"auto",fontSize:11,padding:"2px 8px",borderRadius:99,
                  background:wordCount>=80?"#e8f0eb":wordCount>=30?"#e8e5de":"#fdeaea",
                  color:wordCount>=80?"#2d5a3d":wordCount>=30?"#6b6760":"#8a1f1f"}}>
                  {wordCount} words
                </span>
              </div>
            </div>
          ):(
            <div style={{border:"1px solid #e8e5de",borderRadius:10,padding:40,textAlign:"center",minHeight:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
              <button onClick={toggleVoice} style={{width:72,height:72,borderRadius:"50%",background:isRecording?"#c8502a":"#1a1814",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"all .2s"}}>
                {isRecording&&<div style={{position:"absolute",width:"100%",height:"100%",borderRadius:"50%",background:"#c8502a",opacity:.3,animation:"pulse 1.5s ease infinite"}}/>}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{position:"relative",zIndex:1}}>
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div style={{fontSize:13,color:"#6b6760"}}>{isRecording?"Listening… tap to stop":"Tap to start speaking"}</div>
              {voiceText&&<div style={{width:"100%",padding:"12px 14px",background:"#f2f0eb",borderRadius:4,fontSize:14,color:"#3d3a34",lineHeight:1.6,textAlign:"left"}}>{voiceText}</div>}
            </div>
          )}

          {/* Actions */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:24}}>
            <p style={{fontSize:12,color:"#9e9b96",fontStyle:"italic"}}>{HINTS[currentQ]??HINTS[0]}</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={skipQ} style={{padding:"8px 14px",background:"transparent",border:"none",color:"#9e9b96",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Skip</button>
              <button onClick={nextQ} style={{padding:"10px 22px",background:"#1a1814",color:"#faf9f6",border:"none",borderRadius:4,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>
                {currentQ===questions.length-1?"Submit & get feedback":"Next question →"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── FEEDBACK ──────────────────────────────────────────────────────────────
  if (view === "feedback") {
    const scores = feedback.map(f=>Number(f.score)||0);
    const overall = scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0;
    const band = overall>=8.5?"Excellent":overall>=7?"Good":overall>=5.5?"Average":"Needs work";
    const bandColor = overall>=7?"#7ec89a":overall>=5.5?"#f0c96a":"#f0856a";
    const cats = {Behavioural:[],Technical:[],Situational:[],HR:[]};
    questions.forEach((q,i)=>{ if(cats[q.type]) cats[q.type].push(scores[i]); });
    const catAvg = a => a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1):null;
    const totalWords = answers.reduce((sum,a)=>sum+(a?a.trim().split(/\s+/).filter(Boolean).length:0),0);
    const answered = answers.filter(a=>a&&a.trim().length>5).length;

    return (
      <>
        <Nav />
        <div style={{maxWidth:820,margin:"0 auto",padding:"50px 40px 80px"}}>
          <div className="fade-up" style={{marginBottom:48}}>
            <h2 style={{fontFamily:"Instrument Serif,Georgia,serif",fontSize:36,letterSpacing:"-0.02em",marginBottom:6}}>Your interview results</h2>
            <p style={{fontSize:14,color:"#6b6760",fontWeight:300}}>{role}{company?` · ${company}`:""} · {questions.length} questions</p>
          </div>

          {/* Score overview */}
          <div className="fade-up-2" style={{background:"#1a1814",borderRadius:10,padding:32,marginBottom:40,display:"grid",gridTemplateColumns:"auto 1fr",gap:32,alignItems:"center"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:72,lineHeight:1,letterSpacing:"-0.04em",color:"#e8a87c"}}>
              {overall.toFixed(1)}<span style={{fontSize:28,color:"rgba(255,255,255,.3)"}}>/10</span>
            </div>
            <div>
              <div style={{fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:6}}>Overall band</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:26,color:bandColor,marginBottom:12}}>{band}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {Object.entries(cats).filter(([,a])=>a.length).map(([type,arr])=>{
                  const avg=catAvg(arr);
                  return avg?(
                    <div key={type} style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:11,color:"rgba(255,255,255,.4)",width:88}}>{type}</div>
                      <div style={{flex:1,height:4,background:"rgba(255,255,255,.1)",borderRadius:99}}>
                        <div style={{height:"100%",width:`${parseFloat(avg)*10}%`,background:"rgba(255,255,255,.5)",borderRadius:99,transition:"width .6s"}}/>
                      </div>
                      <span style={{fontSize:12,color:"rgba(255,255,255,.5)",minWidth:28,textAlign:"right"}}>{avg}</span>
                    </div>
                  ):null;
                })}
              </div>
            </div>
          </div>

          {/* Session analysis */}
          <div className="fade-up-3" style={{background:"#f2f0eb",borderRadius:10,border:"1px solid #e8e5de",padding:24,marginBottom:32}}>
            <div style={{fontSize:13,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",color:"#6b6760",marginBottom:16}}>Session analysis</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {[
                {l:"Total words",     v:totalWords.toLocaleString(), s:"across all answers"},
                {l:"Avg per answer",  v:answered?Math.round(totalWords/answered):0, s:"words per question"},
                {l:"Answered",        v:`${answered}/${questions.length}`, s:"questions attempted"},
                {l:"Best score",      v:scores.length?Math.max(...scores):"—", s:`Q${scores.indexOf(Math.max(...scores))+1}`},
                {l:"Lowest score",    v:scores.filter(s=>s>0).length?Math.min(...scores.filter(s=>s>0)):"—", s:"room to improve"},
                {l:"STAR used",       v:answers.filter(a=>{if(!a)return false;const t=a.toLowerCase();let sc=0;if(/\b(situation|context|when i was)/.test(t))sc++;if(/\b(task|goal|my role)/.test(t))sc++;if(/\b(i decided|i built|i led)/.test(t))sc++;if(/\b(result|improved|\d+%)/.test(t))sc++;return sc>=3;}).length+"/"+questions.length, s:"answers used STAR"},
              ].map(item=>(
                <div key={item.l}>
                  <div style={{fontSize:11,color:"#9e9b96",marginBottom:4}}>{item.l}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:22,letterSpacing:"-0.02em"}}>{item.v}</div>
                  <div style={{fontSize:11,color:"#6b6760",marginTop:2}}>{item.s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Per-question cards */}
          <div className="fade-up-4" style={{display:"flex",flexDirection:"column",gap:14,marginBottom:40}}>
            {questions.map((q,i)=>(
              <FeedbackCard key={i} index={i} question={q} answer={answers[i]??""} fb={feedback[i]} attempts={allAttempts[i]??[]}
                onRetry={()=>{setCurrentQ(i);setAnswers(p=>{const a=[...p];a[i]="";return a;});setVoiceText("");setWordCount(0);setView("interview");startTimer();startRecTimer();}}
              />
            ))}
          </div>

          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button onClick={()=>{setRole("");setView("roles");}} style={{padding:"10px 22px",background:"#1a1814",color:"#faf9f6",border:"none",borderRadius:4,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Practice again</button>
            <button onClick={()=>router.push("/dashboard")} style={{padding:"10px 22px",background:"transparent",color:"#1a1814",border:"1px solid #e8e5de",borderRadius:4,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>View dashboard</button>
          </div>
        </div>
      </>
    );
  }

  return null;
}

// ── Feedback card ─────────────────────────────────────────────────────────────
function FeedbackCard({ question, answer, fb, attempts, onRetry }) {
  const [open, setOpen] = useState(false);
  const score = Number(fb?.score) || 0;
  const scoreColor = score>=8?"#2d5a3d":score>=6?"#8a5c00":"#c8502a";
  const scoreBg    = score>=8?"#e8f0eb":score>=6?"#fdf3dd":"#fdeaea";

  const prevText   = attempts.length>1?attempts[0].text:null;
  const latestText = attempts.length>0?attempts[attempts.length-1].text:answer;
  const diffWords  = prevText?(() => {
    const prev = new Set(prevText.toLowerCase().split(/\s+/).filter(w=>w.length>3).map(w=>w.replace(/[^a-z]/g,"")));
    const curr = latestText.toLowerCase().split(/\s+/).filter(w=>w.length>3);
    return [...new Set(curr.map(w=>w.replace(/[^a-z]/g,"")).filter(w=>w&&!prev.has(w)))].slice(0,10);
  })():[];

  return (
    <div style={{border:"1px solid #e8e5de",borderRadius:10,overflow:"hidden"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"18px 20px",background:"#f2f0eb",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:scoreBg,color:scoreColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,flexShrink:0}}>{score}</div>
        <div style={{fontSize:14,color:"#3d3a34",flex:1,lineHeight:1.45}}>{question.text.substring(0,90)}{question.text.length>90?"…":""}</div>
        <div style={{fontSize:10,color:"#9e9b96",textTransform:"uppercase",letterSpacing:"0.08em",flexShrink:0,marginRight:8}}>{question.type}</div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:"#9e9b96",flexShrink:0,transition:"transform .2s",transform:open?"rotate(180deg)":""}}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {open&&(
        <div style={{padding:20,borderTop:"1px solid #e8e5de",display:"flex",flexDirection:"column",gap:18}}>
          <div>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",color:"#9e9b96",marginBottom:8}}>Your answer</div>
            <div style={{background:"#f2f0eb",borderRadius:4,padding:"14px 16px",fontSize:13,color:"#6b6760",lineHeight:1.65}}>
              {answer||<em style={{color:"#9e9b96"}}>No answer recorded</em>}
            </div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",color:"#9e9b96",marginBottom:8}}>What worked</div>
            <div style={{fontSize:14,color:"#3d3a34",lineHeight:1.65}}>{fb?.good||"—"}</div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",color:"#9e9b96",marginBottom:8}}>What was missing</div>
            <div style={{fontSize:14,color:"#3d3a34",lineHeight:1.65}}>{fb?.missing||"—"}</div>
          </div>
          <div>
            <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",color:"#9e9b96",marginBottom:8}}>A stronger answer</div>
            <div style={{background:"#e8f0eb",borderRadius:4,padding:"14px 16px",fontSize:13,color:"#2d5a3d",lineHeight:1.65,fontStyle:"italic"}}>{fb?.better||"—"}</div>
          </div>

          {attempts.length>=2&&(
            <div style={{paddingTop:16,borderTop:"1px solid #e8e5de"}}>
              <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",color:"#9e9b96",marginBottom:10}}>All {attempts.length} attempts</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {attempts.map((att,ai)=>(
                  <div key={ai} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:4,background:ai===attempts.length-1?"#faf9f6":"#f2f0eb",border:`1px solid ${ai===attempts.length-1?"#e8e5de":"transparent"}`}}>
                    <div style={{fontSize:10,color:"#9e9b96",minWidth:64,flexShrink:0,marginTop:1}}>Attempt {ai+1}<br/>{att.ts}</div>
                    <div style={{fontSize:12,color:"#6b6760",lineHeight:1.5,flex:1}}>{(att.text||"").substring(0,80)}{att.text?.length>80?"…":""}</div>
                    <div style={{fontSize:12,fontWeight:500,minWidth:28,textAlign:"right",color:att.score>=8?"#2d5a3d":att.score>=6?"#8a5c00":att.score>0?"#c8502a":"#9e9b96"}}>{att.score>0?att.score:"—"}</div>
                  </div>
                ))}
              </div>
              {diffWords.length>0&&(
                <div style={{background:"#e8f0eb",borderRadius:4,padding:"12px 14px",marginTop:10}}>
                  <div style={{fontSize:11,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.08em",color:"#2d5a3d",marginBottom:8}}>What you added in your latest attempt</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {diffWords.map(w=><span key={w} style={{fontSize:12,padding:"3px 10px",borderRadius:99,background:"rgba(45,90,61,.15)",color:"#2d5a3d",border:"1px solid rgba(45,90,61,.2)"}}>+ {w}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{paddingTop:16,borderTop:"1px solid #e8e5de"}}>
            <button onClick={onRetry} style={{padding:"7px 14px",background:"transparent",color:"#1a1814",border:"1px solid #e8e5de",borderRadius:4,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              Retry this question →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
