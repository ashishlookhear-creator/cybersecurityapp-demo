'use strict';
const seed = [
  {id:'INC-001',title:'Suspicious sign-in pattern',asset:'Identity gateway',severity:'Critical',status:'Open'},
  {id:'INC-002',title:'Endpoint malware alert',asset:'Workstation-04',severity:'Critical',status:'Investigating'},
  {id:'INC-003',title:'Unpatched web service',asset:'Web server',severity:'High',status:'Open'},
  {id:'INC-004',title:'Unusual outbound traffic',asset:'API gateway',severity:'Medium',status:'Resolved'}
];
let incidents = structuredClone(seed);
const assets = [['Identity gateway','Identity','Review needed'],['Workstation-04','Endpoint','Review needed'],['Web server','Server','Patch pending'],['API gateway','Network','Healthy'],['Database-01','Database','Healthy'],['Workstation-02','Endpoint','Healthy']];
const $ = id => document.getElementById(id);
function el(tag,text,className) { const node=document.createElement(tag); if(text!==undefined)node.textContent=text;if(className)node.className=className;return node; }
function badge(text) {return el('span',text,'badge '+text.toLowerCase().replaceAll(' ','-'));}
function summary(item) {const row=el('div',undefined,'summary'); const info=el('div');info.append(el('strong',item.title),el('p',item.id+' · '+item.asset,'muted'));row.append(info,badge(item.severity));return row;}
function render() {
  $('open-count').textContent=incidents.filter(i=>i.status!=='Resolved').length;
  $('critical-count').textContent=incidents.filter(i=>i.severity==='Critical'&&i.status!=='Resolved').length;
  $('priority').replaceChildren(...incidents.filter(i=>i.status!=='Resolved').map(summary));
  if(!$('priority').children.length)$('priority').append(el('p','All demo incidents resolved.'));
  const query=$('search').value.toLowerCase();
  const filtered=incidents.filter(i=>(i.title+' '+i.asset+' '+i.id).toLowerCase().includes(query)&&($('severity').value==='all'||i.severity===$('severity').value));
  $('incident-rows').replaceChildren(...filtered.map(item=>{
    const row=el('tr');const title=el('td');title.append(el('strong',item.title),el('p',item.id,'muted'));row.append(title,el('td',item.asset));const severity=el('td');severity.append(badge(item.severity));row.append(severity,el('td',item.status));const action=el('td');const button=el('button',item.status==='Open'?'Investigate':item.status==='Investigating'?'Resolve':'Resolved');button.disabled=item.status==='Resolved';button.setAttribute('aria-label',button.textContent+' '+item.id);button.addEventListener('click',()=>{item.status=item.status==='Open'?'Investigating':'Resolved';render();$('feedback').textContent=item.id+' marked '+item.status.toLowerCase()+' in demo session.';});action.append(button);row.append(action);return row;
  }));
  if(!filtered.length){const row=el('tr');const cell=el('td','No incidents match your filters.');cell.colSpan=5;row.append(cell);$('incident-rows').append(row);}
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  const view=button.dataset.view; document.querySelectorAll('.view').forEach(s=>s.hidden=s.id!==view);
  document.querySelectorAll('nav button').forEach(b=>{if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  $('title').textContent={overview:'Security overview',threats:'Threat monitoring',incidents:'Incident management',assets:'Asset inventory'}[view];
}));
const values=[12,19,9,26,16,8,14];
['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach((day,index)=>{const column=el('div',undefined,'bar-column');column.append(el('span',String(values[index])));const track=el('div',undefined,'bar-track');for(let n=26;n>0;n--)track.append(el('i',undefined,n<=values[index]?'filled':''));column.append(track,el('small',day));$('bars').append(column);});
[['Identity controls',88],['Endpoint protection',76],['Network security',91],['Patch compliance',73]].forEach(([label,value])=>{const line=el('div',undefined,'control');line.append(el('p',label+' · '+value+'%'));const meter=el('progress');meter.max=100;meter.value=value;meter.setAttribute('aria-label',label);line.append(meter);$('posture').append(line);});
$('threat-list').replaceChildren(...seed.map(summary));
$('asset-list').replaceChildren(...assets.map(([name,type,status])=>{const card=el('article',undefined,'asset');card.append(el('p',type,'eyebrow'),el('h3',name),badge(status));return card;}));
$('search').addEventListener('input',render);$('severity').addEventListener('change',render);
$('reset').addEventListener('click',()=>{incidents=structuredClone(seed);$('search').value='';$('severity').value='all';render();$('feedback').textContent='Demo incidents reset.';});
$('export').addEventListener('click',()=>{const data={mode:'SIMULATED DEMO DATA',exportedAt:new Date().toISOString(),incidents,assets};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=el('a');link.href=url;link.download='cybersecurityapp-demo-report.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
render();
