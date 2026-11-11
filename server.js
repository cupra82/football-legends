'use strict';
const http=require('http'),WebSocket=require('ws'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {generateQuestions}=require('./football-bank');
const original=JSON.parse(fs.readFileSync(path.join(__dirname,'questions.json'),'utf8'));
const snapshotPath=path.join(__dirname,'questions-generated.json');
let generated=[];let snapshotStats={};
try{const file=JSON.parse(fs.readFileSync(snapshotPath,'utf8'));if(Array.isArray(file.questions)){generated=file.questions;snapshotStats=file.stats||{}}}catch{}
let questions=[...original,...generated];let bankStatus={state:generated.length?'ready':'loading',count:questions.length,original:original.length,generated:generated.length,goal:50000,stats:snapshotStats,updatedAt:snapshotStats.at||null};
let sampleSerial=0;
function recalc(){const byCategory={},byKind={};for(const q of questions){byCategory[q.category]=(byCategory[q.category]||0)+1;byKind[q.kind||'Storico']=(byKind[q.kind||'Storico']||0)+1}bankStatus.count=questions.length;bankStatus.generated=questions.length-original.length;bankStatus.byCategory=byCategory;bankStatus.byKind=byKind}
recalc();
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=crypto.randomInt(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function samplePool(max=2500){if(questions.length<=max)return questions;const groups=new Map();for(const q of questions){if(!groups.has(q.category))groups.set(q.category,[]);groups.get(q.category).push(q)}
 const categories=shuffle([...groups.keys()]);const base=Math.max(15,Math.floor(max/categories.length));const chosen=[];const ids=new Set();
 for(const c of categories)for(const q of shuffle(groups.get(c)).slice(0,base)){if(!ids.has(q.id||q.question)){chosen.push(q);ids.add(q.id||q.question)}}
 if(chosen.length<max){const rest=shuffle(questions);for(const q of rest){if(chosen.length>=max)break;if(!ids.has(q.id||q.question)){chosen.push(q);ids.add(q.id||q.question)}}}
 return shuffle(chosen)}
let refreshing=false;
async function refresh(){if(refreshing)return;refreshing=true;bankStatus.state=questions.length>1000?'ready':'loading';try{let result=await generateQuestions(()=>{});if(result.questions.length<1000)throw Error(`Solo ${result.questions.length} domande generate; archivio precedente conservato`);
 generated=result.questions;questions=[...original,...generated];bankStatus={...bankStatus,state:'ready',stats:result.stats,updatedAt:new Date().toISOString(),error:null};recalc();console.log(`Football Legends: ${questions.length} domande, ${result.stats.sourcesSuccessful} fonti dati caricate`);
 // Salvataggio locale opportunistico: su Render Free non è persistente ai redeploy.
 try{fs.writeFileSync(snapshotPath,JSON.stringify({stats:result.stats,questions:generated}))}catch{}
 }catch(e){bankStatus.state=questions.length>1000?'ready':'fallback';bankStatus.error=e.message;console.error('Database: '+e.message)}finally{refreshing=false}}
const PORT=process.env.PORT||3000,rooms=new Map(),clients=new Map();
const httpServer=http.createServer((req,res)=>{
 const pathname=(req.url||'/').split('?')[0];
 if(pathname==='/api/questions'){
  const u=new URL(req.url,'http://localhost');let limit=Math.min(3500,Math.max(100,Number(u.searchParams.get('limit'))||2500));
  const selected=samplePool(limit);res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  return res.end(JSON.stringify({questions:selected,status:bankStatus,served: selected.length}));
 }
 if(pathname==='/api/status'){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});return res.end(JSON.stringify(bankStatus))}
 if(pathname!=='/'&&pathname!=='/index.html'){res.writeHead(404);return res.end('Not found')}
 const data=fs.readFileSync(path.join(__dirname,'index.html'));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(data)
});
const wss=new WebSocket.Server({server:httpServer,maxPayload:2048});
const send=(ws,data)=>{if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(data))};const broadcast=(r,data)=>r.players.forEach(p=>send(p.ws,data));
function code(){let c;do{c=crypto.randomBytes(4).toString('hex').slice(0,6).toUpperCase()}while(rooms.has(c));return c}
function clean(n){return String(n||'Campione').replace(/[<>\x00-\x1f]/g,'').trim().slice(0,20)||'Campione'}
function summary(r){return [...r.players].sort((a,b)=>b.score-a.score).map(p=>({name:p.name,score:p.score}))}
function lobby(r){r.players.forEach(p=>send(p.ws,{type:'lobby',code:r.code,hostForYou:r.host===p,players:r.players.map(q=>({name:q.name,host:q===r.host})),category:r.category}))}
function clearRoom(r){clearTimeout(r.timer);rooms.delete(r.code);r.players.forEach(p=>clients.delete(p.ws))}
function finish(r){if(!rooms.has(r.code))return;broadcast(r,{type:'end',scores:summary(r)});clearRoom(r)}
function reveal(r){if(!rooms.has(r.code)||r.state!=='question')return;r.state='reveal';clearTimeout(r.timer);const q=r.current;broadcast(r,{type:'reveal',correct:r.order.indexOf(q.answer),answerText:q.options[q.answer],explanation:q.explanation,scores:summary(r)});r.timer=setTimeout(()=>next(r),3400)}
function next(r){if(!rooms.has(r.code))return;if(r.index>=r.deck.length){finish(r);return}r.state='question';r.current=r.deck[r.index++];r.order=shuffle([0,1,2]);r.started=Date.now();r.answered=new Set();broadcast(r,{type:'question',number:r.index,total:r.deck.length,category:r.current.category,difficulty:r.current.difficulty,question:r.current.question,options:r.order.map(i=>r.current.options[i]),scores:summary(r),seconds:15});r.timer=setTimeout(()=>reveal(r),15500)}
function detach(ws){let p=clients.get(ws);if(!p)return;let r=rooms.get(p.room);clients.delete(ws);if(!r)return;r.players=r.players.filter(q=>q!==p);if(!r.players.length){clearRoom(r);return}if(r.host===p)r.host=r.players[0];if(r.state==='lobby')lobby(r);else if(r.state==='question'&&r.answered.size>=r.players.length)reveal(r)}
wss.on('connection',ws=>{ws.isAlive=true;ws.on('pong',()=>ws.isAlive=true);ws.on('message',raw=>{let x;try{x=JSON.parse(raw)}catch{return}if(!x||typeof x.type!=='string')return;let p=clients.get(ws);
 if(x.type==='create'){if(p)return;let r={code:code(),players:[],state:'lobby',host:null,timer:null,category:'Tutte'};p={ws,room:r.code,name:clean(x.name),score:0};r.host=p;r.players.push(p);rooms.set(r.code,r);clients.set(ws,p);lobby(r);return}
 if(x.type==='join'){if(p)return;let r=rooms.get(String(x.code||'').toUpperCase());if(!r||r.state!=='lobby')return send(ws,{type:'error',message:'Stanza inesistente o partita già iniziata.'});if(r.players.length>=8)return send(ws,{type:'error',message:'Stanza piena (8 giocatori).'});p={ws,room:r.code,name:clean(x.name),score:0};r.players.push(p);clients.set(ws,p);lobby(r);return}
 if(!p)return;let r=rooms.get(p.room);if(!r)return;
 if(x.type==='start'){if(r.host!==p||r.players.length<2||r.state!=='lobby')return send(ws,{type:'error',message:'Servono almeno 2 giocatori; avvia solo l’host.'});const requested=String(x.category||'Tutte');const allowed=new Set(questions.map(q=>q.category));const selected=requested==='Tutte'||allowed.has(requested)?requested:'Tutte';const pool=questions.filter(q=>selected==='Tutte'||q.category===selected);if(pool.length<10)return send(ws,{type:'error',message:'La categoria non contiene abbastanza domande.'});r.deck=shuffle(pool).slice(0,10);r.category=selected;r.index=0;r.players.forEach(u=>u.score=0);next(r);return}
 if(x.type==='answer'&&r.state==='question'){if(r.answered.has(p))return;const val=x.index;if(!Number.isInteger(val)||val<0||val>2)return;r.answered.add(p);if(r.order[val]===r.current.answer){const seconds=Math.max(0,15-(Date.now()-r.started)/1000);p.score+=100+Math.ceil(seconds)*10}send(ws,{type:'answered'});if(r.answered.size===r.players.length)reveal(r)}
 });ws.on('close',()=>detach(ws));ws.on('error',()=>detach(ws))});
setInterval(()=>{for(const ws of wss.clients){if(ws.isAlive===false){ws.terminate();continue}ws.isAlive=false;ws.ping()}},30000).unref();
httpServer.listen(PORT,()=>{console.log(`Football Legends v0.4 online http://localhost:${PORT} (${questions.length} domande iniziali)`);if(!generated.length||process.env.FORCE_REFRESH==='true')refresh()});
