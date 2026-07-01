export const creativeStyle = `
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#1f2937;max-width:100%;margin:0 auto;background:#fff;line-height:1.6;font-size:12px}
.hero{background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:36px 40px 28px;position:relative;overflow:hidden;color:#fff}
.hero-circle{position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}
.hero-circle:nth-child(1){width:180px;height:180px;top:-40px;left:-40px}
.hero-circle:nth-child(2){width:100px;height:100px;bottom:-20px;right:60px}
.hero-circle:nth-child(3){width:60px;height:60px;top:20px;right:20px}
.hero-content{position:relative;z-index:1;display:flex;align-items:center;gap:20px}
.avatar{width:90px;height:90px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,.4)}
.avatar-placeholder{width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:700;border:4px solid rgba(255,255,255,.4)}
.hero-text h1{margin:0;font-size:24px;font-weight:700}
.hero-text .label{font-size:13px;opacity:.85;margin-top:2px}
.grid{display:grid;grid-template-columns:38% 1fr;padding:0 36px 30px;gap:24px}
.sidebar-section{background:#f8fafc;border-radius:10px;padding:16px;margin-top:10px}
.sidebar-section:first-child{margin-top:0}
h2{font-size:14px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:.05em;margin-top:14px;margin-bottom:8px;padding-bottom:3px;border-bottom:2px solid #e5e7eb}
.main h2{margin-top:10px}
.contact-item{font-size:11px;color:#374151;margin:4px 0}
.contact-item span{color:#6b7280}
.skill-bar{margin:5px 0}
.skill-bar-label{font-size:11px;color:#374151;margin-bottom:2px;display:flex;justify-content:space-between}
.skill-bar-track{height:5px;background:#e5e7eb;border-radius:3px;overflow:hidden}
.skill-bar-fill{height:100%;background:#6366f1;border-radius:3px}
.edu-item{margin-bottom:6px}
.edu-school{font-weight:600;font-size:12px;color:#1f2937}
.edu-degree{font-size:11px;color:#374151}
.edu-date{font-size:10px;color:#6b7280}
.job{margin-bottom:12px}
.job-header{display:flex;justify-content:space-between;font-weight:600;font-size:12px}
.job-company{color:#1f2937}
.job-date{color:#6b7280;font-weight:400;font-size:10px}
.job-position{font-size:11px;color:#374151;margin:2px 0}
.job-desc{font-size:11px;color:#6b7280;margin-top:2px;line-height:1.5}
p{font-size:11px;color:#6b7280;line-height:1.6;margin:3px 0}
`;
