'use strict';
const assert=require('assert');const fs=require('fs'),path=require('path');
const {CLUBS,queryFor,rowsFrom,makeQuestions}=require('./wikidata-bank');
assert(CLUBS.length>=3);assert(queryFor(CLUBS[0]).includes('LIMIT 120'));
const make=(id,name,year,city)=>({person:{value:`http://www.wikidata.org/entity/${id}`},personLabel:{value:name},birth:{value:`${year}-01-01T00:00:00Z`},cityLabel:{value:city}});
const mock=[{club:CLUBS[0],bindings:[make('Q1','Calciatore Uno',1980,'Torino'),make('Q2','Calciatore Due',1985,'Roma'),make('Q3','Calciatore Tre',1990,'Milano'),make('Q4','Calciatore Quattro',1995,'Napoli')]}];
assert.equal(rowsFrom({results:{bindings:mock[0].bindings}}).length,4);
const qs=makeQuestions(mock);assert(qs.length>=4);
for(const q of qs){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert(q.answer>=0&&q.answer<=2);assert(q.source.startsWith('https://www.wikidata.org/wiki/Q'))}
const off=require(path.join(__dirname,'..','official-questions.json'));assert.equal(off.length,67);assert(off.every(q=>q.options.length===3&&q.source.startsWith('https://')));
console.log(`Nuove fonti: ${qs.length} quiz Wikidata simulati, ${off.length} quiz storici UEFA/FIFA verificati.`);
