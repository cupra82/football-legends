'use strict';
const crypto=require('crypto');
const CLUBS=[
 {id:'Q1422',name:'Juventus',category:'Serie A'},
 {id:'Q8682',name:'Real Madrid',category:'La Liga'},
 {id:'Q7156',name:'Barcellona',category:'La Liga'}
];
function sha(s){return crypto.createHash('sha256').update(s).digest('hex').slice(0,16)}
function ordered(a,salt){return [...a].sort((a,b)=>sha(salt+'|'+a).localeCompare(sha(salt+'|'+b)))}
const norm=s=>String(s||'').normalize('NFKC').toLocaleLowerCase('it').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
function safeLabel(s){return typeof s==='string'&&s.length>=3&&s.length<=70&&!/^Q\d+$/.test(s)&&!/[<>\[\]{}]/.test(s)}
// Narrow queries: one club per request, 120 rows max, avoids broad all-football Wikidata scans.
function queryFor(club){return `SELECT DISTINCT ?person ?personLabel ?birth ?cityLabel WHERE {
 ?person wdt:P54 wd:${club.id}; wdt:P569 ?birth.
 OPTIONAL { ?person wdt:P19 ?city. }
 SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en". }
} LIMIT 120`}
function rowsFrom(data){if(!data||!data.results||!Array.isArray(data.results.bindings))throw Error('Formato SPARQL non valido');return data.results.bindings}
function makeQuestions(collection){
 let persons=new Map();
 for(const {club,bindings} of collection){
  for(const row of bindings){const id=String(row.person?.value||'').split('/').pop(); const name=row.personLabel?.value;
   const y=Number(String(row.birth?.value||'').slice(0,4));
   const city=row.cityLabel?.value;
   if(!/^Q\d+$/.test(id)||!safeLabel(name)||!Number.isInteger(y)||y<1880||y>2008)continue;
   let p=persons.get(id);if(!p){p={id,name,year:y,city:safeLabel(city)?city:null,clubs:new Set(),category:club.category};persons.set(id,p)}
   p.clubs.add(club.name);
  }
 }
 const all=[...persons.values()];const years=[...new Set(all.map(p=>p.year))];const cities=[...new Set(all.map(p=>p.city).filter(Boolean))];const questions=[];
 for(const p of all){
  const source=`https://www.wikidata.org/wiki/${p.id}`;
  const context=p.clubs.size===1?` (ex ${[...p.clubs][0]})`:'';
  const incorrect=ordered(years.filter(y=>y!==p.year&&Math.abs(y-p.year)>=2&&Math.abs(y-p.year)<=14),p.id+'year').slice(0,2);
  if(incorrect.length===2){const correct=String(p.year),options=ordered([correct,...incorrect.map(String)],p.id+'options');
   questions.push({id:'wd-'+sha(p.id+'year'),category:p.category,kind:'Biografie Wikidata',difficulty:2,
    question:`In quale anno è nato ${p.name}${context}?`,options,answer:options.indexOf(correct),
    explanation:`Secondo Wikidata, ${p.name} è nato nel ${p.year}.`,source});}
  if(p.city&&cities.filter(x=>norm(x)!==norm(p.city)).length>=2){const wrong=ordered(cities.filter(x=>norm(x)!==norm(p.city)),p.id+'city').slice(0,2);
   const options=ordered([p.city,...wrong],p.id+'cityopts');
   questions.push({id:'wd-'+sha(p.id+'city'),category:p.category,kind:'Città di nascita Wikidata',difficulty:3,
    question:`In quale città è nato ${p.name}${context}?`,options,answer:options.indexOf(p.city),
    explanation:`Wikidata indica ${p.city} come città di nascita di ${p.name}.`,source});}
 }
 return questions;
}
module.exports={CLUBS,queryFor,rowsFrom,makeQuestions};
