(()=>{
'use strict';
const $=s=>document.querySelector(s);
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

//#GEN-START
/* ============ Pembuat soal ============ */
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmtN=n=>String(n).replace('.',',').replace('-','−');
const rp=n=>'Rp'+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const red=(n,d)=>{const g=gcd(n,d)||1;return [n/g,d/g]};
const fs=(n,d)=>d===1?String(n):n+'/'+d;
const lin=(a,b)=>`${a===1?'':a===-1?'−':a}x ${b<0?'−':'+'} ${Math.abs(b)}`;

function numQ(sub,q,ans,cands,e,o={}){
  const f=o.f||fmtN, step=o.step||(Number.isInteger(ans)?1:0.5);
  const seen=new Set([ans]), out=[];
  const ok=v=>Number.isFinite(v)&&!seen.has(v)&&(ans<0||v>=0)&&(Number.isInteger(ans)?Number.isInteger(v):Number.isInteger(v*2));
  for(const v of shuffle(cands)){ if(ok(v)){seen.add(v);out.push(v)} if(out.length===3)break; }
  for(let k=1;out.length<3&&k<60;k++){ for(const v of [ans+k*step,ans-k*step]){ if(out.length<3&&ok(v)){seen.add(v);out.push(v)} } }
  const opts=shuffle([ans,...out]);
  return {sub,q,opts:opts.map(f),ans:opts.indexOf(ans),e};
}
function strQ(sub,q,ans,cands,e){
  const seen=new Set([ans]), out=[];
  for(const s of shuffle(cands)){ if(!seen.has(s)){seen.add(s);out.push(s)} if(out.length===3)break; }
  const opts=shuffle([ans,...out]);
  return {sub,q,opts,ans:opts.indexOf(ans),e};
}
function fracQ(sub,q,A,cands,e){
  const seen=[A], out=[];
  const okc=(n,d)=>n>0&&d>0&&!seen.some(([x,y])=>x*d===n*y);
  for(const c of shuffle(cands)){ if(okc(c[0],c[1])){seen.push(c);out.push(c)} if(out.length===3)break; }
  for(let k=1;out.length<3&&k<40;k++){ for(const c of [[A[0]+k,A[1]],[A[0],A[1]+k]]){ if(out.length<3&&okc(c[0],c[1])){seen.push(c);out.push(c)} } }
  const opts=shuffle([A,...out]);
  return {sub,q,opts:opts.map(([n,d])=>fs(n,d)),ans:opts.indexOf(A),e};
}

const ADD_R=[null,[1,9],[5,20],[10,49],[10,99],[50,199],[100,499],[100,999],[10,99],[500,2999],[100,499]];
function genAdd(l){
  const [lo,hi]=ADD_R[l]; const a=rnd(lo,hi), b=rnd(lo,hi);
  if(l===8||l===10){
    const c=rnd(lo,hi), ans=a+b+c;
    return numQ('Penjumlahan',`${a} + ${b} + ${c} = ?`,ans,[ans+10,ans-10,ans+1,ans-1,ans+100,ans-100],`${a} + ${b} + ${c} = ${ans}. Jumlahkan dua angka dulu, lalu tambahkan yang ketiga.`);
  }
  const ans=a+b;
  return numQ('Penjumlahan',`${a} + ${b} = ?`,ans,[ans+10,ans-10,ans+1,ans-1,ans+2,ans+100],`${a} + ${b} = ${ans}. Jumlahkan dari satuan, lalu puluhan, lalu ratusan.`);
}
function genSub(l){
  const [lo,hi]=ADD_R[l]; let a=rnd(lo,hi), b=rnd(lo,hi);
  const allowNeg=l>=8&&Math.random()<.4;
  if(!allowNeg&&b>a)[a,b]=[b,a];
  const ans=a-b;
  return numQ('Pengurangan',`${a} − ${b} = ?`,ans,[ans+10,ans-10,ans+1,ans-1,-ans,ans+2,b-a+2],
    `${a} − ${b} = ${fmtN(ans)}.`+(ans<0?' Angka pengurang lebih besar, jadi hasilnya negatif.':' Kurangi dari satuan; pinjam puluhan jika perlu.'));
}
const MUL_R=[null,[[2,5],[1,5]],[[2,5],[2,10]],[[2,9],[2,9]],[[2,12],[2,12]],[[11,15],[2,9]],[[12,25],[2,9]],[[21,50],[3,9]],[[11,19],[11,19]],[[20,40],[11,15]],[[100,300],[3,9]]];
function genMul(l){
  let [ra,rb]=MUL_R[l]; let a=rnd(...ra), b=rnd(...rb);
  if(l<=4&&Math.random()<.5)[a,b]=[b,a];
  const ans=a*b;
  let tip='';
  if(a>=10){ const t=a-a%10,o=a%10; tip=o?` Pecah: (${t} × ${b}) + (${o} × ${b}) = ${t*b} + ${o*b}.`:''; }
  return numQ('Perkalian',`${a} × ${b} = ?`,ans,[ans+a,ans-a,ans+b,ans-b,ans+10,ans-10,ans+1],`${a} × ${b} = ${ans}.${tip}`);
}
const DIV_R=[null,[[2,5],[1,5]],[[2,5],[2,10]],[[2,9],[2,9]],[[2,12],[2,12]],[[3,9],[11,30]],[[2,9],[20,99]],[[11,15],[5,20]],[[6,19],[11,30]],[[12,25],[12,40]],[[15,40],[12,50]]];
function genDiv(l){
  const [rb,rq]=DIV_R[l]; const b=rnd(...rb), q=rnd(...rq), a=b*q;
  return numQ('Pembagian',`${a} ÷ ${b} = ?`,q,[q+1,q-1,q+2,q-2,q+b,q*2,b],`${a} ÷ ${b} = ${q}, karena ${b} × ${q} = ${a}.`);
}

function qPct(l){
  const P=l<=2?[10,50]:l<=4?[10,20,25,50,75]:l<=6?[5,10,15,20,25,30,40,60,75,80]:[5,12,15,35,45,60,65,85];
  const B=l<=2?[20,40,60,80,100,200]:l<=4?[40,60,80,100,120,160,200,400]:[40,60,80,120,150,200,240,300,360,500];
  const mod=l>=7?50:100; let p,base,t=0;
  do{p=pick(P);base=pick(B);t++}while((p*base)%mod!==0&&t<100);
  if((p*base)%mod!==0){p=10;base=pick([20,40,60,80,100])}
  const ans=p*base/100;
  return numQ('Persen',`${p}% dari ${base} = ?`,ans,[ans*2,base-ans,ans+10,ans/2,p,p*base/10,ans+5],`${p}% dari ${base} = ${p}/100 × ${base} = ${fmtN(ans)}.`);
}
function qFracOf(l){
  const dn=l<=2?[2,3,4,5]:[2,3,4,5,6,8,10];
  const d=pick(dn), n=l<=2?1:rnd(1,d-1), unit=rnd(2,l<=2?6:12), N=d*unit, ans=unit*n;
  return numQ('Pecahan',`${n}/${d} dari ${N} = ?`,ans,[unit,ans+n,N-ans,ans+d,ans*2,N],`${N} ÷ ${d} = ${unit}, lalu × ${n} = ${ans}.`);
}
function qAddSame(){
  const d=pick([4,5,6,7,8,9,10,12]), a=rnd(1,d-3), b=rnd(1,d-1-a);
  return fracQ('Pecahan',`${a}/${d} + ${b}/${d} = ?`,[a+b,d],
    [[a+b,d*2],[a+b+1,d],[Math.abs(a-b)||1,d],[a*b,d],[a+b,d+1]],
    `Penyebut sama, jadi jumlahkan pembilangnya saja: ${a} + ${b} = ${a+b}. Hasilnya ${a+b}/${d}.`);
}
const PCT_LIST_EASY=[[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,10],[3,10]];
const PCT_LIST_HARD=PCT_LIST_EASY.concat([[1,20],[3,20],[1,8],[3,8]]);
function qToPct(l){
  const list=l>=7?PCT_LIST_HARD:PCT_LIST_EASY; const [n,d]=pick(list); const p=n*100/d;
  const ps=s=>fmtN(s)+'%';
  const cands=list.filter(x=>x[0]*100/x[1]!==p).map(x=>ps(x[0]*100/x[1])).concat([ps(p+10),ps(p+5),ps(100-p),ps(p*2)].filter(s=>s!==ps(p)&&!s.startsWith('−')));
  return strQ('Pecahan ke persen',`${n}/${d} sama dengan berapa persen?`,ps(p),cands,`${n}/${d} = (${n} ÷ ${d}) × 100% = ${ps(p)}.`);
}
function qAddDiff(l){
  let d1,d2;
  if(l>=9){[d1,d2]=pick([[2,3],[3,4],[2,5],[3,5],[4,5],[4,6]])}else{d1=pick([2,3,4,5]);d2=d1*2}
  const a=rnd(1,d1-1), b=rnd(1,d2-1);
  const num=a*d2+b*d1, den=d1*d2, A=red(num,den);
  return fracQ('Pecahan',`${a}/${d1} + ${b}/${d2} = ? (sederhanakan)`,A,
    [[a+b,d1+d2],[num+1,den],[num,den+1],[a+b,Math.max(d1,d2)],[num-1,den]],
    `Samakan penyebut ke ${den}: ${a*d2}/${den} + ${b*d1}/${den} = ${num}/${den}`+(A[0]*den!==num*A[1]||A[1]!==den?`, disederhanakan menjadi ${fs(A[0],A[1])}.`:'.'));
}
function qFracMul(){
  const n1=rnd(1,3), d1=rnd(n1+1,5), n2=rnd(1,4), d2=rnd(n2+1,6), A=red(n1*n2,d1*d2);
  return fracQ('Pecahan',`${n1}/${d1} × ${n2}/${d2} = ? (sederhanakan)`,A,
    [[n1+n2,d1+d2],[n1*d2,d1*n2],[n1*n2,d1+d2],[n1+n2,d1*d2],[n1*n2+1,d1*d2]],
    `Kalikan pembilang: ${n1} × ${n2} = ${n1*n2}. Kalikan penyebut: ${d1} × ${d2} = ${d1*d2}. Hasil ${fs(A[0],A[1])} setelah disederhanakan.`);
}
function qDisc(){
  const price=pick([40,50,60,80,100,120,150,200,250,300])*1000, p=pick([10,20,25,30,40,50]), amt=price*p/100, ans=price-amt;
  const item=pick(['baju','sepatu','tas','jaket','buku tulis']);
  return numQ('Diskon',`Harga ${item} ${rp(price)}, diskon ${p}%. Berapa yang dibayar?`,ans,[amt,price+amt,price-amt/2,price-p*1000,ans+5000,ans-5000],
    `Diskon = ${p}% × ${rp(price)} = ${rp(amt)}. Dibayar = ${rp(price)} − ${rp(amt)} = ${rp(ans)}.`,{f:rp,step:5000});
}
function qPctChange(){
  const base=pick([80,120,150,200,240,300,400]), p=pick([10,20,25,50]), up=Math.random()<.5, amt=base*p/100, ans=up?base+amt:base-amt;
  return numQ('Persen',`Nilai ${base} ${up?'naik':'turun'} ${p}%. Berapa nilainya sekarang?`,ans,[amt,up?base-amt:base+amt,base+p,base-p,ans+10,ans-10],
    `${p}% dari ${base} = ${amt}. ${up?'Naik':'Turun'}: ${base} ${up?'+':'−'} ${amt} = ${ans}.`);
}
function genFrac(l){
  const pool=l<=2?['pct','fracOf']:l<=4?['pct','fracOf','fracOf','addSame']:l<=6?['pct','fracOf','addSame','toPct']:l<=8?['pct','addDiff','disc','toPct','fracOf']:['pctChange','addDiff','fracMul','disc','pct'];
  switch(pick(pool)){
    case 'pct':return qPct(l);
    case 'fracOf':return qFracOf(l);
    case 'addSame':return qAddSame();
    case 'toPct':return qToPct(l);
    case 'addDiff':return qAddDiff(l);
    case 'fracMul':return qFracMul();
    case 'disc':return qDisc();
    default:return qPctChange();
  }
}

function genAlg(l){
  const kinds=l<=2?['a','b','c']:l<=4?['d','e','f']:l<=6?['g','g','h','e2']:l<=8?['j','j','k','l']:['m','m','n','o'];
  let x,a,b,c,d,p;
  switch(pick(kinds)){
    case 'a': x=rnd(1,12);a=rnd(1,10);b=x+a;
      return numQ('Aljabar',`Tentukan x: x + ${a} = ${b}`,x,[b+a,a,b,x+1,x-1],`Kurangi kedua sisi dengan ${a}: x = ${b} − ${a} = ${x}.`);
    case 'b': a=rnd(1,10);x=rnd(a+1,a+12);b=x-a;
      return numQ('Aljabar',`Tentukan x: x − ${a} = ${b}`,x,[b-a,a,b,x+1,x-1],`Tambahkan ${a} ke kedua sisi: x = ${b} + ${a} = ${x}.`);
    case 'c': x=rnd(1,15);a=rnd(2,15);b=a+x;
      return numQ('Aljabar',`Tentukan x: ${a} + x = ${b}`,x,[b+a,a,b,x+1,x-1],`Kurangi kedua sisi dengan ${a}: x = ${b} − ${a} = ${x}.`);
    case 'd': a=rnd(2,9);x=rnd(2,12);b=a*x;
      return numQ('Aljabar',`Tentukan x: ${a}x = ${b}`,x,[b-a,b+a,x+1,x-1,a],`Bagi kedua sisi dengan ${a}: x = ${b} ÷ ${a} = ${x}.`);
    case 'e': case 'e2': a=rnd(2,l>=5?9:6);x=rnd(1,l>=5?15:9);b=rnd(1,15);c=a*x+b;
      return numQ('Aljabar',`Tentukan x: ${a}x + ${b} = ${c}`,x,[c-b,(c+b)/a,x+1,x-1,x+b],`Kurangi ${b}: ${a}x = ${c-b}. Bagi ${a}: x = ${x}.`);
    case 'f': a=rnd(2,6);b=rnd(2,9);x=a*b;
      return numQ('Aljabar',`Tentukan x: x ÷ ${a} = ${b}`,x,[b+a,x+a,x-a,b,x+1],`Kalikan kedua sisi dengan ${a}: x = ${b} × ${a} = ${x}.`);
    case 'g': a=rnd(2,7);x=rnd(2,12);b=rnd(1,a*x-1);c=a*x-b;
      return numQ('Aljabar',`Tentukan x: ${a}x − ${b} = ${c}`,x,[c+b,(c-b)/a,x+1,x-1,x+2],`Tambahkan ${b}: ${a}x = ${c+b}. Bagi ${a}: x = ${x}.`);
    case 'h': { const s=rnd(1,20), dd=rnd(2,9), s3=s+3*dd, ans=s3+dd;
      return numQ('Pola bilangan',`Lanjutkan pola: ${s}, ${s+dd}, ${s+2*dd}, ${s3}, ?`,ans,[ans+dd,s3,ans+1,ans-1,s3+dd+2],`Selisih tiap suku selalu ${dd}. ${s3} + ${dd} = ${ans}.`); }
    case 'j': { let t=0; do{ c=rnd(1,4);a=c+rnd(1,4);x=rnd(l>=8?-6:1,10);b=rnd(1,12)*(l>=8&&Math.random()<.5?-1:1);d=(a-c)*x+b;t++ }while((x===0||d===0)&&t<50);
      return numQ('Aljabar',`Tentukan x: ${lin(a,b)} = ${lin(c,d)}`,x,[x+1,x-1,-x,(d+b)/(a+c),(d-b)/(a+c),x+2],
        `Pindahkan ${c}x ke kiri dan ${fmtN(b)} ke kanan: ${a-c}x = ${fmtN(d-b)}. Maka x = ${fmtN(x)}.`); }
    case 'k': { const r=pick([2,3]), s=rnd(1,5), s3=s*r*r*r, ans=s3*r;
      return numQ('Pola bilangan',`Lanjutkan pola: ${s}, ${s*r}, ${s*r*r}, ${s3}, ?`,ans,[s3+(s3-s*r*r),ans+r,ans-r,s3+r,ans+1],`Setiap suku dikali ${r}. ${s3} × ${r} = ${ans}.`); }
    case 'l': x=rnd(-8,-1);a=rnd(2,6);b=rnd(5,20);c=a*x+b;
      return numQ('Aljabar',`Tentukan x: ${a}x + ${b} = ${fmtN(c)}`,x,[-x,x+1,x-1,c-b,(c+b)/a],`Kurangi ${b}: ${a}x = ${fmtN(c-b)}. Bagi ${a}: x = ${fmtN(x)}.`);
    case 'm': { let t=0; do{ a=rnd(2,4);c=rnd(1,a-1);x=rnd(-5,10);p=rnd(1,5)*(Math.random()<.5?1:-1);d=(a-c)*x+a*p;t++ }while((x===0||d===0)&&t<50);
      return numQ('Aljabar',`Tentukan x: ${a}(x ${p<0?'−':'+'} ${Math.abs(p)}) = ${lin(c,d)}`,x,[x+1,x-1,-x,x+2,(d+a*p)/(a-c)],
        `Buka kurung: ${a}x ${a*p<0?'−':'+'} ${Math.abs(a*p)} = ${lin(c,d)}. Kumpulkan suku x: ${a-c}x = ${fmtN(d-a*p)}. Maka x = ${fmtN(x)}.`); }
    case 'n': x=rnd(3,15);
      return numQ('Aljabar',`Jika x² = ${x*x} dan x > 0, berapa x?`,x,[x+1,x-1,x*2,x*x/2,x+2],`${x} × ${x} = ${x*x}, jadi x = ${x}.`);
    default: { let t=0; do{ b=rnd(2,6);c=rnd(2,9);a=rnd(1,10);x=b*c-a;t++ }while(x<=0&&t<50);
      return numQ('Aljabar',`Tentukan x: (x + ${a}) ÷ ${b} = ${c}`,x,[b*c+a,c-a,b*c,x+1,x-1],`Kalikan kedua sisi dengan ${b}: x + ${a} = ${b*c}. Maka x = ${x}.`); }
  }
}
const GEN={
  tambahkurang:l=>pick([genAdd,genSub])(l),
  kalibagi:l=>pick([genMul,genDiv])(l),
  pecahan:genFrac,
  aljabar:genAlg,
};
//#GEN-END

/* ============ Suara ============ */
let AC=null, soundOn=store.get('da-sound')!=='off';
function ac(){ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){} } if(AC&&AC.state==='suspended')AC.resume().catch(()=>{}); return AC; }
function tone(f,d,type='square',v=.05,delay=0,slide=0){
  if(!soundOn)return; const a=ac(); if(!a)return;
  try{
    const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+delay;
    o.type=type; o.frequency.setValueAtTime(f,t); if(slide)o.frequency.linearRampToValueAtTime(Math.max(40,f+slide),t+d);
    g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+d+.02);
  }catch(e){}
}
const SFX={
  good:()=>{tone(523,.09);tone(784,.14,'square',.05,.09)},
  hit:()=>tone(180,.14,'sawtooth',.06,0,-100),
  bad:()=>{tone(220,.18,'sawtooth',.05,0,-120);tone(150,.25,'sawtooth',.05,.15,-60)},
  crit:()=>{tone(784,.08);tone(988,.08,'square',.05,.08);tone(1319,.16,'square',.05,.16)},
  win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.16,'square',.05,i*.12)),
  lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.22,'triangle',.07,i*.18)),
  pick:()=>{tone(660,.06);tone(880,.1,'square',.05,.06)},
  heal:()=>[523,659,784].forEach((f,i)=>tone(f,.12,'triangle',.06,i*.08)),
  door:()=>tone(120,.2,'triangle',.07,0,60),
};

/* ============ Gambar pixel art ============ */
const W=320,H=180,FEET=150,HERO_X=78,ENT_X=238;
const mk=(c,F)=>(x,y,w,h,col)=>{c.fillStyle=F||col;c.fillRect(x,y,w,h)};
const bob=(t,k,a)=>RM?0:Math.round(Math.sin(t*k)*a);

function slimeBody(c,t,F,col,dark,light){
  const r=mk(c,F), s=bob(t,3,1.3);
  r(-10,-6,20,6,col); r(-8,-11-s,16,6+s,col); r(-5,-14-s,10,3,col);
  r(-10,-2,20,2,dark); r(-6,-13-s,4,2,light);
  r(-5,-9-s,3,4,'#14111f'); r(2,-9-s,3,4,'#14111f'); r(-4,-9-s,1,1,'#fff'); r(3,-9-s,1,1,'#fff');
  r(-2,-4,4,1,'#14111f');
  return s;
}
const DRAW={
  hero(c,t,F){ const r=mk(c,F), b=bob(t,4,1);
    r(-5,-4,4,4,'#3a2e55'); r(1,-4,4,4,'#3a2e55'); r(-4,-7,3,3,'#4b5d8f'); r(1,-7,3,3,'#4b5d8f');
    r(-6,-16+b,12,9,'#3b6fd8'); r(-6,-16+b,12,2,'#6c95f5'); r(-6,-9+b,12,1,'#8a5a2b'); r(-1,-9+b,2,1,'#f2c14e');
    r(-8,-15+b,2,6,'#3b6fd8'); r(6,-15+b,2,6,'#3b6fd8');
    r(-11,-15+b,4,8,'#8a5a2b'); r(-10,-14+b,2,6,'#f2c14e');
    r(-5,-24+b,10,8,'#aab4c8'); r(-5,-24+b,10,2,'#dfe6f2'); r(-5,-18+b,10,2,'#8791a8');
    r(0,-21+b,5,2,'#14111f'); r(3,-21+b,1,1,'#8fd3ff');
    r(-1,-28+b,3,4,'#e24a6a'); r(-3,-27+b,2,3,'#e24a6a');
    r(8,-26+b,2,15,'#eef3fb'); r(8,-26+b,2,2,'#fff'); r(6,-12+b,6,2,'#f2c14e'); r(8,-10+b,2,3,'#8a5a2b');
  },
  slime(c,t,F){ slimeBody(c,t,F,'#4cc26b','#2f8f4a','#a8f0bd'); },
  kingslime(c,t,F){ const s=slimeBody(c,t,F,'#4aa3c2','#2d7a96','#a8e3f5'), r=mk(c,F);
    r(-6,-17-s,12,3,'#f2c14e'); r(-6,-20-s,2,3,'#f2c14e'); r(-1,-20-s,2,3,'#f2c14e'); r(4,-20-s,2,3,'#f2c14e'); r(-1,-16-s,2,1,'#ff5470'); },
  bat(c,t,F){ const r=mk(c,F), h=bob(t,2,3)-14, wy=RM?0:(Math.sin(t*10)>0?-6:0);
    r(-17,h+wy-2,13,4,'#4b3480'); r(-17,h+wy-2,4,2,'#6b4aa8'); r(4,h+wy-2,13,4,'#4b3480'); r(13,h+wy-2,4,2,'#6b4aa8');
    r(-4,h-6,8,9,'#6b4aa8'); r(-4,h-9,2,3,'#6b4aa8'); r(2,h-9,2,3,'#6b4aa8');
    r(-3,h-3,2,2,'#ff5470'); r(1,h-3,2,2,'#ff5470'); r(-2,h+1,1,2,'#fff'); r(1,h+1,1,2,'#fff'); },
  skeleton(c,t,F){ const r=mk(c,F), b=bob(t,3,1);
    r(-4,-9,2,9,'#e8e2cf'); r(2,-9,2,9,'#e8e2cf'); r(-5,-1,4,1,'#e8e2cf'); r(1,-1,4,1,'#e8e2cf'); r(-4,-11,8,2,'#e8e2cf');
    r(-1,-19+b,2,8,'#e8e2cf'); r(-5,-18+b,10,1,'#e8e2cf'); r(-4,-16+b,8,1,'#e8e2cf'); r(-4,-14+b,8,1,'#e8e2cf'); r(-3,-12+b,6,1,'#e8e2cf');
    r(-9,-19+b,2,9,'#e8e2cf'); r(-12,-27+b,2,13,'#9fb0c8'); r(-13,-15+b,4,2,'#f2c14e');
    r(-5,-27+b,10,8,'#f1ecdc'); r(-4,-25+b,3,3,'#14111f'); r(1,-25+b,3,3,'#14111f'); r(0,-22+b,1,1,'#14111f'); r(-3,-20+b,6,1,'#14111f'); },
  goblin(c,t,F){ const r=mk(c,F), b=bob(t,3.5,1);
    r(-4,-6,3,6,'#5a8f3a'); r(1,-6,3,6,'#5a8f3a'); r(-5,-15+b,10,9,'#8a5a2b'); r(-5,-15+b,10,2,'#a8702f');
    r(-5,-24+b,10,9,'#6bb04a'); r(-9,-22+b,4,3,'#6bb04a'); r(5,-22+b,4,3,'#6bb04a');
    r(-4,-21+b,3,3,'#fff6a0'); r(1,-21+b,3,3,'#fff6a0'); r(-3,-20+b,1,2,'#14111f'); r(2,-20+b,1,2,'#14111f');
    r(-3,-17+b,6,1,'#14111f'); r(-3,-18+b,1,1,'#fff'); r(2,-18+b,1,1,'#fff');
    r(-12,-26+b,4,14,'#6b4a2b'); r(-13,-28+b,6,5,'#8a5a2b'); },
  ghost(c,t,F){ const r=mk(c,F), h=bob(t,2,3)-8; c.globalAlpha=(F?1:.88)*c.globalAlpha;
    r(-8,h-18,16,16,'#e8f0ff'); r(-6,h-21,12,3,'#e8f0ff');
    r(-8,h-2,4,4,'#e8f0ff'); r(-4,h-2,4,2,'#e8f0ff'); r(0,h-2,4,4,'#e8f0ff'); r(4,h-2,4,2,'#e8f0ff');
    r(-5,h-13,3,4,'#14111f'); r(2,h-13,3,4,'#14111f'); r(-2,h-6,4,3,'#14111f'); r(-8,h-10,2,6,'#c7d6f2'); },
  ogre(c,t,F){ const r=mk(c,F), b=bob(t,2.5,1);
    r(-7,-8,5,8,'#5b6b3a'); r(2,-8,5,8,'#5b6b3a'); r(-9,-20+b,18,13,'#7d9a4a'); r(-5,-16+b,10,7,'#a3bc6a'); r(-9,-9+b,18,2,'#6b4a2b');
    r(-13,-19+b,4,10,'#7d9a4a'); r(9,-19+b,4,10,'#7d9a4a');
    r(-6,-29+b,12,10,'#7d9a4a'); r(-8,-31+b,3,4,'#e8e2cf'); r(5,-31+b,3,4,'#e8e2cf');
    r(-5,-26+b,3,2,'#ff5470'); r(2,-26+b,3,2,'#ff5470'); r(-5,-28+b,10,1,'#3f4d24'); r(-4,-21+b,2,3,'#fff'); r(2,-21+b,2,3,'#fff');
    r(-16,-30+b,5,22,'#6b4a2b'); r(-17,-33+b,7,8,'#8a5a2b'); },
  dragon(c,t,F){ const r=mk(c,F), b=bob(t,2.5,1), wy=RM?0:Math.round(Math.sin(t*3)*2);
    r(0,-32+wy,3,14,'#8e2f3b'); r(4,-30+wy,3,12,'#8e2f3b'); r(8,-28+wy,3,10,'#8e2f3b'); r(0,-26+wy,11,8,'#a63a49');
    r(-10,-18+b,22,14,'#d64550'); r(-8,-12+b,14,6,'#f2c14e'); r(12,-12+b,8,4,'#d64550'); r(18,-14+b,6,3,'#d64550'); r(23,-16+b,2,3,'#e8e2cf');
    r(-8,-4,4,4,'#b53540'); r(4,-4,4,4,'#b53540');
    r(-18,-26+b,12,9,'#d64550'); r(-22,-22+b,5,5,'#d64550'); r(-14,-30+b,2,4,'#e8e2cf'); r(-9,-30+b,2,4,'#e8e2cf');
    r(-14,-24+b,3,2,'#fff6a0'); r(-21,-18+b,1,2,'#fff'); r(-18,-18+b,1,2,'#fff');
    if(!RM&&Math.sin(t*1.3)>.9){ r(-34,-23+b,12,4,'#ff9f43'); r(-32,-22+b,8,2,'#ffe27a'); } },
  chest(c,t,F,open){ const r=mk(c,F);
    r(-11,-9,22,9,'#8a5a2b'); r(-11,-9,22,2,'#a8702f'); r(-11,-5,22,1,'#5a3a18'); r(-6,-9,2,9,'#f2c14e'); r(4,-9,2,9,'#f2c14e');
    if(!open){ r(-11,-15,22,6,'#a8702f'); r(-11,-15,22,1,'#c58a41'); r(-6,-15,2,6,'#f2c14e'); r(4,-15,2,6,'#f2c14e'); r(-2,-10,4,4,'#f2c14e'); r(-1,-9,2,2,'#2a1d00'); }
    else { r(-11,-24,22,6,'#a8702f'); r(-11,-24,22,1,'#c58a41'); r(-9,-12,18,3,'#ffe27a'); r(-5,-16,10,4,'#fff6a0');
      for(let i=0;i<4;i++){ const y=-20-((t*14+i*6)%14); r(-8+i*5,Math.round(y),1,2,'#fff6a0'); } } },
  fountain(c,t,F){ const r=mk(c,F);
    r(-14,-8,28,8,'#8a8fa8'); r(-14,-8,28,2,'#b9bed4'); r(-12,-10,24,3,'#4aa3ff'); r(-3,-20,6,10,'#8a8fa8'); r(-8,-23,16,3,'#b9bed4'); r(-6,-24,12,2,'#4aa3ff');
    for(let i=0;i<4;i++){ const y=-34+((t*20+i*7)%12); r(-6+i*4,Math.round(y),1,2,'#9fd8ff'); } },
};
const HEIGHT={slime:15,kingslime:21,bat:30,skeleton:28,goblin:28,ghost:28,ogre:34,dragon:34,chest:15,fountain:26};

function drawRelic(g,id){
  const r=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  switch(id){
    case 'sand': r(3,1,10,2,'#c9a15a'); r(3,13,10,2,'#c9a15a'); r(4,3,8,2,'#f2c14e'); r(5,5,6,1,'#f2c14e'); r(7,6,2,2,'#f2c14e'); r(6,8,4,1,'#8a6a2b'); r(5,9,6,1,'#8a6a2b'); r(4,10,8,3,'#f2c14e'); r(3,3,1,10,'#9fd8ff55'); r(12,3,1,10,'#9fd8ff55'); break;
    case 'shield': r(3,2,10,8,'#8a5a2b'); r(4,10,8,2,'#8a5a2b'); r(5,12,6,1,'#8a5a2b'); r(7,13,2,1,'#8a5a2b'); r(7,3,2,8,'#f2c14e'); r(4,6,8,2,'#f2c14e'); break;
    case 'sword': r(6,0,4,2,'#ff7a2f'); r(7,2,2,8,'#eef3fb'); r(4,10,8,2,'#f2c14e'); r(7,12,2,3,'#8a5a2b'); break;
    case 'eye': r(1,6,14,4,'#e6ecf5'); r(3,5,10,1,'#e6ecf5'); r(3,10,10,1,'#e6ecf5'); r(6,5,4,6,'#4aa3ff'); r(7,7,2,2,'#14111f'); break;
    case 'potion': r(6,0,4,2,'#8a5a2b'); r(6,2,4,3,'#c9d4e8'); r(4,5,8,9,'#e24a6a'); r(5,6,2,4,'#ff9db0'); r(4,14,8,1,'#a02848'); break;
    case 'coin': r(5,1,6,14,'#f2c14e'); r(3,3,10,10,'#f2c14e'); r(7,4,2,8,'#a8761a'); r(4,4,1,8,'#ffe27a'); break;
    case 'charm': r(9,0,4,3,'#ffd84a'); r(7,3,4,3,'#ffd84a'); r(4,6,8,3,'#ffd84a'); r(6,9,4,3,'#ff9f43'); r(4,12,4,3,'#ff9f43'); break;
  }
}
const RELICS=[
  {id:'sand',name:'Jam Pasir',desc:'+6 detik untuk setiap soal.'},
  {id:'shield',name:'Perisai Kayu',desc:'Menahan satu serangan monster di setiap ruangan.'},
  {id:'sword',name:'Pedang Api',desc:'Setiap serangan +1 kerusakan.'},
  {id:'eye',name:'Mata Elang',desc:'Sekali per ruangan, singkirkan 2 jawaban salah.'},
  {id:'potion',name:'Ramuan Hati',desc:'+1 hati maksimal dan pulihkan 1 hati.'},
  {id:'coin',name:'Koin Beruntung',desc:'Skor dari jawaban benar ×1,5.'},
  {id:'charm',name:'Jimat Kombo',desc:'Serangan kritis mulai dari kombo 2 (biasanya 3).'},
];
const MONS={1:['slime','bat'],2:['skeleton','goblin'],3:['ghost','skeleton','goblin','bat']};
const BOSS={1:'kingslime',2:'ogre',3:'dragon'};
const NAMES={slime:'Slime',bat:'Kelelawar',skeleton:'Kerangka',goblin:'Goblin',ghost:'Hantu',kingslime:'Raja Slime',ogre:'Ogre Raksasa',dragon:'Naga Angka'};
const TOPIC_NAMES={tambahkurang:'Tambah & Kurang',kalibagi:'Kali & Bagi',pecahan:'Pecahan & Persen',aljabar:'Aljabar'};

/* ============ Kanvas ============ */
const cv=$('#scene'), c=cv.getContext('2d'); c.imageSmoothingEnabled=false;
const BG=document.createElement('canvas'); BG.width=W; BG.height=H;
(function(){
  const g=BG.getContext('2d');
  g.fillStyle='#17122b'; g.fillRect(0,0,W,H);
  for(let y=0,row=0;y<108;y+=12,row++){
    for(let x=-(row%2?16:0);x<W;x+=32){
      g.fillStyle=((row*7+Math.floor((x+16)/32)*3)%5<2)?'#2a2250':'#241d44'; g.fillRect(x+1,y+1,30,10);
      g.fillStyle='#322a5c'; g.fillRect(x+1,y+1,30,1);
    }
  }
  g.fillStyle='#3a3168'; g.fillRect(0,108,W,4);
  g.fillStyle='#2b2350'; g.fillRect(0,112,W,H-112);
  g.fillStyle='#1d1738';
  [112,126,142,160].forEach(y=>g.fillRect(0,y,W,1));
  [[112,126],[126,142],[142,160],[160,180]].forEach(([a,b],i)=>{ for(let x=(i%2?20:0);x<W;x+=40) g.fillRect(x,a,1,b-a); });
  const v=g.createRadialGradient(W/2,H/2,40,W/2,H/2,W*0.62); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.6)');
  g.fillStyle=v; g.fillRect(0,0,W,H);
})();

const scene={mode:'title',ent:null};
let A={heroAtk:0,entAtk:0,heroHurt:0,entHurt:0,entDeath:0,heroDeath:0};
let floats=[], slashes=[];
const prog=(t0,dur,now)=>{ if(!t0)return -1; const p=(now-t0)/dur; return p>=0&&p<1?p:-1; };
function addFloat(text,x,y,color){ floats.push({text,x,y,color,t0:performance.now()}); }
function addSlash(x,y){ slashes.push({x,y,t0:performance.now()}); }

function drawAt(fn,x,y,u,t,F,extra){ c.save(); c.translate(Math.round(x),Math.round(y)); if(u!==1)c.scale(u,u); fn(c,t,F,extra); c.restore(); }
function shadow(x,u){ c.fillStyle='rgba(0,0,0,.4)'; c.fillRect(Math.round(x-13*u),FEET,Math.round(26*u),3); }
function drawDoor(x,label,boss){
  c.fillStyle=boss?'#5a2a3a':'#4a4178'; c.fillRect(x-16,FEET-46,32,46);
  c.fillStyle='#0b0914'; c.fillRect(x-12,FEET-42,24,42);
  c.fillStyle=boss?'#8e2f3b':'#3a3162'; c.fillRect(x-12,FEET-42,24,2);
  c.fillStyle='#f2c14e'; c.font="8px 'Press Start 2P',monospace"; c.textAlign='center'; c.fillText(label,x,FEET-18);
}
function outlined(text,x,y,color){ c.lineWidth=3; c.strokeStyle='#0b0914'; c.strokeText(text,x,y); c.fillStyle=color; c.fillText(text,x,y); }

function frame(now){
  const t=now/1000;
  c.globalAlpha=1; c.drawImage(BG,0,0);
  if(!RM||true){
    [34,160,286].forEach(x=>{
      const fh=RM?6:6+Math.round(Math.sin(t*9+x)*2);
      const gr=c.createRadialGradient(x,50,2,x,50,46); gr.addColorStop(0,'rgba(255,159,67,.28)'); gr.addColorStop(1,'rgba(255,159,67,0)');
      c.fillStyle=gr; c.fillRect(x-46,4,92,92);
      c.fillStyle='#5a3a18'; c.fillRect(x-2,52,4,8); c.fillStyle='#8a5a2b'; c.fillRect(x-4,50,8,3);
      c.fillStyle='#ff9f43'; c.fillRect(x-3,48-fh,6,fh+2); c.fillStyle='#ffd36b'; c.fillRect(x-2,50-fh,4,fh);
    });
  }
  if(scene.mode==='map'){
    if(G.doors&&G.doors.length===2){ drawDoor(206,'A'); drawDoor(266,'B'); }
    else if(G.doors&&G.doors.length===1){ drawDoor(238,'BOS',true); }
  }

  const ent=scene.ent;
  const lungeDist=ent?(ENT_X-HERO_X)-28-22*ent.u:0;
  // monster / objek
  if(ent){
    let ex=ENT_X, ey=FEET, F=null, alpha=1;
    const ap=prog(A.entAtk,480,now); if(ap>=0)ex-=Math.sin(Math.PI*ap)*lungeDist*0.9;
    const hp=prog(A.entHurt,300,now); if(hp>=0){ F=Math.floor(hp*5)%2===0?'#ffffff':null; if(!RM)ex+=(Math.floor(hp*10)%2?2:-2); }
    if(A.entDeath){ const dp=Math.min(1,(now-A.entDeath)/650); alpha=1-dp; ey+=dp*10; }
    if(alpha>0){
      c.globalAlpha=alpha; shadow(ex,ent.u);
      drawAt(DRAW[ent.kind],ex,ey,ent.u,t,F,ent.open);
      c.globalAlpha=1;
      if(ent.maxHp&&alpha>=1){
        const top=FEET-HEIGHT[ent.kind]*ent.u-12;
        c.font="8px 'Press Start 2P',monospace"; c.textAlign='center';
        outlined(ent.name,ENT_X,top-5,'#f1ecff');
        c.fillStyle='#0b0914'; c.fillRect(ENT_X-26,top-2,52,7);
        c.fillStyle='#3a1a26'; c.fillRect(ENT_X-25,top-1,50,5);
        c.fillStyle='#ff5470'; c.fillRect(ENT_X-25,top-1,Math.round(50*Math.max(0,ent.hp)/ent.maxHp),5);
      }
    }
  }
  // pahlawan
  if(scene.mode!=='end-hidden'){
    let hx=HERO_X, F=null;
    const lp=prog(A.heroAtk,420,now); if(lp>=0)hx+=Math.sin(Math.PI*lp)*lungeDist;
    const hp=prog(A.heroHurt,380,now); if(hp>=0){ F=Math.floor(hp*6)%2===0?'#ff8a8a':null; if(!RM)hx+=(Math.floor(hp*12)%2?2:-2); }
    shadow(hx,1);
    if(A.heroDeath){
      const dp=Math.min(1,(now-A.heroDeath)/500);
      c.save(); c.translate(Math.round(hx),FEET); c.rotate(-Math.PI/2*dp); c.globalAlpha=1-.3*dp; DRAW.hero(c,t,'#c9c2e6'); c.restore();
    } else drawAt(DRAW.hero,hx,FEET,1,t,F);
  }
  // efek
  slashes=slashes.filter(s=>now-s.t0<280);
  slashes.forEach(s=>{ const p=(now-s.t0)/280, n=Math.floor(10*Math.min(1,p*2.2)); c.globalAlpha=1-p; c.fillStyle='#fff';
    for(let i=0;i<n;i++){ c.fillRect(s.x-16+i*3,s.y-16+i*3,3,3); c.fillRect(s.x+13-i*3,s.y-16+i*3,3,3); } c.globalAlpha=1; });
  floats=floats.filter(f=>now-f.t0<1000);
  c.font="8px 'Press Start 2P',monospace"; c.textAlign='center';
  floats.forEach(f=>{ const p=(now-f.t0)/1000; c.globalAlpha=1-p*p; outlined(f.text,f.x,f.y-p*22,f.color); c.globalAlpha=1; });

  // pewaktu
  if(G.timing&&!G.locked&&G.limit){
    const left=G.deadline-now, frac=clamp(left/G.limit,0,1);
    $('#timerFill').style.width=(frac*100)+'%';
    $('#timer').classList.toggle('low',frac<.25);
    if(left<=0)timeout();
  }
  requestAnimationFrame(frame);
}

/* ============ State ============ */
const cfg={level:store.get('da-level')||'menengah',topics:null,chill:store.get('da-chill')==='1'};
try{ const t=JSON.parse(store.get('da-topics')||'null'); if(Array.isArray(t)&&t.every(x=>GEN[x])&&t.length)cfg.topics=new Set(t); }catch(e){}
if(!cfg.topics)cfg.topics=new Set(Object.keys(GEN));
if(!['pemula','menengah','mahir'].includes(cfg.level))cfg.level='menengah';

let G={rid:0,doors:[],timing:false,locked:true,relics:new Set()};
function later(ms,fn){ const id=G.rid; setTimeout(()=>{ if(G.rid===id)fn(); },ms); }
function newRun(){
  const base={pemula:1.6,menengah:4.5,mahir:7.5}[cfg.level];
  G={rid:G.rid+1,hp:5,maxHp:5,floor:1,step:1,score:0,combo:0,bestCombo:0,skill:base,relics:new Set(),stats:{},total:0,right:0,rooms:0,maxLevel:1,
     room:null,q:null,locked:true,shieldUsed:false,eyeUsed:false,lastTopic:null,timing:false,doors:[],cb:null,limit:0,t0:0,deadline:0,dead:false};
  A={heroAtk:0,entAtk:0,heroHurt:0,entHurt:0,entDeath:0,heroDeath:0}; floats=[]; slashes=[];
}
const curLevel=()=>clamp(Math.round(G.skill+(G.floor-1)*.5),1,10);

/* ============ UI ============ */
const PANELS=['pTitle','pMap','pBattle','pReward','pEnd'];
function show(id){ PANELS.forEach(p=>{ $('#'+p).hidden=(p!==id); }); }
const HEART=[[1,0,2,1],[4,0,2,1],[0,1,7,2],[1,3,5,1],[2,4,3,1],[3,5,1,1]];
const heartSvg=cls=>`<svg class="h ${cls}" viewBox="0 0 7 6" shape-rendering="crispEdges" aria-hidden="true">${HEART.map(([x,y,w,h])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}</svg>`;
function relicCanvas(id,size){ const k=document.createElement('canvas'); k.width=16; k.height=16; drawRelic(k.getContext('2d'),id); if(size){k.style.width=size+'px';k.style.height=size+'px';} return k; }
function updateHud(){
  $('#hud').hidden=false;
  let h=''; for(let i=0;i<G.maxHp;i++)h+=heartSvg(i<G.hp?'full':'empty');
  const hs=$('#hearts'); hs.innerHTML=h; hs.setAttribute('role','img'); hs.setAttribute('aria-label',`Nyawa ${G.hp} dari ${G.maxHp}`);
  $('#chipFloor').textContent=`LANTAI ${G.floor}/3`;
  $('#chipScore').textContent=String(G.score);
  const cb=$('#chipCombo'); cb.hidden=G.combo<2; cb.textContent=`KOMBO x${G.combo}`;
  const rl=$('#relics'); rl.innerHTML=''; rl.hidden=G.relics.size===0;
  RELICS.filter(r=>G.relics.has(r.id)).forEach(r=>{ const k=relicCanvas(r.id); k.title=`${r.name}: ${r.desc}`; rl.appendChild(k); });
}
function fm(s){ return String(s).replace(/(\d+)\/(\d+)/g,'<span class="frac"><span>$1</span><span>$2</span></span>').replace(/x²/g,'x<sup>2</sup>'); }

function showTitle(){
  G.rid++; G.timing=false; G.locked=true;
  scene.mode='title'; scene.ent={kind:'dragon',u:2,name:'',hp:0,maxHp:0};
  A={heroAtk:0,entAtk:0,heroHurt:0,entHurt:0,entDeath:0,heroDeath:0}; floats=[]; slashes=[]; G.doors=[];
  $('#hud').hidden=true; $('#btnQuit').hidden=true; show('pTitle');
  const best=store.get('da-best'); $('#bestLine').textContent=best?`SKOR TERBAIK: ${best}`:'';
}

/* ---- Menu ---- */
function syncMenu(){
  $('#optLevel').querySelectorAll('.opt').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===cfg.level)));
  $('#optTopics').querySelectorAll('.opt').forEach(b=>b.setAttribute('aria-pressed',String(cfg.topics.has(b.dataset.v))));
  $('#optChill').setAttribute('aria-pressed',String(cfg.chill));
  $('#btnSound').textContent='Suara: '+(soundOn?'nyala':'mati');
}
$('#optLevel').addEventListener('click',e=>{ const b=e.target.closest('.opt'); if(!b)return; cfg.level=b.dataset.v; store.set('da-level',cfg.level); syncMenu(); });
$('#optTopics').addEventListener('click',e=>{ const b=e.target.closest('.opt'); if(!b)return; const v=b.dataset.v;
  if(cfg.topics.has(v)){ if(cfg.topics.size>1)cfg.topics.delete(v); } else cfg.topics.add(v);
  store.set('da-topics',JSON.stringify([...cfg.topics])); syncMenu(); });
$('#optChill').addEventListener('click',()=>{ cfg.chill=!cfg.chill; store.set('da-chill',cfg.chill?'1':'0'); syncMenu(); });
$('#btnSound').addEventListener('click',()=>{ soundOn=!soundOn; store.set('da-sound',soundOn?'on':'off'); syncMenu(); if(soundOn){ac();SFX.pick();} });
$('#btnStart').addEventListener('click',()=>{ ac(); startRun(); });
$('#btnAgain').addEventListener('click',()=>{ ac(); startRun(); });
$('#btnMenu').addEventListener('click',showTitle);
let quitArmed=0;
$('#btnQuit').addEventListener('click',()=>{
  const b=$('#btnQuit');
  if(!quitArmed){ b.textContent='Yakin? Klik lagi'; quitArmed=setTimeout(()=>{ quitArmed=0; b.textContent='Menyerah'; },3000); return; }
  clearTimeout(quitArmed); quitArmed=0; b.textContent='Menyerah'; showTitle();
});

/* ---- Peta ---- */
function weighted(){ const r=Math.random()*7.3; return r<4?'monster':r<5.4?'chest':'fountain'; }
function makeRoom(type){
  if(type==='monster'){ const kind=pick(MONS[G.floor]), hp=2+G.floor; return {type,kind,name:NAMES[kind],hp,maxHp:hp,dmg:1,u:1}; }
  if(type==='boss'){ const kind=BOSS[G.floor], hp=6+2*G.floor; return {type,kind,name:NAMES[kind],hp,maxHp:hp,dmg:2,u:2}; }
  if(type==='chest')return {type,kind:'chest',name:'Peti Harta',u:1};
  return {type:'fountain',kind:'fountain',name:'Mata Air',u:1};
}
function genDoors(){
  const types=[];
  for(let i=0;i<2;i++){
    let t=weighted(), n=0;
    while(((t==='fountain'&&G.hp>=G.maxHp)||(types.includes(t)&&t!=='monster'))&&n++<20)t=weighted();
    if(t==='fountain'&&G.hp>=G.maxHp)t='monster';
    types.push(t);
  }
  return types.map(makeRoom);
}
function doorIcon(room){
  const k=document.createElement('canvas'); k.width=56; k.height=56; const g=k.getContext('2d'); g.imageSmoothingEnabled=false;
  const gr=g.createLinearGradient(0,0,0,56); gr.addColorStop(0,'#1b1633'); gr.addColorStop(1,'#2b2350'); g.fillStyle=gr; g.fillRect(0,0,56,56);
  g.save(); g.translate(28,50); DRAW[room.kind](g,0.4,null,false); g.restore();
  return k;
}
function showMap(){
  scene.mode='map'; scene.ent=null; A.entDeath=0;
  G.doors=G.step>=5?[makeRoom('boss')]:genDoors();
  updateHud(); $('#btnQuit').hidden=false; show('pMap');
  $('#mapTitle').textContent=G.step>=5?`LANTAI ${G.floor} · RUANG BOS`:`LANTAI ${G.floor} · RUANG ${G.step} DARI 5`;
  let tr=''; for(let i=1;i<=5;i++){ tr+=`<span class="node${i===5?' boss':''}${i<G.step?' done':''}${i===G.step?' cur':''}"></span>`; if(i<5)tr+='<hr>'; }
  $('#track').innerHTML=tr;
  const box=$('#doors'); box.innerHTML='';
  G.doors.forEach((room,i)=>{
    const b=document.createElement('button'); b.type='button'; b.className='door';
    const info={
      monster:['MONSTER',room.name,`HP ${room.maxHp}. Jawab benar untuk menyerang.`],
      boss:['BOS',room.name,`HP ${room.maxHp}. Serangannya melukai 2 hati.`],
      chest:['PETI HARTA','Peti terkunci','1 soal. Benar: relik. Salah: jebakan, −1 hati.'],
      fountain:['MATA AIR','Air penyembuh','1 soal. Benar: pulihkan 1 hati.'],
    }[room.type];
    const lab=G.doors.length===2?(i?'PINTU B · ':'PINTU A · ')+info[0]:info[0];
    b.appendChild(doorIcon(room));
    const d=document.createElement('div'); d.innerHTML=`<div class="dl">${lab}</div><div class="dt">${info[1]}</div><div class="dd">${info[2]}</div>`; b.appendChild(d);
    b.addEventListener('click',()=>enterRoom(room));
    box.appendChild(b);
  });
}

/* ---- Ruangan & soal ---- */
function enterRoom(room){
  SFX.door(); G.room=room; G.shieldUsed=false; G.eyeUsed=false; G.doors=[];
  A.entAtk=A.entHurt=A.entDeath=0;
  scene.mode='battle'; scene.ent={kind:room.kind,u:room.u,name:room.name,hp:room.hp||0,maxHp:room.type==='monster'||room.type==='boss'?room.maxHp:0,open:false};
  $('#roomName').textContent=room.type==='boss'?`BOS · ${room.name}`:room.name;
  show('pBattle'); updateHud(); nextQuestion();
}
function chooseTopic(){
  let arr=[...cfg.topics]; if(arr.length>1&&G.lastTopic)arr=arr.filter(x=>x!==G.lastTopic);
  return pick(arr);
}
function timeFor(q){ return Math.max(14,Math.round(30-q.level*1.3))+((q.topic==='pecahan'||q.topic==='aljabar')?6:0)+(G.relics.has('sand')?6:0); }
function nextQuestion(){
  const lvl=curLevel(), topic=chooseTopic(), q=GEN[topic](lvl); q.level=lvl; q.topic=topic; G.q=q; G.lastTopic=topic;
  $('#qinfo').textContent=`${q.sub} · Tingkat ${lvl}`;
  $('#qtext').innerHTML=fm(q.q);
  const box=$('#answers'); box.innerHTML='';
  q.opts.forEach((o,i)=>{ const b=document.createElement('button'); b.type='button'; b.className='ans'; b.innerHTML=`<span class="k">${i+1}</span><span>${fm(o)}</span>`; b.addEventListener('click',()=>choose(i)); box.appendChild(b); });
  $('#fb').hidden=true;
  $('#eye').hidden=!(G.relics.has('eye')&&!G.eyeUsed);
  G.limit=cfg.chill?0:timeFor(q)*1000;
  $('#timer').hidden=!G.limit; $('#timerFill').style.width='100%'; $('#timer').classList.remove('low');
  G.t0=performance.now(); G.deadline=G.t0+G.limit; G.locked=false; G.timing=!!G.limit;
}
function markButtons(i){
  [...$('#answers').children].forEach((b,k)=>{ b.disabled=true; if(k===G.q.ans)b.classList.add('good'); else if(k===i)b.classList.add('bad'); else b.classList.add('dim'); });
  $('#eye').hidden=true;
}
function choose(i){ if(G.locked||!G.q)return; G.locked=true; G.timing=false; markButtons(i); resolve(i===G.q.ans,false); }
function timeout(){ if(G.locked||!G.q)return; G.locked=true; G.timing=false; markButtons(-1); resolve(false,true); }
$('#eye').addEventListener('click',()=>{
  if(G.locked||G.eyeUsed)return; G.eyeUsed=true; SFX.pick(); $('#eye').hidden=true;
  const wrong=[...$('#answers').children].map((b,k)=>k).filter(k=>k!==G.q.ans);
  shuffle(wrong).slice(0,2).forEach(k=>{ const b=$('#answers').children[k]; b.disabled=true; b.classList.add('dim'); });
});
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(!$('#pBattle').hidden){
    if(!G.locked&&/^[1-4]$/.test(e.key)){ const b=$('#answers').children[+e.key-1]; if(b&&!b.disabled)choose(+e.key-1); }
    else if(!$('#fb').hidden&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); $('#btnNext').click(); }
  }
});

const entTop=()=>FEET-HEIGHT[G.room.kind]*G.room.u-22;
function resolve(ok,timedOut){
  const q=G.q, room=G.room, now=performance.now(), secs=(now-G.t0)/1000;
  const st=G.stats[q.topic]||(G.stats[q.topic]={c:0,t:0}); st.t++; if(ok)st.c++;
  G.total++; if(ok)G.right++;
  G.maxLevel=Math.max(G.maxLevel,q.level);
  if(ok)G.skill=Math.min(10.4,G.skill+((G.limit&&secs<G.limit/2000)?.45:.3)); else G.skill=Math.max(1,G.skill-.7);
  const fight=room.type==='monster'||room.type==='boss';

  if(ok){
    G.combo++; G.bestCombo=Math.max(G.bestCombo,G.combo);
    G.score+=Math.round(10*q.level*(1+Math.min(G.combo,10)*.1)*(G.relics.has('coin')?1.5:1));
    SFX.good(); updateHud();
    if(fight){
      const crit=G.combo>=(G.relics.has('charm')?2:3), dmg=1+(G.relics.has('sword')?1:0)+(crit?1:0), dead=room.hp-dmg<=0;
      A.heroAtk=now;
      later(200,()=>{
        A.entHurt=performance.now(); room.hp=Math.max(0,room.hp-dmg); scene.ent.hp=room.hp;
        addSlash(ENT_X,FEET-14*room.u); addFloat(`-${dmg}`,ENT_X,entTop(),crit?'#ffd84a':'#ffffff');
        if(crit)addFloat('KRITIS!',ENT_X,entTop()-12,'#ffd84a');
        crit?SFX.crit():SFX.hit();
      });
      if(dead){ later(800,()=>{ A.entDeath=performance.now(); }); later(1500,winRoom); }
      else later(900,nextQuestion);
    } else if(room.type==='chest'){
      later(300,()=>{ scene.ent.open=true; SFX.win(); addFloat('TERBUKA!',ENT_X,FEET-40,'#ffd84a'); });
      later(1300,()=>{ finishRoom(); giveReward(room.type,()=>nextStep()); });
    } else {
      later(300,()=>{ G.hp=Math.min(G.maxHp,G.hp+1); SFX.heal(); addFloat('+1 HATI',HERO_X,FEET-40,'#58d68d'); updateHud(); });
      later(1300,()=>{ finishRoom(); nextStep(); });
    }
  } else {
    G.combo=0; SFX.bad();
    const blocked=fight&&G.relics.has('shield')&&!G.shieldUsed;
    const dmg=fight?room.dmg:room.type==='chest'?1:0;
    if(fight)A.entAtk=now;
    later(fight?230:150,()=>{
      if(blocked){ G.shieldUsed=true; addFloat('TANGKIS!',HERO_X,FEET-44,'#6c95f5'); SFX.pick(); }
      else if(dmg){
        G.hp=Math.max(0,G.hp-dmg); A.heroHurt=performance.now(); addFloat(`-${dmg}`,HERO_X,FEET-44,'#ff6b6b'); SFX.hit();
        if(G.hp<=0){ G.dead=true; later(300,()=>{ A.heroDeath=performance.now(); }); }
      }
      updateHud();
    });
    later(fight?900:650,()=>{
      G.cb=()=>{
        if(G.dead)endRun(false);
        else if(fight)nextQuestion();
        else { finishRoom(); nextStep(); }
      };
      showFeedback(q,timedOut);
    });
  }
}
function showFeedback(q,timedOut){
  $('#fbText').innerHTML=`${timedOut?'Waktu habis! ':''}Jawaban yang benar: <b>${fm(q.opts[q.ans])}</b><br>${fm(q.e)}`;
  $('#btnNext').textContent=G.dead?'Lihat hasil':'Lanjut';
  $('#fb').hidden=false; $('#btnNext').focus({preventScroll:true});
}
$('#btnNext').addEventListener('click',()=>{ if($('#fb').hidden)return; $('#fb').hidden=true; const f=G.cb; G.cb=null; if(f)f(); });

function finishRoom(){ G.rooms++; }
function winRoom(){
  finishRoom(); const room=G.room;
  if(room.type==='boss'){
    G.score+=150*G.floor; SFX.win();
    giveReward('boss',advanceFloor);
  } else { G.score+=30*G.floor; updateHud(); nextStep(); }
}
function nextStep(){ G.step++; showMap(); }
function advanceFloor(){
  if(G.floor>=3){ G.score+=500; endRun(true); return; }
  G.floor++; G.step=1; G.hp=Math.min(G.maxHp,G.hp+2); G.skill=Math.min(10.4,G.skill); SFX.heal(); showMap();
}

/* ---- Hadiah ---- */
function applyRelic(id){
  G.relics.add(id);
  if(id==='potion'){ G.maxHp=Math.min(7,G.maxHp+1); G.hp=Math.min(G.maxHp,G.hp+1); }
}
function giveReward(from,done){
  const pool=RELICS.filter(r=>!G.relics.has(r.id)&&!(cfg.chill&&r.id==='sand'));
  if(!pool.length){ G.score+=150*G.floor; G.hp=Math.min(G.maxHp,G.hp+1); addFloat('+HARTA!',ENT_X,FEET-40,'#ffd84a'); updateHud(); later(700,done); return; }
  scene.mode='battle';
  $('#rewardTitle').textContent=from==='boss'?'BOS TUMBANG! PILIH RELIK (+2 HATI)':'PILIH RELIK';
  const box=$('#rewards'); box.innerHTML='';
  shuffle(pool).slice(0,3).forEach(r=>{
    const b=document.createElement('button'); b.type='button'; b.className='door';
    const k=relicCanvas(r.id); k.style.width='76px'; k.style.height='76px'; k.style.padding='8px'; b.appendChild(k);
    const d=document.createElement('div'); d.innerHTML=`<div class="dl">RELIK</div><div class="dt">${r.name}</div><div class="dd">${r.desc}</div>`; b.appendChild(d);
    b.addEventListener('click',()=>{ SFX.pick(); applyRelic(r.id); updateHud(); done(); });
    box.appendChild(b);
  });
  updateHud(); show('pReward');
}

/* ---- Akhir ---- */
function endRun(victory){
  G.timing=false; G.locked=true;
  if(victory)SFX.win(); else SFX.lose();
  const prev=+store.get('da-best')||0; const isBest=G.score>prev; if(isBest)store.set('da-best',String(G.score));
  scene.mode='end'; scene.ent=victory?{kind:'chest',u:1,name:'',hp:0,maxHp:0,open:true}:null; G.doors=[];
  $('#endTitle').textContent=victory?'KAMU MENANG! DUNGEON TAKLUK':'PETUALANGAN BERAKHIR';
  $('#endSub').textContent=victory?'Ketiga bos sudah kamu kalahkan. Hebat!':`Kamu sampai di lantai ${G.floor}, ruang ${Math.min(G.step,5)}.`;
  const acc=G.total?Math.round(G.right/G.total*100):0;
  const stat=(l,v)=>`<div class="stat">${l}<b>${v}</b></div>`;
  $('#endStats').innerHTML=stat('Skor',G.score+(isBest&&G.score>0?' ★':''))+stat('Ruangan selesai',G.rooms)+stat('Ketepatan',acc+'%')+stat('Kombo terbaik','x'+G.bestCombo)+stat('Tingkat soal tertinggi',G.maxLevel);
  const rows=Object.keys(TOPIC_NAMES).filter(k=>G.stats[k]);
  $('#endBars').innerHTML=rows.length?rows.map(k=>{ const s=G.stats[k], p=Math.round(s.c/s.t*100);
    return `<div class="bar"><span>${TOPIC_NAMES[k]}</span><div class="tr"><i style="width:${p}%"></i></div><span class="pc">${p}%</span></div>`; }).join(''):'<div class="muted">Belum ada soal yang dijawab.</div>';
  const cand=rows.filter(k=>G.stats[k].t>=3).sort((a,b)=>G.stats[a].c/G.stats[a].t-G.stats[b].c/G.stats[b].t);
  let tip;
  if(cand.length>1&&G.stats[cand[0]].c/G.stats[cand[0]].t<.8)tip=`Latihan berikutnya: ${TOPIC_NAMES[cand[0]]}. Coba pilih topik itu saja di menu untuk berlatih.`;
  else if(acc>=85&&G.total>=8)tip='Ketepatanmu sangat baik. Coba naikkan tingkat awal ke yang lebih tinggi.';
  else tip='Tips: jawab beruntun untuk kombo dan serangan kritis, dan ambil relik yang cocok dengan gayamu.';
  $('#endTip').textContent=tip;
  $('#hud').hidden=false; $('#btnQuit').hidden=true; show('pEnd'); updateHud();
}

function startRun(){
  newRun(); scene.mode='map'; quitArmed&&clearTimeout(quitArmed); quitArmed=0; $('#btnQuit').textContent='Menyerah';
  updateHud(); showMap();
}

document.addEventListener('visibilitychange',()=>{
  if(document.hidden){ if(G.timing&&!G.locked)G.remain=G.deadline-performance.now(); }
  else if(G.timing&&!G.locked&&G.remain){ G.deadline=performance.now()+G.remain; G.remain=0; }
});

syncMenu(); showTitle();
if(document.fonts&&document.fonts.load){ document.fonts.load("8px 'Press Start 2P'").catch(()=>{}); }
requestAnimationFrame(frame);
})();
