import{h as q,i as Z,q as Q}from"./chunk-LBZ34ZL2.js";import{d as J}from"./chunk-N3ET5YJZ.js";import{Ob as N,b as G,db as C,gb as $,ib as Pe,rb as M}from"./chunk-6VFX2JNU.js";import{v as O}from"./chunk-LUKOAFYK.js";import{b as X}from"./chunk-O77QQVYU.js";import{a as V}from"./chunk-D2ACMGPV.js";import{b as g,j as k,k as n}from"./chunk-NORECDYR.js";import{g as I}from"./chunk-RQERJHUS.js";import{b as K,d as W,h as p,j as preactH,o as d}from"./chunk-NUN3A7RC.js";var de=K(U=>{d();p();Object.defineProperty(U,"__esModule",{value:!0});var u=I();function j(){return j=Object.assign?Object.assign.bind():function(e){for(var o=1;o<arguments.length;o++){var t=arguments[o];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},j.apply(this,arguments)}var Ze=u.createElement("svg",{viewBox:"-2 -5 14 20",height:"100%",width:"100%",style:{position:"absolute",top:0}},u.createElement("path",{d:"M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12",fill:"#fff",fillRule:"evenodd"})),Je=u.createElement("svg",{height:"100%",width:"100%",viewBox:"-2 -5 17 21",style:{position:"absolute",top:0}},u.createElement("path",{d:"M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0",fill:"#fff",fillRule:"evenodd"}));function le(e){if(e.length===7)return e;for(var o="#",t=1;t<4;t+=1)o+=e[t]+e[t];return o}function ce(e,o,t,i,s){return function(r,f,l,a,c){var x=(r-l)/(f-l);if(x===0)return a;if(x===1)return c;for(var w="#",b=1;b<6;b+=2){var D=parseInt(a.substr(b,2),16),_=parseInt(c.substr(b,2),16),S=Math.round((1-x)*D+x*_).toString(16);S.length===1&&(S="0"+S),w+=S}return w}(e,o,t,le(i),le(s))}var pe=function(e){function o(t){e.call(this,t);var i=t.height,s=t.width,r=t.checked;this.t=t.handleDiameter||i-2,this.i=Math.max(s-i,s-(i+this.t)/2),this.o=Math.max(0,(i-this.t)/2),this.state={h:r?this.i:this.o},this.l=0,this.u=0,this.p=this.p.bind(this),this.v=this.v.bind(this),this.g=this.g.bind(this),this.k=this.k.bind(this),this.M=this.M.bind(this),this.m=this.m.bind(this),this.T=this.T.bind(this),this.$=this.$.bind(this),this.C=this.C.bind(this),this.O=this.O.bind(this),this.D=this.D.bind(this),this.S=this.S.bind(this)}return e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o,o.prototype.componentDidMount=function(){this.W=!0},o.prototype.componentDidUpdate=function(t){t.checked!==this.props.checked&&this.setState({h:this.props.checked?this.i:this.o})},o.prototype.componentWillUnmount=function(){this.W=!1},o.prototype.I=function(t){this.H.focus(),this.setState({j:t,R:!0,B:Date.now()})},o.prototype.L=function(t){var i=this.state,s=i.j,r=i.h,f=(this.props.checked?this.i:this.o)+t-s;i.N||t===s||this.setState({N:!0});var l=Math.min(this.i,Math.max(this.o,f));l!==r&&this.setState({h:l})},o.prototype.U=function(t){var i=this.state,s=i.h,r=i.N,f=i.B,l=this.props.checked,a=(this.i+this.o)/2;this.setState({h:this.props.checked?this.i:this.o});var c=Date.now()-f;(!r||c<250||l&&s<=a||!l&&s>=a)&&this.A(t),this.W&&this.setState({N:!1,R:!1}),this.l=Date.now()},o.prototype.p=function(t){t.preventDefault(),typeof t.button=="number"&&t.button!==0||(this.I(t.clientX),window.addEventListener("mousemove",this.v),window.addEventListener("mouseup",this.g))},o.prototype.v=function(t){t.preventDefault(),this.L(t.clientX)},o.prototype.g=function(t){this.U(t),window.removeEventListener("mousemove",this.v),window.removeEventListener("mouseup",this.g)},o.prototype.k=function(t){this.X=null,this.I(t.touches[0].clientX)},o.prototype.M=function(t){this.L(t.touches[0].clientX)},o.prototype.m=function(t){t.preventDefault(),this.U(t)},o.prototype.$=function(t){Date.now()-this.l>50&&(this.A(t),Date.now()-this.u>50&&this.W&&this.setState({R:!1}))},o.prototype.C=function(){this.u=Date.now()},o.prototype.O=function(){this.setState({R:!0})},o.prototype.D=function(){this.setState({R:!1})},o.prototype.S=function(t){this.H=t},o.prototype.T=function(t){t.preventDefault(),this.H.focus(),this.A(t),this.W&&this.setState({R:!1})},o.prototype.A=function(t){var i=this.props;(0,i.onChange)(!i.checked,t,i.id)},o.prototype.render=function(){var t=this.props,i=t.checked,s=t.disabled,r=t.className,f=t.offColor,l=t.onColor,a=t.offHandleColor,c=t.onHandleColor,x=t.checkedIcon,w=t.uncheckedIcon,b=t.checkedHandleIcon,D=t.uncheckedHandleIcon,_=t.boxShadow,S=t.activeBoxShadow,m=t.height,B=t.width,A=t.borderRadius,ue=function(v,Se){var F={};for(var R in v)Object.prototype.hasOwnProperty.call(v,R)&&Se.indexOf(R)===-1&&(F[R]=v[R]);return F}(t,["checked","disabled","className","offColor","onColor","offHandleColor","onHandleColor","checkedIcon","uncheckedIcon","checkedHandleIcon","uncheckedHandleIcon","boxShadow","activeBoxShadow","height","width","borderRadius","handleDiameter"]),L=this.state,y=L.h,h=L.N,be=L.R,me={position:"relative",display:"inline-block",textAlign:"left",opacity:s?.5:1,direction:"ltr",borderRadius:m/2,WebkitTransition:"opacity 0.25s",MozTransition:"opacity 0.25s",transition:"opacity 0.25s",touchAction:"none",WebkitTapHighlightColor:"rgba(0, 0, 0, 0)",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none",userSelect:"none"},we={height:m,width:B,margin:Math.max(0,(this.t-m)/2),position:"relative",background:ce(y,this.i,this.o,f,l),borderRadius:typeof A=="number"?A:m/2,cursor:s?"default":"pointer",WebkitTransition:h?null:"background 0.25s",MozTransition:h?null:"background 0.25s",transition:h?null:"background 0.25s"},ye={height:m,width:Math.min(1.5*m,B-(this.t+m)/2+1),position:"relative",opacity:(y-this.o)/(this.i-this.o),pointerEvents:"none",WebkitTransition:h?null:"opacity 0.25s",MozTransition:h?null:"opacity 0.25s",transition:h?null:"opacity 0.25s"},ve={height:m,width:Math.min(1.5*m,B-(this.t+m)/2+1),position:"absolute",opacity:1-(y-this.o)/(this.i-this.o),right:0,top:0,pointerEvents:"none",WebkitTransition:h?null:"opacity 0.25s",MozTransition:h?null:"opacity 0.25s",transition:h?null:"opacity 0.25s"},ke={height:this.t,width:this.t,background:ce(y,this.i,this.o,a,c),display:"inline-block",cursor:s?"default":"pointer",borderRadius:typeof A=="number"?A-1:"50%",position:"absolute",transform:"translateX("+y+"px)",top:Math.max(0,(m-this.t)/2),outline:0,boxShadow:be?S:_,border:0,WebkitTransition:h?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",MozTransition:h?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",transition:h?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s"},Ce={height:this.t,width:this.t,opacity:Math.max(2*(1-(y-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:h?null:"opacity 0.25s",MozTransition:h?null:"opacity 0.25s",transition:h?null:"opacity 0.25s"},Ee={height:this.t,width:this.t,opacity:Math.max(2*((y-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:h?null:"opacity 0.25s",MozTransition:h?null:"opacity 0.25s",transition:h?null:"opacity 0.25s"};return u.createElement("div",{className:r,style:me},u.createElement("div",{className:"react-switch-bg",style:we,onClick:s?null:this.T,onMouseDown:function(v){return v.preventDefault()}},x&&u.createElement("div",{style:ye},x),w&&u.createElement("div",{style:ve},w)),u.createElement("div",{className:"react-switch-handle",style:ke,onClick:function(v){return v.preventDefault()},onMouseDown:s?null:this.p,onTouchStart:s?null:this.k,onTouchMove:s?null:this.M,onTouchEnd:s?null:this.m,onTouchCancel:s?null:this.D},D&&u.createElement("div",{style:Ce},D),b&&u.createElement("div",{style:Ee},b)),u.createElement("input",j({},{type:"checkbox",role:"switch","aria-checked":i,checked:i,disabled:s,style:{border:0,clip:"rect(0 0 0 0)",height:1,margin:-1,overflow:"hidden",padding:0,position:"absolute",width:1}},ue,{ref:this.S,onFocus:this.O,onBlur:this.D,onKeyUp:this.C,onChange:this.$})))},o}(u.Component);pe.defaultProps={disabled:!1,offColor:"#888",onColor:"#080",offHandleColor:"#fff",onHandleColor:"#fff",uncheckedIcon:Ze,checkedIcon:Je,boxShadow:null,activeBoxShadow:"0 0 2px 3px #3bf",height:28,width:56},U.default=pe});var he=K((Ho,fe)=>{d();p();fe.exports=de()});d();p();d();p();var ee=W(Pe()),Te=async()=>(await navigator.gpu.requestAdapter()).requestAdapterInfo(),De=async()=>{try{let e=await Te();if(e.vendor==="intel")switch(e.architecture){case"gen-12.7":return!0;default:return!1}}catch{return!1}return!0},Ae=()=>!navigator.connection||navigator.connection?.effectiveType==="4g",H=async()=>await De()&&Ae(),Re=e=>{let o=ee.default.sentences(e,{newline_boundaries:!0,html_boundaries:!1,preserve_whitespace:!0});if(o.length>300)throw new Error("Way too many sentences, not processing this (we can choose to process this in batches in the future but we will not be able to hit our performance targets) ");return o},z=e=>{let t=(e.innerText??"").replace(/\xA0/g," ");return Re(t).map(r=>{let f=t.indexOf(r),l=f+r.length;return{start:f,end:l,sentence:r,elem:e}})};d();p();var te=["en.wikipedia.org","www.nytimes.com","medium.com","www.theguardian.com","www.britannica.com","www.sciencedirect.com","www.npr.org","www.wsj.com","www.bbc.com","www.cnn.com","www.nature.com","www.bbc.co.uk","hbr.org","www.forbes.com","www.investopedia.com","wikipedia","www.healthline.com","www.ft.com","www.newyorker.com","www.washingtonpost.com","www.theatlantic.com","en.m.wikipedia.org","www.bloomberg.com","www.history.com","www.reuters.com","www.economist.com","www.yahoo.com","www.espn.com","www.cbc.ca","www.cnbc.com","www.vox.com","www.geeksforgeeks.org","time.com","indianexpress.com","economictimes.indiatimes.com","timesofindia.indiatimes.com","www.siliconindia.com","www.dailymail.co.uk","www.dailywire.com","www.sciencedaily.com","www.thedailybeast.com","cnn.com","edition.cnn.com","money.cnn.com","cnnespanol.cnn.com","amp.cnn.com","finance.naver.com","finance.yahoo.com","ca.finance.yahoo.com","nytimes.com","archive.nytimes.com","thegraph.com","www.theguardian.com","amp.theguardian.com","news.artnet.com","news.blizzard.com","news.google.com","news.gov.bc.ca","news.harvard.edu","news.mit.edu","news.mongabay.com","news.stanford.edu","news.sky.com","news.un.org","news.va.gov","news.yahoo.co.jp","news.yahoo.com","www.bbc.com","www.bbcearth.com","www.foxnews.com","www.foxbusiness.com","www.newsweek.com","www.livemint.com","people.com","www.hindustantimes.com","www.thehindu.com","epaper.thehindu.com","www.usatoday.com","nypost.com","www.thesun.co.uk","www.thesaurus.com","www.washingtonpost.com","www.smashingmagazine.com","www.forbes.com","www.ndtv.com","link.cnbc.com","cn.wsj.com","www.businesswire.com","www.businessnewsdaily.com","www.businessinsider.com","www.businessinsider.in","www.independent.co.uk","www.theverge.com"];var oe=window.location.hostname.replace(/^www\./,""),ie=(e,o)=>G("/salience/rank-sentences-by-salience",{sentences:e,modelName:o}),We=()=>{let e=new URL(window.location.href).hostname;return te.includes(e)},bt=async()=>await N("ceKeypointsExtraction")==="enabled",mt=async()=>{try{let e=await N("ceKeypointsExtraction"),o=await E();return e!=="enabled"||!We()||o.disabled_websites.includes(oe)?!1:(o.enabled_websites.includes(oe),!0)}catch(e){return console.warn("Errors in isKeypointsEnabled. Error = ",e),!1}},Y=X("summarize",{getInitialState:async()=>({ranking_mechanism:"all",enabled_by_default:!0,threshold:1,model:await H()?"gte":"gte_quantized",disabled_websites:[],enabled_websites:[]})});var _e=()=>Y.get("ranking_mechanism"),E=async()=>Y.getAll(),T=async(e,o)=>Y.set(e,o),wt=async e=>{let{enabledWebsites:o,disabledWebsites:t}=await E().then(i=>({enabledWebsites:i.enabled_websites||[],disabledWebsites:i.disabled_websites||[]}));o.includes(e)&&await Le(e),await T("disabled_websites",[...t,e])};var Be=async e=>{let t=(await E().then(i=>i.disabled_websites)).filter(i=>i!==e);await T("disabled_websites",t),t.includes(e)||O("init",{},"keypoint-extraction")},yt=async e=>{let{enabledWebsites:o,disabledWebsites:t}=await E().then(i=>({enabledWebsites:i.enabled_websites||[],disabledWebsites:i.disabled_websites||[]}));t.includes(e)&&await Be(e),await T("enabled_websites",[...o,e])},Le=async e=>{let{enabledWebsites:o,disabledWebsites:t}=await E().then(s=>({enabledWebsites:s.enabled_websites||[],disabledWebsites:s.disabled_websites||[]})),i=o.filter(s=>s!==e);await T("enabled_websites",i),await T("disabled_websites",[...t,e]),i.includes(e)||O("destroy",{},"keypoint-extraction")},Ie=async e=>{let o=ne(e),t=[],i=[];for(let a of o){if(a===o[o.length-1]){i.push(a),t.push(i);break}["H1","H2","H3","H4","H5","H6"].includes(a.tagName)?i.length>0&&(t.push(i),i=[]):i.push(a)}let s=[];for(let a of t){let c=a.map(x=>z(x)).flat();s.push(c)}let r=s.map(a=>a.map(c=>c.sentence)),f=await ie(r,(await E()).model);return s.map((a,c)=>{let x=f.importantSentences[c];return a.map((w,b)=>({...w,score:Array.isArray(x)?x[b]?.score??0:x?.score??0}))}).flat()},ne=e=>e.filter(o=>!(["PRE","CODE","TABLE"].includes(o.tagName)||o.id?.toLowerCase().startsWith("cite")||o.childNodes.length>0&&Array.from(o.childNodes).every(t=>(t.textContent??"").trim()===""?!0:t instanceof Element&&["PRE","CODE","CITE"].includes(t.tagName)))),Oe=async e=>{let t=ne(e).map(a=>z(a)).flat(),i=t.map(a=>a.sentence);await H()||(i=i.slice(0,96));let s=32,r=[];for(let a=0;a<i.length;a+=s){let c=i.slice(a,a+s);r.push(await ie([c],(await E()).model))}let f=r.map(a=>a.importantSentences[0]).flat();return t.map((a,c)=>({...a,score:f[c]?.score??0,textRank:!1}))},vt=async e=>await _e()==="all"?Oe(e):Ie(e);d();p();d();p();var At={collapsed:178,pdf:102,compact:158,upsell:400,expanded:364},Rt={collapsed:400,pdf:148,compact:272,upsell:436,expanded:400},Wt=20;d();p();var P=W(I());d();p();var se=e=>preactH(V,{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14 9C14 11.7614 11.7614 14 9 14C6.23858 14 4 11.7614 4 9C4 6.23858 6.23858 4 9 4C11.7614 4 14 6.23858 14 9ZM13.1927 14.606C12.0241 15.4814 10.5726 16 9 16C5.13401 16 2 12.866 2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9C16 10.5721 15.4818 12.0231 14.6068 13.1916L17.7914 16.3762C18.1819 16.7668 18.1819 17.3999 17.7914 17.7904C17.4009 18.181 16.7677 18.181 16.3772 17.7904L13.1927 14.606Z",fill:"#AFB9C8"}));var $e=k`
  0% {
    opacity: 0;
    transform: translateX(60px);
    visibility: hidden;
  }
  1% {
    visibility: visible;
  }
  100% {
    opacity: 1;
    transform: translateX(0);
    visibility: visible;
  }`,Me=k`
  from {
    transform: translateY(-200%);
  }
  to {
    transform: translateY(0);
  }`,Ne=k`
  from {
    transform: translateY(200%);
  }
  to {
    transform: translateY(0);
  }`,ae=k`
  from {
    opacity: 0.6;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }`,He=k`
  0% {
    transform: translate(-50%, -50%) translateX(-3px);
  }
  100% {
    transform: translate(-50%, -50%) translateX(0px);
  }
`,ze=()=>k`
 0% {
   background: ${g.bgPrimInvBW};
 }
 33% {
  background: ${g.sfActElectricBlue};
 }
 66% {
  background: ${g.sfActElectricBlue};
 }
 100% {
  background: ${g.bgPrimInvBW};
 }
`,re=n.button`
  background: #1e1e1f;
  border-radius: 50%;
  border: none;
  box-shadow: 0px 0px 0px 0px rgba(106, 120, 252, 0.5), 0px 0px 2px 0px rgba(106, 120, 252, 0.49),
    0px 0px 3px 0px rgba(106, 120, 252, 0.43), 0px 0px 4px 0px rgba(106, 120, 252, 0.25),
    0px 0px 4px 0px rgba(106, 120, 252, 0.07), 0px 0px 5px 0px rgba(106, 120, 252, 0.01);
  cursor: pointer;
  display: grid;
  height: 40px;
  left: 0;
  outline: none;
  place-items: center;
  position: relative;
  width: 40px;

  & > svg {
    height: 24px;
    width: 24px;
  }
`,Zt=n(re)`
  background-color: ${({backgroundColor:e="#171515"})=>e};
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;

  & > svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 24px;
    width: 24px;
    transition: opacity 0.3s ease;
  }

  & > svg.off-icon {
    opacity: ${({enabled:e})=>e?0:1};
  }

  & > svg.on-icon {
    opacity: ${({enabled:e})=>e?1:0};
    animation: ${({enabled:e})=>e?He:void 0} 0.3s ease-in-out 1;
  }
`,Jt=n("div")`
  display: flex;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  border-radius: 9999px;
  background: #1e1e1f;

  /* pill_glow_dark */
  box-shadow: 0px 0px 5px 0px rgba(106, 120, 252, 0.01), 0px 0px 4px 0px rgba(106, 120, 252, 0.07),
    0px 0px 4px 0px rgba(106, 120, 252, 0.25), 0px 0px 3px 0px rgba(106, 120, 252, 0.43),
    0px 0px 2px 0px rgba(106, 120, 252, 0.49), 0px 0px 0px 0px rgba(106, 120, 252, 0.5);

  & > svg {
    height: 24px;
    width: 24px;
  }

  & > span {
    font-family: 'ABCDiatype';
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 133.333% */
    letter-spacing: 0.12px;
    color: ${({enabled:e})=>e?"#23AE75":"#9899A6"};
  }

  &:hover {
    background: ${({enabled:e})=>e?"#252627":"#1E1E1F"};
    & > span {
      opacity: 0.75;
    }
    & > svg {
      opacity: 0.75;
    }
  }

  &:active {
    background: ${({enabled:e})=>e?"#343537":"#1E1E1F"};
    & > span {
      opacity: 0.5;
    }
    & > svg {
      opacity: 0.5;
    }
  }
`,Qt=n(re)`
  animation: 0.05s
    ${({visible:e=!1,direction:o="down"})=>e?o==="up"?Ne:Me:void 0}
    0.35s ease-out;
  width: 40px;
  height: 40px;
  animation-fill-mode: forwards;
  transform: ${({visible:e=!1,direction:o="down"})=>e?o==="up"?"translateY(200%)":"translateY(-200%)":void 0};

  &:hover {
    svg {
      opacity: 0.75;
    }
  }

  &:active {
    svg {
      opacity: 0.5;
    }
  }

  & > svg {
    height: 20px;
    width: 20px;
    ${({direction:e="down"})=>e==="up"?"transform:rotateZ(180deg)":""}
  }
`,eo=n.div`
  font-family: ABCDiatype, sans-serif;
  height: 100%;
  min-width: 240px;
  padding: 0;
  width: 100%;
`,to=n(C)`
  animation: ${({visible:e=!1})=>e?ae:void 0} 0.2s ease-out;
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0px 0px 0px 0px rgba(106, 120, 252, 0.5), 0px 0px 2px 0px rgba(106, 120, 252, 0.49),
    0px 0px 3px 0px rgba(106, 120, 252, 0.43), 0px 0px 4px 0px rgba(106, 120, 252, 0.25),
    0px 0px 4px 0px rgba(106, 120, 252, 0.07), 0px 0px 5px 0px rgba(106, 120, 252, 0.01);
  cursor: default;
  ${({showOnRight:e=!1})=>e?"left: 60px;":"right: 60px;"}
  ${({route:e,showPointer:o})=>!e?.startsWith("/voices")&&!o&&"overflow: hidden;"}
  position: absolute;
  top: ${({route:e})=>e?.startsWith("/pillreport")?"80px":e?.startsWith("/featureprompt/skipsentences")?"10px":"20px"};
  visibility: ${({visible:e=!1})=>e?"visible":"hidden"};

  ${({showPointer:e,showOnRight:o})=>e?`
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        ${o?`
              left: -8px;
              border-right: 8px solid #1e1e1e;
            `:`
              right: -8px;
              border-left: 8px solid #1e1e1e;
            `}
        transform: translateY(-50%);
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
      }
    `:""}
`,oo=n.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: ${({aligned:e})=>e};
`,io=n.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
  align-items: center;
`,no=n(Q)`
  width: 160px;
  height: 48px;
  align-items: center;
  justify-content: center;
  font-family: 'ABCDiatype';
  font-weight: 700;
  font-size: 16px;
  margin-top: 18px;
`,so=n.div`
  align-items: center;
  border-radius: 8px;

  display: flex;
  gap: 8px;

  img {
    border-radius: 2px;
    height: 20px;
    overflow: hidden;
    width: 20px;
  }

  svg {
    fill: #afb9c8;
    width: 20px;
    height: 20px;
  }
`,ao=n.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.14px;
  line-height: 24px;
  font-family: 'ABCDiatype';
`,ro=n.div`
  align-items: center;
  display: flex;
  padding: 0;
  margin: -2px 0 0 0;
`,lo=n.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-family: ABCDiatype;
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  justify-content: center;
  height: 20px;
  line-height: 20px;
  text-align: center;
  width: 48px;
`,co=n.span`
  color: #8791a0;
  font-weight: 500;
`,po=n.div`
  align-items: center;
  display: flex;
  justify-content: center;

  &.left {
    text-align: right;
  }

  &.right {
    text-align: left;
  }
`,fo=({alignLeft:e,onClose:o,onSearch:t,title:i})=>preactH(Ke,null,t&&preactH(je,{onClick:t},preactH(se,{fill:g.icnTxtSec})),preactH(Fe,{alignLeft:e},i),preactH(Ue,{alignLeft:e},preactH(Ye,{"data-testId":"Close Side Panel",onClick:o},preactH(M,{fill:g.icnTxtSec})))),Ye=n.button`
  background: unset;
  border: unset;
  color: #fff;
  cursor: pointer;
  display: flex;
  outline: unset;
  padding: 0;

  > svg {
    width: 24px !important;
    height: 24px !important;
    margin-top: 4px;
  }
`,je=n.button`
  background: unset;
  border: unset;
  cursor: pointer;
  display: flex;
  outline: unset;
  align-items: flex-start;
  gap: 0px;
  padding: 0px;
  margin-top: 0px;
`,Ue=n.div`
  position: absolute;
  right: ${({alignLeft:e})=>e?"4px":"16px"};
  top: 8px;
`,Fe=n.div`
  align-items: center;
  color: #fff;
  display: flex;
  flex: 1 0 0;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  gap: 6px;
  justify-content: ${({alignLeft:e})=>e?"flex-start":"center"};
  letter-spacing: 0.16px;
  line-height: 24px;
  text-align: ${({alignLeft:e})=>e?"left":"center"};
`,Ke=n.div`
  align-items: center;
  align-self: stretch;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  padding: 12px 16px;
  position: relative;
`,ho={AbsoluteCloseIcon:n(M)`
    cursor: pointer;
    fill: #9899a6;
    position: absolute;
    right: 12px;
    top: 6px;

    &:hover {
      fill: #fff;
    }
  `,Container:n.div`
    align-items: flex-start;
    align-self: stretch;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,Header:n.div`
    display: flex;
    align-items: center;
    gap: 8px;
  `,HeaderLogo:n.div`
    display: flex;
    width: 115.63px;
    height: 20px;
    padding-right: 0.09px;
    justify-content: center;
    align-items: flex-end;
    gap: 4.36px;
  `,Body:n.div`
    align-items: flex-start;
    align-self: stretch;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    gap: 8px;
    letter-spacing: -0.08px;
    line-height: 24px;
    width: 230px;
  `,Footer:n.div`
    display: flex;
    align-items: center;
    align-self: stretch;
    justify-content: flex-end;
    gap: 4px;
    color: #747580;
    font-size: 14px;
    font-weight: 400;
    font-style: normal;
    line-height: 20px;
    letter-spacing: -0.07px;
  `,Key:n.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 26px;
    height: 16px;
    padding: 2px;
    gap: 0;
    background: #2d2d2f;
    border-radius: 4px;
    color: #e9eaf0;
    font-size: 12px;
    font-weight: 400;
    font-style: normal;
    line-height: 16px;
    letter-spacing: 0.12px;
    text-align: center;
  `,DownloadButton:n.button`
    align-items: center;
    align-self: stretch;
    background: #2d2d2f;
    border-radius: 10px;
    border: none;
    color: #fff;
    cursor: pointer;
    display: flex;
    font-family: ABCDiatype, sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    gap: 6px;
    justify-content: center;
    letter-spacing: -0.07px;
    line-height: 20px;
    padding: 8px 16px 8px 20px;

    &:hover {
      background: #343537;
    }

    &:active {
      background: #3c3c3e;
    }
  `,DownloadButtonIcon:n.div`
    align-items: flex-start;
    display: flex;
    gap: 0px;
    height: 20px;
    padding: 0px;
  `,UpsellButton:n.button`
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: center;
    padding: 8px 20px 8px 16px;
    width: 100%;

    color: #000;
    font-family: ABCDiatype, sans-serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0.14px;

    background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
      radial-gradient(
        113.68% 113.68% at 84.82% -14.29%,
        rgba(255, 230, 0, 0.8) 0%,
        rgba(255, 149, 0, 0) 100%
      ),
      radial-gradient(
        97.58% 151.79% at -6.25% 114.29%,
        rgba(255, 26, 150, 0.4) 0%,
        rgba(250, 0, 255, 0.03) 84.18%,
        rgba(250, 0, 255, 0) 100%
      ),
      linear-gradient(283deg, #ffa82f 0.25%, #ff795b 100%);
    background-blend-mode: overlay, normal, normal, normal;
    border: none;
    border-radius: 10px;
    cursor: pointer;

    svg {
      fill: #000;
      width: 20px;
      height: 20px;

      path {
        fill: #000;
      }
    }

    &:hover {
      opacity: 0.75;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
        radial-gradient(
          113.68% 113.68% at 84.82% -14.29%,
          rgba(255, 230, 0, 0.8) 0%,
          rgba(255, 149, 0, 0) 100%
        ),
        radial-gradient(
          97.58% 151.79% at -6.25% 114.29%,
          rgba(255, 26, 150, 0.4) 0%,
          rgba(250, 0, 255, 0.03) 84.18%,
          rgba(250, 0, 255, 0) 100%
        ),
        linear-gradient(283deg, #ffa82f 0.25%, #ff795b 100%);
    }

    &:active {
      opacity: 0.5;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
        radial-gradient(
          113.68% 113.68% at 84.82% -14.29%,
          rgba(255, 230, 0, 0.8) 0%,
          rgba(255, 149, 0, 0) 100%
        ),
        radial-gradient(
          97.58% 151.79% at -6.25% 114.29%,
          rgba(255, 26, 150, 0.4) 0%,
          rgba(250, 0, 255, 0.03) 84.18%,
          rgba(250, 0, 255, 0) 100%
        ),
        linear-gradient(283deg, #ffa82f 0.25%, #ff795b 100%);
    }
  `},xo=n.div`
  font-family: ABCDiatype, sans-serif;
  height: 100%;
  min-width: 230px;
  padding: 0;
  width: 100%;
`,go=n(C)`
  animation: ${({visible:e=!1})=>e?ae:void 0} 0.2s ease-out;
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0px 0px 0px 0px rgba(106, 120, 252, 0.5), 0px 0px 2px 0px rgba(106, 120, 252, 0.49),
    0px 0px 3px 0px rgba(106, 120, 252, 0.43), 0px 0px 4px 0px rgba(106, 120, 252, 0.25),
    0px 0px 4px 0px rgba(106, 120, 252, 0.07), 0px 0px 5px 0px rgba(106, 120, 252, 0.01);

  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.32);

  color: #fff;
  cursor: default;
  ${({showOnRight:e=!1})=>e?"left: 60px;":"right: 60px"};
  overflow: hidden;
  position: absolute;
  top: -12px;
  visibility: ${({visible:e=!1})=>e?"visible":"hidden"};
`,Xe=n.div`
  background: #1e1e1e;
  border-radius: 8px;
  color: #fff;
  font-family: ABCDiatype;
  font-size: 12px;
  font-weight: 400;
  ${({showOnRight:e=!1})=>e?"left: 50px;":"right: 50px"};
  letter-spacing: 0.12px;
  line-height: 16px;
  padding: 8px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: max-content;
  z-index: 1;

  // tooltip tip
  &:before {
    content: ' ';
    position: absolute;
    ${({showOnRight:e=!1})=>e?"left: -8px":"right: -8px"};
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    ${({showOnRight:e=!1})=>e?"border-right: 4px solid #1e1e1e;":"border-left: 4px solid #1e1e1e;"};
  }
`,Ge=n.div`
  position: ${({disableRelative:e,isAbsolute:o})=>o?"absolute":e?"static":"relative"};
  opacity: ${({visible:e})=>e?1:0};
  ${({visible:e})=>!e&&"pointer-events: none;"}
  transition: opacity 0.15s ease-in-out;
  display: flex;
  align-items: center;
  ${({isPlayButton:e})=>e&&"height: 36px;"}
  ${({isTop:e})=>e?"top: -48px;":"bottom: 0;"}
  z-index: 9998;
`,uo=n(C)`
  align-items: center;
  color: ${g.icnTxtPrim};
  cursor: default;
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: ${({playerContainerHeight:e})=>`${e}px`};
  transition: height 0.15s ease-in-out;

  .pill-player-bottom-section {
    opacity: 1;
    transition: opacity 0.05s ease-in-out forwards;
    will-change: opacity;
  }

  &.animating {
    .pill-player-bottom-section {
      opacity: 0;
    }
  }
`,bo=n(C)`
  z-index: 9999;
  padding-bottom: 8px;
  position: relative;
  cursor: move;
`,mo=n(C)`
  z-index: 9999;
  background-color: #1e1e1f;
  padding: 12px 0 8px;
  border-radius: 100px;
  position: relative;
  cursor: move;
  box-shadow: 0px 0px 0px 0px rgba(106, 120, 252, 0.5), 0px 0px 2px 0px rgba(106, 120, 252, 0.49),
    0px 0px 3px 0px rgba(106, 120, 252, 0.43), 0px 0px 4px 0px rgba(106, 120, 252, 0.25),
    0px 0px 4px 0px rgba(106, 120, 252, 0.07), 0px 0px 5px 0px rgba(106, 120, 252, 0.01);
`,wo=n.div`
  align-items: center;
  animation: ${({animate:e=!1})=>e?$e:void 0} 0.08s ease-out 0.08s
    forwards;
  display: flex;
  flex-direction: column;
  gap: 8px;
  visibility: hidden;
  visibility: ${({animate:e=!1})=>e?"hidden":"visible"};
  position: relative;
`,yo=n.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
`,vo=n.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
`,ko=n.div`
  display: ${({visible:e})=>e?"flex":"none"};
  flex-direction: column;
  gap: 4px;
  max-height: ${({visible:e})=>e?"120px":"0px"};
  transition: max-height 0.2s ease-in-out;

  &.dismiss {
    bottom: 6px;
    position: absolute;
  }
`,Co=n.div`
  position: relative;
`,Eo=n.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  align-items: center;
  gap: 8px;
  bottom: ${({showScrollDown:e,showAutoToggle:o})=>e&&o?"-108px":e&&!o?"-40px":!e&&o?"-60px":"0px"};
`,So=n.div`
  background-color: #2d2d2f;
  display: block;
  height: 2px;
  max-height: 2px;
  border-radius: 2px;
  width: 60%;
`,Po=n.div`
  height: 14px;
  position: absolute;
  right: -4px;
  top: -4px;
  width: 12px;
`,To=n.div`
  display: flex;
  gap: 50px;
  justify-content: space-between;
  margin-top: 32px;
  align-items: center;
  height: 48px;

  button {
    border: 1px solid #1e1e1e;
    background-color: #1e1e1e;
    border-radius: 8px;
    color: #ffffff;
    font-family: ABCDiatype, sans-serif;
    height: 48px;
    align-items: center;
    justify-content: center;
    font-family: 'ABCDiatype';
    font-weight: 700;
    font-size: 16px;

    &:hover {
      background-color: #2e2e2e;
      border-color: #2e2e2e;
      color: #ffffff;
    }

    &:active {
      background-color: #383838;
      border-color: #383838;
      color: #ffffff;
    }

    &.settings {
      padding: 8px 28px 8px 24px;
    }

    &[type='submit'] {
      background-color: #6b78fc;
      border-color: #6b78fc;
      color: #ffffff;

      &:hover {
        background-color: #9ba3ff;
        border-color: #9ba3ff;
      }

      &:active {
        background-color: #6870cc;
        border-color: #6870cc;
      }
    }
  }

  svg {
    fill: #ffffff;
    height: 20px;
    width: 20px;
    margin-right: 8px;
  }

  .right-aligned {
    margin-left: auto;
    display: flex;
    gap: 12px;
  }
`,Do=n.div`
  display: flex;
  gap: 16px;

  button {
    border: 1px solid #1e1e1e;
    background-color: #1e1e1e;
    border-radius: 8px;
    color: #ffffff;
    font-family: ABCDiatype, sans-serif;
    height: 48px;
    align-items: center;
    justify-content: center;
    font-family: 'ABCDiatype';
    font-weight: 700;
    font-size: 16px;

    &:hover {
      background-color: #2e2e2e;
      border-color: #2e2e2e;
      color: #ffffff;
    }

    &:active {
      background-color: #383838;
      border-color: #383838;
      color: #ffffff;
    }

    &[type='submit'] {
      background-color: #6b78fc;
      border-color: #6b78fc;
      color: #ffffff;

      &:hover {
        background-color: #9ba3ff;
        border-color: #9ba3ff;
      }

      &:active {
        background-color: #6870cc;
        border-color: #6870cc;
      }
    }
  }

  svg {
    fill: #ffffff;
    height: 20px;
    width: 20px;
    margin-right: 8px;
  }

  .right-aligned {
    margin-left: auto;
    display: flex;
    gap: 12px;
  }
`,Ao=n(q)`
  fill: #fff;
  max-width: 18px !important;
  max-height: 18px !important;
`,Ro=n(Z)`
  fill: #fff;
  max-width: 18px !important;
  max-height: 18px !important;
`,Ve=n(C)`
  display: inline-flex;
  gap: 2px;
  margin-left: 6px;
`,qe=n.kbd`
  font-family: system-ui;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 20px;
  min-width: 20px;
  padding: 0px 5px;
  box-sizing: border-box;
  background: #373737;
  border: 1px solid #505050;
  border-radius: 4px;
`,Wo=({keys:e})=>{let o=(0,P.useMemo)(()=>e.split("+"),[e]);return preactH(Ve,null,o.map(t=>preactH(qe,{key:t},t)))},_o=n.span`
  width: 6px;
  height: 6px;
  border-radius: 100%;

  background: ${g.sfActElectricBlue};
  animation: ${ze} 1.2s infinite;

  &:nth-of-type(2) {
    animation-delay: -0.8s;
  }

  &:nth-of-type(3) {
    animation-delay: -1.6s;
  }
`;var Bo=({children:e,disabled:o,text:t,showOnRight:i=!1,visible:s=!0,forceShow:r=!1,...f})=>{let{onMouseLeave:l,onMouseEnter:a,showTooltip:c}=J(),[x,w]=(0,P.useState)(!1),b=()=>w(!0);return(0,P.useEffect)(()=>{x&&setTimeout(()=>{w(!1)},500)},[x]),preactH(Ge,{onClick:b,onMouseLeave:l,onMouseEnter:a,...f,visible:s},(c&&!x||r)&&!o&&t&&preactH(Xe,{showOnRight:i},t),e)};d();p();var xe=W(I()),ge=W(he());var Qe=n.div`
  line-height: 0;
`,Go=({checked:e,disabled:o,onChange:t,height:i,width:s,id:r})=>{let f=(0,xe.useCallback)((l,a,c)=>{a.stopPropagation(),t&&t(l,a,c)},[t]);return preactH(Qe,{"data-testid":$.TOGGLE_GLOBAL_FEATURE_SWITCH,onClick:l=>l.stopPropagation()},preactH(ge.default,{id:r,checked:!!e,disabled:o,onChange:f,offColor:g.bgTert1080,onColor:o?g.bgTert1080:g.sfPrimCta,onHandleColor:g.icnTxtPrim,offHandleColor:g.icnTxtPrim,boxShadow:"0px 4px 4px rgba(0, 0, 0, 0.11)",activeBoxShadow:"0px 4px 4px rgba(0, 0, 0, 0.11)",checkedIcon:!1,uncheckedIcon:!1,height:i??20,width:s??36,"data-testid":$.FEATURE_SWITCH}))};export{Go as a,At as b,Rt as c,Wt as d,Jt as e,Qt as f,eo as g,to as h,oo as i,io as j,no as k,so as l,ao as m,ro as n,lo as o,co as p,po as q,fo as r,Fe as s,ho as t,xo as u,go as v,uo as w,bo as x,mo as y,wo as z,yo as A,vo as B,ko as C,Co as D,Eo as E,So as F,Po as G,To as H,Do as I,Ao as J,Ro as K,Wo as L,Bo as M,Ae as N,bt as O,mt as P,Y as Q,E as R,T as S,wt as T,yt as U,Le as V,vt as W};
//# sourceMappingURL=chunk-QEP7SRH7.js.map
