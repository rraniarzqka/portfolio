
const sfFormat=new Intl.NumberFormat('en-US');
let sfData;
function sfRender(metric){
 document.querySelectorAll('[data-metric]').forEach(b=>{b.classList.toggle('selected',b.dataset.metric===metric);b.setAttribute('aria-pressed',String(b.dataset.metric===metric));});
 const data=sfData.daily,labels=sfData.monthly.map(x=>x.month),raw=data.map(x=>x[metric]);
 const values=raw.map((v,i)=>{const slice=raw.slice(Math.max(0,i-6),i+1);return slice.reduce((a,b)=>a+b,0)/slice.length;});
 const step=metric==='impressions'?500:50,max=Math.ceil(Math.max(...values)/step)*step,left=62,right=900,top=44,bottom=230;
 const pts=values.map((v,i)=>[left+i*(right-left)/(data.length-1),bottom-v/max*(bottom-top)]),line=pts.map(p=>p.join(',')).join(' '),area=`${left},${bottom} ${line} ${right},${bottom}`;
 const updateIndex=data.findIndex(x=>x.date===sfData.update_date),updateX=pts[updateIndex][0];
 const ticks=[['2025-09-01','Sep 25'],['2025-11-01','Nov'],['2026-01-01','Jan 26'],['2026-03-01','Mar'],['2026-05-01','May'],['2026-07-01','Jul'],['2026-09-01','Sep 26']];
 document.querySelector('#sf-chart-output').innerHTML=`<svg viewBox="0 0 935 280" role="img" aria-label="Daily ${metric}, 7-day rolling average, September 2025 to September 2026. Page updated 15 April 2026"><title>Daily ${metric} · 7-Day Rolling Average</title><desc>Page updated on 15 April 2026. Monthly totals: ${sfData.monthly.map(x=>x.month+': '+sfFormat.format(x[metric])).join(' · ')}</desc>${[0,.25,.5,.75,1].map(n=>`<line x1="${left}" x2="${right}" y1="${bottom-n*(bottom-top)}" y2="${bottom-n*(bottom-top)}" stroke="#e2e6d8"/><text x="48" y="${bottom-n*(bottom-top)+4}" text-anchor="end" font-size="11" fill="#7c856d">${sfFormat.format(max*n)}</text>`).join('')}<polygon points="${area}" fill="#e6edd8"/><polyline points="${line}" fill="none" stroke="#81975e" stroke-width="2.5" stroke-linejoin="round"/><line x1="${updateX}" x2="${updateX}" y1="${top}" y2="${bottom}" stroke="#bd895c" stroke-width="1.7" stroke-dasharray="5 5"/><rect x="${updateX-70}" y="12" width="140" height="23" rx="11" fill="#f1e5d4"/><text x="${updateX}" y="27" text-anchor="middle" font-size="11" fill="#8d6848">Updated 15 Apr 2026</text>${ticks.map(([date,label])=>{const i=data.findIndex(x=>x.date===date);return `<text x="${pts[i][0]}" y="256" text-anchor="middle" font-size="11" fill="#7c856d">${label}</text>`;}).join('')}</svg><p class="sf-chart-legend">Descriptions & Event Schema Updated · 15 April 2026</p>`;
}
fetch('safari-education-data.json?v=2').then(r=>{if(!r.ok)throw new Error('Search data unavailable');return r.json();}).then(data=>{sfData=data;sfRender('impressions');}).catch(()=>{document.querySelector('#sf-chart-output').textContent='The chart could not load. Refresh to try again.';});
document.querySelectorAll('[data-metric]').forEach(b=>b.addEventListener('click',()=>{if(sfData)sfRender(b.dataset.metric);}));
const sfZoom=document.querySelector('#sf-zoom');
const sfAfterImage=document.querySelector('.sf-after img');
function sfFrameAfter(){sfAfterImage.parentElement.scrollTop=sfAfterImage.clientHeight*.245;}
if(sfAfterImage.complete)sfFrameAfter();else sfAfterImage.addEventListener('load',sfFrameAfter,{once:true});
document.querySelectorAll('[data-enlarge]').forEach(b=>b.addEventListener('click',()=>{const original=b.closest('article').querySelector('img');const image=sfZoom.querySelector('img');const isAfter=b.dataset.enlarge!=='before';sfZoom.classList.toggle('sf-fullpage',isAfter);image.src=original.src;image.alt=original.alt;document.querySelector('#sf-zoom-title').textContent=isAfter?'After / Updated Education Page':'Before / Original Schedule Visual';sfZoom.showModal();const frame=()=>{sfZoom.scrollTop=isAfter?image.clientHeight*.245:0;};if(image.complete)frame();else image.addEventListener('load',frame,{once:true});}));
sfZoom.querySelector('button').addEventListener('click',()=>sfZoom.close());
