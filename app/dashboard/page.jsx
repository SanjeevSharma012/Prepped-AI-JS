"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then(r => r.json())
      .then(d => { setSessions(d.sessions ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <>
      <Nav />
      <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{display:"flex",gap:8}}>
          {[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:"#6b6760",animation:`bounce 1.2s ${i*.15}s ease infinite`}}/>)}
        </div>
      </div>
    </>
  );

  const scores = sessions.map(s=>s.score??0).filter(Boolean);
  const avgScore  = scores.length?(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1):"—";
  const bestScore = scores.length?Math.max(...scores).toFixed(1):"—";
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";

  return (
    <>
      <Nav />
      <div style={{maxWidth:1000,margin:"0 auto",padding:"50px 40px 80px"}}>
        <div className="fade-up">
          <h2 style={{fontFamily:"Instrument Serif,Georgia,serif",fontSize:32,letterSpacing:"-0.02em",marginBottom:6}}>{greeting}.</h2>
          <p style={{fontSize:14,color:"#6b6760",fontWeight:300,marginBottom:40}}>
            {sessions.length>0?`${sessions.length} session${sessions.length===1?"":"s"} completed. Keep going.`:"No sessions yet — start your first interview!"}
          </p>
        </div>

        {/* Stats */}
        <div className="fade-up-2" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:40}}>
          {[
            {label:"Sessions",     value:sessions.length},
            {label:"Avg score",    value:avgScore},
            {label:"Best score",   value:bestScore},
            {label:"Answers given",value:sessions.reduce((a,s)=>a+s.answerCount,0)},
          ].map(s=>(
            <div key={s.label} style={{padding:20,background:"#f2f0eb",borderRadius:10}}>
              <div style={{fontSize:11,color:"#9e9b96",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{s.label}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:30,letterSpacing:"-0.03em"}}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="fade-up-3" style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24}}>
          {/* Sessions list */}
          <div>
            <div style={{fontSize:13,fontWeight:500,letterSpacing:"0.04em",textTransform:"uppercase",color:"#6b6760",marginBottom:16}}>Recent sessions</div>
            {sessions.length===0?(
              <div style={{padding:32,textAlign:"center",border:"1px dashed #e8e5de",borderRadius:10}}>
                <p style={{fontSize:14,color:"#9e9b96",marginBottom:16}}>No sessions yet.</p>
                <Link href="/interview" style={{padding:"10px 22px",background:"#1a1814",color:"#faf9f6",borderRadius:4,fontSize:14,fontWeight:500,textDecoration:"none"}}>
                  Start your first interview →
                </Link>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {sessions.slice(0,10).map(s=>{
                  const sc = s.score??0;
                  const scoreColor = sc>=8?"#2d5a3d":sc>=7?"#8a5c00":"#c8502a";
                  const scoreBg    = sc>=8?"#e8f0eb":sc>=7?"#fdf3dd":"#fdeaea";
                  const d = new Date(s.createdAt);
                  const dateStr = d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
                  return (
                    <div key={s.id} style={{padding:"16px 18px",border:"1px solid #e8e5de",borderRadius:4,display:"flex",alignItems:"center",gap:16,background:"#faf9f6"}}>
                      <div style={{width:40,height:40,borderRadius:"50%",background:scoreBg,color:scoreColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,flexShrink:0}}>
                        {s.score?.toFixed(1)??"—"}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:500}}>{s.role}{s.company&&<span style={{color:"#9e9b96",fontWeight:400}}> · {s.company}</span>}</div>
                        <div style={{fontSize:12,color:"#9e9b96",marginTop:2}}>{dateStr} · {s.level} · {s.answerCount} questions</div>
                      </div>
                      <div style={{fontSize:10,color:"#9e9b96",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.level}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div style={{background:"#1a1814",borderRadius:10,padding:28,color:"white",marginBottom:20}}>
              <div style={{fontFamily:"Instrument Serif,Georgia,serif",fontSize:22,marginBottom:8}}>Ready for another round?</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.55,marginBottom:20}}>
                {sessions.length>0?"Pick a role and keep practising.":"Start your first session and see how you do."}
              </div>
              <Link href="/interview" style={{display:"inline-block",padding:"10px 22px",background:"#c8502a",color:"white",borderRadius:4,fontSize:14,fontWeight:500,textDecoration:"none"}}>
                Start interview →
              </Link>
            </div>

            <div style={{border:"1px solid #e8e5de",borderRadius:10,padding:20}}>
              <div style={{fontSize:12,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.08em",color:"#9e9b96",marginBottom:10}}>Tip of the day</div>
              <div style={{fontFamily:"Instrument Serif,Georgia,serif",fontSize:16,color:"#3d3a34",lineHeight:1.55,fontStyle:"italic"}}>
                &ldquo;Always end a behavioural answer with a concrete outcome — a number, a timeline, or a decision that changed.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
