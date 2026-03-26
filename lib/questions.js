export const HR_QUESTIONS = [
  { type: "HR", text: "Tell me about yourself and your journey into this field." },
  { type: "HR", text: "Why do you want this specific role at this company?" },
  { type: "HR", text: "What are your biggest strengths and how do they apply to this position?" },
  { type: "HR", text: "What is your biggest weakness and what are you actively doing to improve it?" },
  { type: "HR", text: "Why should we hire you over other candidates?" },
  { type: "HR", text: "Tell me about the most challenging project you have worked on." },
  { type: "HR", text: "Where do you see yourself in 5 years?" },
  { type: "HR", text: "How do you handle working under pressure or tight deadlines?" },
  { type: "HR", text: "Describe a time you failed. What happened and what did you learn?" },
  { type: "HR", text: "How do you prioritise tasks when everything feels urgent?" },
];

export const QUESTION_BANK = {
  dev: {
    core: [
      { type: "Technical", text: "What is the difference between var, let, and const in JavaScript? When would you use each?" },
      { type: "Technical", text: "Explain closures in JavaScript with an example. Why are they useful?" },
      { type: "Technical", text: "What is hoisting in JavaScript? How does it affect var, let, const, and function declarations?" },
      { type: "Technical", text: "What is event delegation and why is it useful for performance?" },
      { type: "Technical", text: "What is the difference between == and === in JavaScript?" },
      { type: "Technical", text: "What is a REST API? Explain the key HTTP methods and when to use each." },
      { type: "Technical", text: "What is the difference between synchronous and asynchronous code? Explain callbacks, Promises, and async/await." },
      { type: "Technical", text: "What is the event loop in JavaScript and how does it work?" },
      { type: "Technical", text: "What are higher-order functions? Give two real examples from your code." },
      { type: "Technical", text: "Explain the concept of immutability and why it matters in modern JavaScript." },
    ],
    frontend: [
      { type: "Technical", text: "What is the virtual DOM in React and how does it differ from the real DOM?" },
      { type: "Technical", text: "What are React hooks? Explain useState, useEffect, and useCallback with examples." },
      { type: "Technical", text: "What is the difference between React and Angular as frameworks?" },
      { type: "Technical", text: "How do you optimise website performance? Name at least 4 specific techniques." },
      { type: "Technical", text: "What is responsive design? How do you implement it without a CSS framework?" },
      { type: "Technical", text: "Explain the CSS box model. What is the difference between content-box and border-box?" },
      { type: "Technical", text: "What is code splitting and lazy loading in React? Why do they matter?" },
      { type: "Technical", text: "What is CORS? Why does it exist and how do you handle it in a frontend app?" },
      { type: "Technical", text: "What is the difference between localStorage, sessionStorage, and cookies?" },
      { type: "Technical", text: "How does React reconciliation work? What triggers a re-render?" },
    ],
    backend: [
      { type: "Technical", text: "What is middleware in Express.js? Give a real example of custom middleware." },
      { type: "Technical", text: "Explain authentication vs authorisation. How are they different in implementation?" },
      { type: "Technical", text: "What is JWT? How does it work and what are its security considerations?" },
      { type: "Technical", text: "What is the difference between SQL and NoSQL databases? When would you choose each?" },
      { type: "Technical", text: "What is database indexing? How does it improve query performance?" },
      { type: "Technical", text: "What is caching? Explain cache-aside, write-through, and when to invalidate cache." },
      { type: "Technical", text: "How would you design an API rate limiter?" },
      { type: "Technical", text: "What is the N+1 query problem and how do you fix it?" },
      { type: "Technical", text: "Explain the CAP theorem. How does it influence your choice of database?" },
      { type: "Technical", text: "What is the difference between horizontal and vertical scaling?" },
    ],
    behavioural: [
      { type: "Behavioural", text: "Tell me about a time you had to refactor a large codebase. What was your approach and outcome?" },
      { type: "Behavioural", text: "Describe a situation where a production bug caused major user impact. How did you respond?" },
      { type: "Behavioural", text: "Tell me about a time you disagreed with a technical decision. What did you do?" },
      { type: "Behavioural", text: "Describe a time you had to learn a new technology quickly for a project." },
      { type: "Behavioural", text: "Tell me about a time you mentored a junior developer. What was the outcome?" },
      { type: "Behavioural", text: "Describe a project where you had to balance technical debt with feature delivery." },
    ],
    situational: [
      { type: "Situational", text: "You discover a critical SQL injection vulnerability 2 hours before a major product launch. What do you do?" },
      { type: "Situational", text: "Your team is 3 days from a deadline and a key dependency just broke. How do you handle it?" },
      { type: "Situational", text: "A non-technical stakeholder keeps adding scope mid-sprint. How do you manage this?" },
      { type: "Situational", text: "You are asked to estimate a feature you have never built before. How do you approach it?" },
    ],
  },
  data: {
    core: [
      { type: "Technical", text: "What is data cleaning and why is it the most time-consuming part of data work?" },
      { type: "Technical", text: "What is the difference between a Data Analyst and a Data Scientist?" },
      { type: "Technical", text: "What is overfitting in machine learning? How do you detect and prevent it?" },
      { type: "Technical", text: "Explain supervised vs unsupervised learning with one real-world example of each." },
      { type: "Technical", text: "What are Pandas and NumPy? Describe how you use each in a typical analysis pipeline." },
      { type: "Technical", text: "What is the difference between regression and classification? Give an example of each." },
      { type: "Technical", text: "Explain the machine learning lifecycle from data collection to model deployment." },
      { type: "Technical", text: "What is feature engineering? Give 3 specific techniques you have used." },
      { type: "Technical", text: "What is the difference between precision and recall? When would you optimise for one over the other?" },
      { type: "Technical", text: "What is a confusion matrix and what does each cell tell you?" },
    ],
    advanced: [
      { type: "Technical", text: "What is cross-validation? Why is it better than a single train/test split?" },
      { type: "Technical", text: "Explain gradient descent. What is the difference between batch, mini-batch, and stochastic?" },
      { type: "Technical", text: "What is regularisation? Compare L1 (Lasso) and L2 (Ridge)." },
      { type: "Technical", text: "What is A/B testing? How do you calculate statistical significance and sample size?" },
      { type: "Technical", text: "How would you handle a severely imbalanced dataset in a classification problem?" },
      { type: "Technical", text: "What is dimensionality reduction? Explain PCA and when you would use it." },
      { type: "Technical", text: "What is data leakage in ML? Give an example of how it can silently destroy model validity." },
    ],
    behavioural: [
      { type: "Behavioural", text: "Tell me about a time your analysis directly changed a business decision." },
      { type: "Behavioural", text: "Describe a time you had to communicate a complex finding to a non-technical audience." },
      { type: "Behavioural", text: "Tell me about a model you built that underperformed in production. What happened?" },
      { type: "Behavioural", text: "Describe a time you found an insight in data that nobody else had noticed." },
    ],
    situational: [
      { type: "Situational", text: "Your model accuracy drops 20% in production overnight. Walk me through your investigation." },
      { type: "Situational", text: "A stakeholder wants a dashboard in 48 hours but the source data has serious quality issues." },
      { type: "Situational", text: "You are asked to build a churn prediction model but you only have 3 months of data." },
      { type: "Situational", text: "Two business units are getting conflicting insights from the same dataset. How do you resolve it?" },
    ],
  },
  devops: {
    core: [
      { type: "Technical", text: "What is CI/CD? Walk me through a pipeline you have built from commit to production." },
      { type: "Technical", text: "What is the difference between Docker and a Virtual Machine? When would you prefer each?" },
      { type: "Technical", text: "What is Kubernetes? Explain pods, deployments, and services in plain terms." },
      { type: "Technical", text: "What is the difference between AWS, Azure, and GCP? Which have you used and for what?" },
      { type: "Technical", text: "What is load balancing? Compare round-robin, least connections, and IP hash strategies." },
      { type: "Technical", text: "What is Infrastructure as Code? Compare Terraform and CloudFormation." },
      { type: "Technical", text: "What is a reverse proxy? How does Nginx differ from a load balancer?" },
      { type: "Technical", text: "Explain blue-green deployment and canary releases. When would you use each?" },
      { type: "Technical", text: "What is observability? Explain the three pillars: metrics, logs, and traces." },
      { type: "Technical", text: "What is the difference between horizontal and vertical pod autoscaling in Kubernetes?" },
    ],
    advanced: [
      { type: "Technical", text: "How would you design a zero-downtime deployment strategy for a stateful application?" },
      { type: "Technical", text: "What is service mesh? When would you introduce Istio or Linkerd into your stack?" },
      { type: "Technical", text: "Explain how you would set up disaster recovery with an RTO of 15 minutes." },
      { type: "Technical", text: "What is GitOps? How does it differ from traditional CI/CD?" },
      { type: "Technical", text: "How do you manage secrets in Kubernetes? Compare Vault, AWS Secrets Manager, and native Secrets." },
    ],
    behavioural: [
      { type: "Behavioural", text: "Tell me about a major outage you handled. How did you communicate, fix, and prevent recurrence?" },
      { type: "Behavioural", text: "Describe a time you significantly improved deployment frequency or system reliability." },
      { type: "Behavioural", text: "Tell me about a time a rollback went wrong. What happened and what did you change?" },
    ],
    situational: [
      { type: "Situational", text: "A deployment breaks production at 2am and your team is offline. Walk me through your response." },
      { type: "Situational", text: "The team wants to migrate a legacy monolith to microservices. How do you plan and de-risk this?" },
      { type: "Situational", text: "Your Kubernetes cluster is at 90% CPU and a product launch is in 2 hours. What do you do?" },
    ],
  },
  qa: {
    core: [
      { type: "Technical", text: "What is the difference between manual testing and automation testing? When should you use each?" },
      { type: "Technical", text: "What is a test case? Write a test case for a login form from scratch." },
      { type: "Technical", text: "What is the bug lifecycle? Walk me through every status from discovery to closure." },
      { type: "Technical", text: "What is Selenium? How does it work and what are its limitations?" },
      { type: "Technical", text: "What is the difference between functional and non-functional testing? Give examples of each." },
      { type: "Technical", text: "What is regression testing? When and how often should it run?" },
      { type: "Technical", text: "Explain the testing pyramid. Why is it shaped that way?" },
      { type: "Technical", text: "What is boundary value analysis and equivalence partitioning?" },
      { type: "Technical", text: "What is the difference between black-box and white-box testing?" },
      { type: "Technical", text: "What is Playwright and how does it compare to Selenium and Cypress?" },
    ],
    advanced: [
      { type: "Technical", text: "How do you handle flaky tests in an automated test suite?" },
      { type: "Technical", text: "What is performance testing? Compare load testing, stress testing, and soak testing." },
      { type: "Technical", text: "How would you design a CI-integrated test strategy for a monorepo with 5 services?" },
      { type: "Technical", text: "What is contract testing? How does Pact work and when is it useful?" },
    ],
    behavioural: [
      { type: "Behavioural", text: "Tell me about a critical bug you caught before it reached production. How did you find it?" },
      { type: "Behavioural", text: "Describe a time you pushed back on a release because quality was not sufficient." },
      { type: "Behavioural", text: "Tell me about a time you had to improve test coverage on a legacy codebase with no existing tests." },
    ],
    situational: [
      { type: "Situational", text: "A developer says a bug you raised is by design and refuses to fix it. You disagree. What do you do?" },
      { type: "Situational", text: "Sprint ends tomorrow and 4 stories are untested. How do you decide what to prioritise?" },
      { type: "Situational", text: "You are asked to automate a test suite for a product you have never used. Where do you start?" },
    ],
  },
  sec: {
    core: [
      { type: "Technical", text: "What is SQL injection? Give an example and explain how to prevent it." },
      { type: "Technical", text: "What is XSS (Cross-Site Scripting)? What are the three types and how do you prevent each?" },
      { type: "Technical", text: "What is the difference between encryption and hashing? Give real examples of when to use each." },
      { type: "Technical", text: "What is a firewall? Explain the difference between stateful and stateless inspection." },
      { type: "Technical", text: "Explain the OWASP Top 10. Pick three and describe how you would defend against them." },
      { type: "Technical", text: "What is the difference between symmetric and asymmetric encryption?" },
      { type: "Technical", text: "What is a man-in-the-middle attack? How does HTTPS protect against it?" },
      { type: "Technical", text: "What is CSRF? How does a CSRF token prevent it?" },
      { type: "Technical", text: "What is the principle of least privilege? Give a concrete example of applying it." },
      { type: "Technical", text: "What is OAuth 2.0? How does the authorisation code flow work?" },
    ],
    advanced: [
      { type: "Technical", text: "What is threat modelling? Walk me through how you would threat model a payment API." },
      { type: "Technical", text: "What is zero-trust architecture? How does it differ from traditional perimeter security?" },
      { type: "Technical", text: "How would you approach a penetration test on a REST API? What do you check first?" },
      { type: "Technical", text: "What is a CVE? How do you triage and prioritise vulnerability remediation?" },
    ],
    behavioural: [
      { type: "Behavioural", text: "Tell me about a time you discovered a vulnerability. How did you handle responsible disclosure?" },
      { type: "Behavioural", text: "Describe a time you had to convince engineering to fix a security issue that was deprioritised." },
      { type: "Behavioural", text: "Tell me about a security incident you were involved in. How did you respond?" },
    ],
    situational: [
      { type: "Situational", text: "You suspect an insider threat is exfiltrating sensitive data. What are your first five steps?" },
      { type: "Situational", text: "A critical CVE is published for a library in production. The patch breaks your app. What do you do?" },
      { type: "Situational", text: "A developer committed an AWS secret key to a public GitHub repo. What do you do in the next 10 minutes?" },
    ],
  },
  design: {
    core: [
      { type: "Technical", text: "What is the difference between UI design and UX design? How do they work together?" },
      { type: "Technical", text: "What is a wireframe? How does it differ from a mockup and a prototype?" },
      { type: "Technical", text: "What is Figma? Walk me through how you use it in a real project workflow." },
      { type: "Technical", text: "What is a user journey map? How do you create one and what decisions does it inform?" },
      { type: "Technical", text: "What is design thinking? Walk me through its five stages with a real example." },
      { type: "Technical", text: "What is a design system? What are its key components and why does it matter at scale?" },
      { type: "Technical", text: "How do you design for accessibility? Name 5 specific WCAG principles you apply." },
      { type: "Technical", text: "What is usability testing? How do you plan and run a session with 5 users?" },
      { type: "Technical", text: "What is information architecture? How do you create a site map?" },
      { type: "Technical", text: "What is the difference between qualitative and quantitative UX research?" },
    ],
    advanced: [
      { type: "Technical", text: "How do you measure the success of a design after it ships? What metrics do you use?" },
      { type: "Technical", text: "What is a design critique? How do you give and receive feedback effectively?" },
      { type: "Technical", text: "How do you balance business requirements, technical constraints, and user needs when they conflict?" },
      { type: "Technical", text: "What is motion design in UI? What are the principles of good micro-interactions?" },
    ],
    behavioural: [
      { type: "Behavioural", text: "Walk me through your design process from brief to final delivery on a real project." },
      { type: "Behavioural", text: "Tell me about a design you were proud of that got rejected by stakeholders. How did you handle it?" },
      { type: "Behavioural", text: "Describe the most complex UX problem you have solved. What was your process?" },
    ],
    situational: [
      { type: "Situational", text: "A developer says your design is too complex to build in the sprint. How do you respond?" },
      { type: "Situational", text: "User research contradicts the direction your product manager wants to go. What do you do?" },
      { type: "Situational", text: "You are given 48 hours to design an MVP for a new feature. Walk me through how you spend that time." },
    ],
  },
  mgmt: {
    core: [
      { type: "Technical", text: "What is Agile methodology? How does it differ from Waterfall?" },
      { type: "Technical", text: "What is Scrum? Explain sprints, ceremonies, and the role of a Scrum Master." },
      { type: "Technical", text: "What is the SDLC? Walk me through each phase with a real example." },
      { type: "Technical", text: "How do you handle project deadlines when the team is behind? What are your first steps?" },
      { type: "Technical", text: "What is stakeholder management? How do you handle a stakeholder who keeps changing requirements?" },
      { type: "Technical", text: "What is a product roadmap? How do you prioritise features when everything is urgent?" },
      { type: "Technical", text: "What is a risk register? How do you identify and mitigate risks at the start of a project?" },
      { type: "Technical", text: "What is the difference between a project manager and a product manager?" },
      { type: "Technical", text: "What is OKR? How do you set and track objectives at team level?" },
      { type: "Technical", text: "What is the MoSCoW prioritisation method? Give an example of applying it." },
    ],
    advanced: [
      { type: "Technical", text: "How do you manage a team that is consistently missing sprint goals?" },
      { type: "Technical", text: "What is the difference between output and outcome in product thinking? Why does it matter?" },
      { type: "Technical", text: "How do you run a retrospective that actually leads to change rather than just talk?" },
      { type: "Technical", text: "What frameworks do you use for product discovery? How do you validate ideas before building?" },
    ],
    behavioural: [
      { type: "Behavioural", text: "Tell me about a project that was significantly behind schedule. How did you recover it?" },
      { type: "Behavioural", text: "Describe a time you had to manage conflict between two team members or departments." },
      { type: "Behavioural", text: "Tell me about a time you had to deliver bad news to a client or senior stakeholder." },
    ],
    situational: [
      { type: "Situational", text: "A key stakeholder wants to add major scope 3 weeks before launch. How do you handle it?" },
      { type: "Situational", text: "You have inherited a project midway through with poor documentation and a demotivated team." },
      { type: "Situational", text: "Two senior engineers have a heated technical disagreement that is blocking progress. What do you do?" },
    ],
  },
};

// Question 1 is ALWAYS "Tell me about yourself"
export function pickSessionQuestions(cat, level) {
  const bank = QUESTION_BANK[cat] ?? QUESTION_BANK["dev"];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const pools = {
    core: shuffle(bank.core ?? []),
    adv:  shuffle(bank.advanced ?? bank.frontend ?? bank.backend ?? []),
    beh:  shuffle(bank.behavioural ?? []),
    sit:  shuffle(bank.situational ?? []),
    hr:   shuffle(HR_QUESTIONS),
  };

  const selected = [];
  const used = new Set();

  const intro = { type: "HR", text: "Tell me about yourself and your journey into this field." };
  selected.push(intro);
  used.add(intro.text);

  function pick(pool, n) {
    let added = 0;
    for (const q of pool) {
      if (added >= n) break;
      if (!used.has(q.text)) { selected.push(q); used.add(q.text); added++; }
    }
  }

  if (level === "senior")      { pick(pools.core,2); pick(pools.adv,2); pick(pools.beh,2); pick(pools.sit,1); }
  else if (level === "junior") { pick(pools.core,3); pick(pools.adv,1); pick(pools.beh,2); pick(pools.sit,1); }
  else                         { pick(pools.core,2); pick(pools.adv,1); pick(pools.beh,2); pick(pools.sit,1); }

  const remaining = shuffle([...pools.core,...pools.adv,...pools.beh,...pools.sit]);
  while (selected.length < 7) {
    const q = remaining.find(q => !used.has(q.text));
    if (!q) break;
    selected.push(q); used.add(q.text);
  }

  const secondHR = pools.hr.find(q => !used.has(q.text));
  if (secondHR) { selected.push(secondHR); used.add(secondHR.text); }

  return selected.slice(0, 8);
}
