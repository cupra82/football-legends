'use strict';
const fs=require('fs'),path=require('path');
const {COUNTRIES,discoverCountriesQuery,discoveredCountries,discoverQuery,discoveredClubs,queryFor,rowsFrom,makeQuestions}=require('./wikidata-bank');
const root=path.join(__dirname,'..');
const file=path.join(root,'wikidata-generated.json');
const catalogPath=path.join(root,'wikidata-clubs.json');
const cachePath=path.join(root,'wikidata-club-cache.json');
const agent='FootballLegendsBot/3.3 (https://github.com/cupra82/football-legends; trivia database)';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const read=(p,fallback)=>{try{return JSON.parse(fs.readFileSync(p,'utf8'))}catch{return fallback}};
const write=(p,obj)=>fs.writeFileSync(p,JSON.stringify(obj,null,2)+'\n');
async function fetchSparql(query){
 const u=new URL('https://query.wikidata.org/sparql');u.searchParams.set('query',query);u.searchParams.set('format','json');
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),55000);
 try{
  const res=await fetch(u,{headers:{'User-Agent':agent,'Accept':'application/sparql-results+json'},signal:controller.signal});
  if(!res.ok)throw Error('HTTP '+res.status);
  return rowsFrom(await res.json());
 }finally{clearTimeout(timeout)}
}
(async()=>{
 const catalog=read(catalogPath,{countriesDone:[],countriesFailed:[],clubs:[]});
 const cache=read(cachePath,{clubs:{}});
 const known=new Map(catalog.clubs.map(c=>[c.id,c]));
 if(!catalog.countriesCatalog?.length){
  try{
   const bindings=await fetchSparql(discoverCountriesQuery());
   catalog.countriesCatalog=discoveredCountries(bindings);
   console.log(`Paesi scoperti: ${catalog.countriesCatalog.length}`);
  }catch(e){
   console.warn(`Elenco mondiale paesi non disponibile (${e.message}), uso elenco iniziale`);
   catalog.countriesCatalog=COUNTRIES.map(([id,name])=>({id,name}));
  }
 }

 const done=new Set(catalog.countriesDone);
 const perRun=Math.max(1,Math.min(3,Number(process.env.FL_COUNTRIES_PER_RUN||2)));
 let attempted=0;
 for(const {id,name} of catalog.countriesCatalog){
  if(done.has(id)||attempted>=perRun)continue;
  attempted++;
  try{
   const bindings=await fetchSparql(discoverQuery({id,name}));
   if(!bindings.length)throw Error('Risposta vuota');
   const clubs=discoveredClubs(bindings,{id,name});
   if(!clubs.length)throw Error('Nessun club verificato');
   for(const club of clubs)known.set(club.id,club);
   done.add(id);console.log(`Scoperti ${clubs.length} club in ${name}`);
  }catch(e){console.warn(`Scoperta ${name}: ${e.message}`)}
  await pause(2200);
 }
 catalog.clubs=[...known.values()].sort((a,b)=>a.id.localeCompare(b.id));
 catalog.countriesDone=[...done];
 // Non marcarli finiti se una risposta fallisce; riprovarli alla prossima esecuzione.
 if(catalog.clubs.length)write(catalogPath,catalog);
 const maxClubs=Math.max(1,Math.min(30,Number(process.env.FL_CLUBS_PER_RUN||12)));
 const remaining=catalog.clubs.filter(c=>!cache.clubs[c.id]);
 let success=0,failures=0;
 for(const club of remaining.slice(0,maxClubs)){
  try{
   const bindings=await fetchSparql(queryFor(club));
   // Una squadra senza profili validi viene registrata senza bloccare le altre.
   cache.clubs[club.id]={club,bindings};success++;
   console.log(`${club.name}: ${bindings.length} profili`);
  }catch(e){failures++;console.warn(`${club.name}: ${e.message}`);if(/HTTP 429/.test(e.message))break}
  await pause(2200);
 }
 if(success)write(cachePath,cache);
 // Recupera l'intero insieme gia acquisito, senza scartarlo per fallimenti esterni.
 const collection=Object.values(cache.clubs).filter(x=>x.club&&Array.isArray(x.bindings));
 if(!collection.length){console.log('Nessun nuovo dato Wikidata: archivio precedente invariato');return}
 const questions=makeQuestions(collection);
 const previous=read(file,{questions:[]});
 // Non cancellare domande vecchie se il nuovo archivio e parziale.
 const byId=new Map(previous.questions.map(q=>[q.id,q]));
 for(const q of questions)byId.set(q.id,q);
 const merged=[...byId.values()];
 write(file,{stats:{at:new Date().toISOString(),source:'Wikidata SPARQL CC0',countriesDone:done.size,catalogClubs:catalog.clubs.length,clubsProcessed:collection.length,newlyProcessed:success,failures,count:merged.length},questions:merged});
 console.log(`Wikidata: ${catalog.clubs.length} club censiti, ${collection.length} processati, ${merged.length} domande`);
})().catch(e=>{console.error(e);process.exitCode=1});
