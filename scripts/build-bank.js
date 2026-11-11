'use strict';
const fs=require('fs'),path=require('path');
const {generateQuestions}=require('../football-bank');
(async()=>{
 console.log('Creo la banca dati da fonti OpenFootball CC0...');
 const start=Date.now();let n=0;
 const result=await generateQuestions(({processed,total})=>{if(++n%20===0)console.log(`Fonti analizzate: ${processed}/${total}`)});
 const file=path.join(__dirname,'..','questions-generated.json');
 const minimum=Number(process.env.MIN_QUESTIONS||50000);
 if(result.questions.length<minimum){console.error(`Solo ${result.questions.length}/${minimum} domande: non sovrascrivo il database esistente.`);process.exitCode=2;return}
 fs.writeFileSync(file,JSON.stringify(result));
 console.log(`Salvate ${result.questions.length} domande in ${file}; ${result.stats.sourcesSuccessful} fonti, ${(Date.now()-start)/1000}s.`)
})().catch(e=>{console.error(e);process.exitCode=1});
