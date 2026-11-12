'use strict';
const fs=require('fs'),path=require('path');
const {CLUBS,queryFor,rowsFrom,makeQuestions}=require('./wikidata-bank');
const file=path.join(__dirname,'..','wikidata-generated.json');
const userAgent='FootballLegendsBot/3.1 (https://github.com/cupra82/football-legends; educational trivia)';
async function query(club){const url=new URL('https://query.wikidata.org/sparql');url.searchParams.set('query',queryFor(club));url.searchParams.set('format','json');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
 try{const res=await fetch(url,{headers:{'User-Agent':userAgent,Accept:'application/sparql-results+json'},signal:controller.signal});
  if(!res.ok)throw Error(`Wikidata HTTP ${res.status}`);
  return rowsFrom(await res.json());
 }finally{clearTimeout(timer)}
}
(async()=>{
 let result=[],failures=[];
 for(const club of CLUBS){try{const bindings=await query(club);result.push({club,bindings});console.log(`${club.name}: ${bindings.length} record Wikidata`)}
 catch(e){failures.push({club:club.name,error:e.message});console.warn(`${club.name}: ${e.message}`)}
 // Deliberately don't replace a good previous snapshot with partial/outage results.
 }
 const questions=makeQuestions(result);
 const previous=(()=>{try{return JSON.parse(fs.readFileSync(file,'utf8'))}catch{return null}})();
 const minimum=Math.max(10,Number(process.env.MIN_WIKIDATA_QUESTIONS||20));
 if(failures.length||questions.length<minimum||(previous?.questions?.length&&questions.length<previous.questions.length*.65)){
  console.warn(`Wikidata: ${questions.length} prodotte, ${failures.length} fonti fallite. Snapshot precedente conservato.`);
  if(!previous?.questions?.length)console.warn('Nessuno snapshot presente: il gioco resta funzionante senza Wikidata.');
  return;
 }
 const payload={stats:{at:new Date().toISOString(),source:'Wikidata SPARQL CC0',clubs:result.length,failed:failures.length,count:questions.length},questions};
 fs.writeFileSync(file,JSON.stringify(payload,null,2)+'\n');console.log(`Wikidata: archivio salvato con ${questions.length} domande`);
})().catch(e=>{console.error(e);process.exitCode=1});
