export const baseStyle = `
*{box-sizing:border-box}
body{margin:0;padding:40px;font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.6;overflow-wrap:anywhere}
h1{margin:0;font-size:28px}
h2{margin-top:28px;margin-bottom:10px;border-bottom:1px solid #ddd;padding-bottom:4px;font-size:18px}
p{margin:4px 0}
ul{padding-left:20px}
li{margin-bottom:6px}
img{max-width:100%}
table{width:100%;border-collapse:collapse}
a{color:inherit;overflow-wrap:anywhere}
.grid,.job-header,.item-header,.contact,.contact-row,.contact-line{min-width:0}
.left,.right,.main,.sidebar,aside{min-width:0}
.item,.job,.edu-item,.cert-item,.vol-item,.award-item{break-inside:avoid;page-break-inside:avoid}
.item-header{display:flex;justify-content:space-between;gap:4px 10px;flex-wrap:wrap}
.item-title{min-width:0;overflow-wrap:anywhere}
.date{margin-left:auto}
.skills,.badges{display:flex;flex-wrap:wrap}
.skill,.badge{max-width:100%;overflow-wrap:anywhere}
`;
