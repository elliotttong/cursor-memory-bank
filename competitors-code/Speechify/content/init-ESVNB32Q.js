import{a as Tt}from"./chunk-OHQEXS5W.js";import{a as wt,b as Se,e as ce,f as X,g as St,i as bt}from"./chunk-WSODYGO2.js";import{b as It}from"./chunk-GNHJLEP4.js";import"./chunk-7D3ZJIMI.js";import{a as tt}from"./chunk-BVP7ZEFD.js";import{a as et}from"./chunk-TVWAVI6A.js";import"./chunk-BD5GYQVX.js";import{$a as D,Ac as yt,Ba as Fe,Gc as Pt,Ja as Ge,Na as We,Nb as we,Ra as Pe,Sa as $e,Ta as ze,Va as Ze,Wc as Et,Xc as vt,Za as qe,Zc as Rt,_a as k,_b as L,ac as rt,cb as Xe,db as se,ec as ot,fb as ve,fc as nt,gb as Re,gc as it,hc as at,ic as lt,ja as Ve,jc as st,k as Be,kc as ct,lb as Ie,lc as dt,mc as ft,nc as ut,oc as mt,pc as pt,sb as Qe,sc as ht,tb as Je,uc as gt}from"./chunk-6VFX2JNU.js";import{k as He,q as De,r as Ye,t as Ue}from"./chunk-LUKOAFYK.js";import{L as Me,i as ke}from"./chunk-O77QQVYU.js";import{x as Ce}from"./chunk-35EEQS33.js";import{i as jt}from"./chunk-BGIN6QNH.js";import"./chunk-UQBFOPQH.js";import{d as ye}from"./chunk-6HLOLWYC.js";import"./chunk-XFWXZVUM.js";import"./chunk-D2ACMGPV.js";import{b as le,c as Ee,g as je,j as Ke,k as U}from"./chunk-NORECDYR.js";import{b as Y,f as qt,g as Xt}from"./chunk-RQERJHUS.js";import{d as ae,h as E,j as preactH,l as Le,n as Zt,o as v}from"./chunk-NUN3A7RC.js";v();E();v();E();var M=ae(He());Zt();v();E();var S=ae(Xt()),Ct=ae(He());qt();v();E();var xt=e=>preactH("svg",{"aria-label":"Speechify Inline player Play button","data-test":"Paragraph/Hover Player Play Button",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e},preactH("g",{clipPath:"url(#clip0_19693_61227)"},preactH("circle",{cx:"12",cy:"12",r:"12",fill:"#4759F7"}),preactH("path",{d:"M16.5 11.134C17.1667 11.5189 17.1667 12.4811 16.5 12.866L10.5 16.3301C9.83333 16.715 9 16.2339 9 15.4641L9 8.53592C9 7.76611 9.83333 7.28499 10.5 7.66989L16.5 11.134Z",fill:"white"})),preactH("defs",null,preactH("clipPath",{id:"clip0_19693_61227"},preactH("rect",{width:"24",height:"24",fill:"white"})))),Ot=e=>preactH("svg",{"aria-label":"Speechify Inline player Pause button","data-test":"Paragraph Player Pause Button",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e},preactH("g",{clipPath:"url(#clip0_20845_46272)"},preactH("circle",{cx:"12",cy:"12",r:"12",fill:"#4759F7"}),preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8.8 7C8.35817 7 8 7.35817 8 7.8V16.2C8 16.6418 8.35817 17 8.8 17H10.2C10.6418 17 11 16.6418 11 16.2V7.8C11 7.35817 10.6418 7 10.2 7H8.8ZM13.8 7C13.3582 7 13 7.35817 13 7.8V16.2C13 16.6418 13.3582 17 13.8 17H15.2C15.6418 17 16 16.6418 16 16.2V7.8C16 7.35817 15.6418 7 15.2 7H13.8Z",fill:"white"})),preactH("defs",null,preactH("clipPath",{id:"clip0_20845_46272"},preactH("rect",{width:"24",height:"24",fill:"white"}))));var Ht=ae(jt());v();E();var _t="speechify-hover-player-icon";var{usePlayingState:Qt,useBundleInfo:Jt}=D;var Nt=2147483640,er=U.button`
  position: absolute;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  pointer-events: all;

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .fadeOut {
    animation-name: fadeOut;
    animation-duration: ${200}ms;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
  }

  .fadeIn {
    animation-name: fadeIn;
    animation-timing-function: ease-out;
    animation-duration: ${100}ms;
    animation-fill-mode: forwards;
  }

  .icon {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    position: absolute;
    color: ${le.icnTxtPrim};
    background: #4759f7;
    &:hover {
      background: #4454e3;
    }

    > .play-pause-icon-svg {
      cursor: pointer;
      width: 100%;
      height: 100%;
    }

    .circularProgress {
      position: absolute;
      width: calc(100% + 2px + 1.75px); /* Increased by stroke width */
      height: calc(100% + 2px + 1.75px); /* Increased by stroke width */
      top: calc(-1px - 0.875px); /* Offset decreased by half stroke width */
      left: calc(-1px - 0.875px); /* Offset decreased by half stroke width */
      animation-name: loading;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
  }
`,tr=Ke`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`,rr=U.div`
  position: absolute;
  height: 3px;
  background: linear-gradient(90deg, #4759f7 52.5%, rgba(107, 120, 252, 0) 93.6%);
  border-radius: 4px 0 0 4px;
  opacity: 1;

  top: 0;
  left: 0;
  animation-fill-mode: forwards;
  animation: ${tr} ${100}ms ease-out;
  width: 100%;
`,or=U(Tt)`
  height: ${({size:e})=>e};
  left: -${4}px;
  top: -${4}px;
  width: ${({size:e})=>e};
  g circle {
    stroke-width: 3;
  }
`,be=e=>[e.ariaLabel,...Array.from(e.children).map(t=>be(t))].join(""),nr=(e,t)=>e?e===t.element||"isConnected"in e&&!e.isConnected&&be(e)===be(t.element):!1,ir=(e,t)=>{let o=(0,S.useCallback)(n=>setTimeout(()=>{t(d=>d.filter(i=>n.instanceId!==i.instanceId))},200),[]);Y(()=>{let n=e.filter(d=>!d.destroyingTimeout&&d.hoverPlayerState==="Initial").map(d=>d.instanceId);n.length>0&&t(d=>d.map(i=>n.includes(i.instanceId)?{...i,destroyingTimeout:o(i)}:i))},[e,o])};function kt({hoveredParagraph:e,emotionCache:t,wasLifecycleAudioLoadedTriggered:o,onPlaybackStarted:n}){let d=Ge(),i=Qt(),{bundle:c}=Jt(),{activeElement:f}=It(),[s,p]=(0,S.useState)(),[m,g]=(0,S.useState)([]);ir(m,g),Y(()=>{i!=="paused"&&i!=="stopped"&&n()},[i]);let H=(0,S.useCallback)(l=>{p(u=>u&&l(u)),g(u=>{let I=!1,h=u.map(b=>{let V=l(b);return I=I||V!==b,V});return I?h:u})},[]),_=(0,S.useCallback)((l,u)=>H(I=>I.instanceId!==l?I:u(I)),[]);Y(()=>{!e&&s&&(p(void 0),g(l=>[s,...l]))},[e,s]),Y(()=>{e&&(e.reactKey!==s?.hoveredParagraph.reactKey?(s&&g(l=>[s,...l].filter(u=>u.hoveredParagraph.reactKey!==e.reactKey)),p({instanceId:(0,Ct.uniqueId)(),hoveredParagraph:e,hoverPlayerState:"Initial",destroyingTimeout:void 0,buttonRef:(0,S.createRef)()})):e!==s.hoveredParagraph&&p(l=>l&&{...l,hoveredParagraph:e}))},[e,s]),Y(()=>{i==="buffering"||i==="seeking"||H(l=>l.hoverPlayerState!=="BufferingInProgress"?l:{...l,hoverPlayerState:"Initial"})},[i,H,s,m]);let $=(0,S.useCallback)(async()=>{if(s){if(n(),_(s.instanceId,l=>({...l,hoverPlayerState:"BufferingStarting"})),await tt(),L()){if(!c)throw new Error("bundle is not ready, but user wanted to play");qe(c,s.hoveredParagraph.element)}else{if(!s.hoveredParagraph.block)throw new Error("hoveredParagraph.block can be missing only in google docs");let l=Ht.CursorQueryBuilder.fromCursor(s.hoveredParagraph.block.start);k.seekToCursor(l),We(D.getPlayingState())||k.play()}yt("extension_hover_player_button_clicked",{isClonedVoice:d}),Pt({triggeredFrom:"HoverPlayer"}),await Ve(500),_(s.instanceId,l=>({...l,hoverPlayerState:"BufferingInProgress"}))}},[s,p,c]),N={x:window.scrollX,y:window.scrollY};return preactH(je,{value:t},[s,...m].map(l=>{if(!l)return null;let u=l===s,{getPlayerIconRect:I,getUnderlineRect:h}=l.hoveredParagraph,b=i==="buffering"||i==="seeking",V=m.some(Z=>Z.hoverPlayerState!=="Initial"),F=l.hoverPlayerState!=="Initial"||b&&u&&!V,T=I(),G=h(),z=nr(f,l.hoveredParagraph),re=z&&(i==="playing"||i==="buffering"||i==="seeking")&&!F;return preactH(S.default.Fragment,{key:l.hoveredParagraph.reactKey},u&&!o&&!F&&preactH("div",{style:{position:"absolute",top:G.top+N.y,left:G.x+N.x,width:G.width,zIndex:Nt}},preactH(rr,null)),preactH("div",{"aria-label":ve("HOVER_PLAYER"),"data-testid":u?Re.HOVER_PLAYER:void 0,style:{position:"absolute",left:`${T.left+N.x-4}px`,top:`${T.top+N.y}px`,width:`${T.width+2*4}px`,height:`${T.height+2*4}px`,zIndex:Nt}},preactH(er,{"aria-label":ve("HOVER_PLAYER_BUTTON"),"data-testid":u?Re.HOVER_PLAYER_BUTTON:void 0,onClick:()=>{u&&(re?k.pause():z?k.play():$())},ref:l.buttonRef,style:{position:"absolute",left:"0px",top:"0px",width:"100%",height:"100%"}},preactH("div",{id:u?_t:void 0,style:{width:`${T.width}px`,height:`${T.height}px`,left:`${4}px`,top:0},className:["icon",u||F?"fadeIn":"fadeOut"].join(" ")},re?preactH(Ot,{className:"play-pause-icon-svg"}):preactH(xt,{className:"play-pause-icon-svg"}),F&&preactH(or,{size:`${T.width+2*4}px`})))))}))}v();E();v();E();var ar=/^\s*$/,Dt=e=>e.nodeType===Node.TEXT_NODE&&!ar.test(e.textContent??""),Bt=e=>{if(!e)return null;if(Dt(e))return e;for(let t of Array.from(e.childNodes)){if(Dt(t))return t;let o=Bt(t);if(o!==null)return o}return null};function*Mt(e){if(e.nodeType===Node.TEXT_NODE){let t=e.textContent?.trim().split(" ")??"";for(let o of t)yield{node:e,word:o}}else for(let t=0;t<e.childNodes.length;t++)yield*Mt(e.childNodes[t])}var Te=(e,t)=>{if(!e||!Bt(e))return null;let o=document.createRange(),n=Mt(e),d=null,i="",c=0,f=1;for(;f<=t;){let s=n.next();if(s.done)return f<t&&o.setEnd(d,Math.min(c+i.length,d?.textContent?.length??0)),null;let{node:p,word:m}=s.value;if(!(!p||!m)){if(d!==p&&(c=0),f===1&&o.setStart(p,c),f===t){let g=(p.textContent?.indexOf(m,c)??0)+m.length;o.setEnd(p,Math.min(g,p.textContent?.length??0))}c+=m.length+1,i=m,d=p,f++}}return o};v();E();var xe=e=>{let t=Math.min(...e.map(f=>f.x)),o=Math.min(...e.map(f=>f.y)),n=Math.max(...e.map(f=>f.x+f.width)),d=Math.max(...e.map(f=>f.y+f.height)),i=n-t,c=d-o;return new DOMRect(t,o,i,c)},j=({rect:e,horizontalPadding:t,verticalPadding:o})=>new DOMRect(e.x-t,e.y-o,e.width+2*t,e.height+2*o);var B=De(Be({hoveredParagraph:null,shouldShowHint:!1},e=>({updateHoveredParagraph:t=>e(o=>({...o,hoveredParagraph:t})),updateShouldShowHint:t=>e(o=>({...o,shouldShowHint:t}))}))),de=({wasLifecycleAudioLoadedTriggered:e,block:t,element:o,index:n})=>{if(!o)return null;let d=Te(o,1),i=Te(o,3),c=()=>(d??o).getBoundingClientRect(),f=()=>(i??o).getBoundingClientRect();if(L()){let h=o.firstElementChild??o;f=()=>h.getBoundingClientRect(),c=()=>h.getBoundingClientRect()}let s=window.getComputedStyle(o),p=parseFloat(s.fontSize||"16")||16,m=Math.max(p,20),g=f(),H=new DOMRect(g.x-16,g.y,g.width+16,g.height),_=()=>{let h=c(),b=(h.height-m)/2;return new DOMRect(H.x-m,h.top+b,m,m)},$=()=>{let h=c();return new DOMRect(h.x,h.top+h.height,g.width+4,g.height)},N=j({rect:_(),horizontalPadding:4,verticalPadding:4}),l=xe([g,H,N]);e&&(l=xe([l,o.getBoundingClientRect()]));let u=j({rect:l,horizontalPadding:4,verticalPadding:0}),I=i?.toString();return{block:t,element:o,getUnderlineRect:$,elementFontSize:p,firstThreeWords:I,getFirstThreeWordsRect:f,hoverAreaRect:u,hoverPlayerSize:m,getPlayerIconRect:_,blockIndex:n,get reactKey(){return`${n}-${I}`}}};var Ft="speechify-hover-player-shadow-root",Gt="speechify-hover-player-container",K=null,C=null,Wt=Ee({key:"hover-player-emotion-cache"}),Oe=()=>{},fr="h1 h2 h3 h4 h5 h6 select textarea button label audio video dialog embed menu nav noframes noscript object script style svg aside footer #footer pre summary form input iframe img map meta link title track area base basefont col colgroup head html param source table tbody td tfoot th thead tr",ur="span a li ol ul h1 h2 h3 h4 h5 h6 select textarea button label audio video dialog embed menu nav noframes noscript object script style svg aside footer #footer pre summary form input iframe img map meta link title track area base basefont col colgroup head html param source table tbody td tfoot th thead tr",mr=e=>e.nodeType===Node.ELEMENT_NODE;async function pr(){return(await we("ceHoverPlayerIgnoredTags")||fr).split(" ").map(t=>t.toLowerCase())}async function hr(){return(await we("ceHoverPlayerTopLevelIgnoredTags")||ur).split(" ").map(t=>t.toLowerCase())}function Yt(e,t){return e.clientX>t.x&&e.clientX<t.x+t.width&&e.clientY>t.y&&e.clientY<t.y+t.height}function gr(){let t=document.getElementById("speechify-hint-tooltip-shadow-root")?.shadowRoot?.getElementById("speechify-hint-tooltip");if(t)return t.getBoundingClientRect()}function yr(e){let t=(0,M.debounce)(e,50),o=Je(`${$e} > svg`,(0,M.debounce)(e,500)),n=document.querySelector(Pe());return n.addEventListener("scroll",t,{passive:!0}),()=>{o(),n.removeEventListener("scroll",t)}}var Q=!1,Pr=()=>{let e=async()=>{Q=!0,Ue("audio-loading",e)};Ye("audio-loading",e,"hover-player")};Pr();async function fe(e){["boot","init"].includes(e)||(Q=!0);let t=[];if(K=document.querySelector(`#${Ft}`)?.shadowRoot??null,!K){let r=document.createElement("div");r.id=Ft,document.body.appendChild(r),K=r.attachShadow({mode:"open"})}C=K.querySelector(`#${Gt}`),C||(C=document.createElement("div"),C.id=Gt,Wt=Ee({key:"hover-player-emotion-cache",container:C}),K.appendChild(C));let{updateHoveredParagraph:o,updateShouldShowHint:n}=B.getState(),d=await ce("hover-player-hints"),i=await hr(),c=await pr(),f=r=>{let a=r.start.getParentElement().ref?.value?.ref;return!(!a||!mr(a)||i.includes(a.tagName.toLowerCase())||a.querySelector(c.join(","))!==null||r.text.text.trim().split(/\s+/).length<=10||a.closest("a, button, form"))};n(d);let s=()=>{n(!1),St("hover-player-hints")},p=r=>{if(!C){ye(new Error("hover-player renderTooltip is called with no container"),{type:"hover-player"});return}if(!B.getState().shouldShowHint||!r||!r.firstThreeWords){X("hover-player-hints");return}let a=r.getPlayerIconRect();bt({key:r?.reactKey??"hover-player-hint-null",hintId:"hover-player-hints",anchorElement:null,text:"Hover over the first three words of any paragraph and click the “Play” button to start listening",xOffset:a.x+wt*-1+Se*-1+Se/2*-1+a.width/2,yOffset:a.y-14,closable:!0,maxWidth:"350px",onClose:s})},m=r=>{if(!C){ye(new Error("hover-player renderHoverPlayer is called with no container"),{type:"hover-player"});return}Le(preactH(kt,{hoveredParagraph:r,emotionCache:Wt,wasLifecycleAudioLoadedTriggered:Q,onPlaybackStarted:()=>s()}),C)},g=()=>{m(null)},H=async()=>{if(!t||t.length===0)return;Oe();let r=(0,M.debounce)(a=>{let w=t.map(({element:y,block:R},A)=>de({wasLifecycleAudioLoadedTriggered:Q,element:y,block:R,index:A})).filter(y=>!!y).find(({hoverAreaRect:y})=>Yt(a,y));if(B.getState().shouldShowHint){if(!w)return;let y=gr(),R=y&&j({rect:y,horizontalPadding:10,verticalPadding:10});if(R&&Yt(a,R))return}o(w??null)},16);window.addEventListener("mousemove",r),Oe=()=>{window.removeEventListener("mousemove",r)},t?.length>0&&d&&I(de({wasLifecycleAudioLoadedTriggered:Q,element:t[0].element,block:t[0].block,index:0}))},_=async r=>{let a;if(L())a=ze().map(Ze).flat().map(y=>({element:y,block:void 0}));else{let w=r?.options?.sideEffects??!1,{bundle:y}=D.getBundleState();if(!y||w)return;let R=y?.listeningBundle.contentBundle.standardView,A=await Me(R.getBlocksBetweenCursors.bind(R))(R.start,R.end);a=ke(A,()=>({blocks:[]})).blocks.filter(x=>x&&f(x)).flatMap(x=>{let W=x.start.getParentElement().ref.value.ref,P=Er({tagName:W.tagName,startElement:W,endElement:x.end.getParentElement().ref.value.ref});return P?[{element:P,block:x}]:[]})}(0,M.isEqual)(a,t)||(t=a,H())},$=await Xe("PLAYABLE_CONTENT_UPDATED",async({changed:r})=>{r&&r.metadata.source!=="Selection Player"&&_(r)}),{currentContent:N}=D.getBundleState();N&&_(N);function l(r,a=20,w=4){if(!r)return!0;let R=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,{acceptNode:ne=>ne.nodeValue?.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}).nextNode();if(!R)return!0;let A=R.nodeValue,q=A.trim().split(/\s+/).slice(0,w).join(" ");if(!q)return!0;let x=A.indexOf(q);if(x===-1)return!0;let W=document.createRange();W.setStart(R,x),W.setEnd(R,x+q.length);let P=W.getBoundingClientRect();if(P.bottom<=0||P.top>=window.innerHeight||P.right<=0||P.left>=window.innerWidth)return!0;let Ne=[{x:P.left+P.width*.25,y:P.top+P.height*.5},{x:P.left+P.width*.5,y:P.top+P.height*.5},{x:P.left+P.width*.75,y:P.top+P.height*.5}],Ae=0;for(let ne of Ne){let pe=document.elementFromPoint(ne.x,ne.y),he=!1,ie=pe;for(;ie&&!he;){if(ie===r){he=!0;break}ie=ie.parentElement}let ge=pe?window.getComputedStyle(pe):null,zt=ge?.pointerEvents==="none"||ge?.visibility==="hidden"||parseFloat(ge?.opacity||"1")<.1;!he&&!zt&&Ae++}return Ae/Ne.length*100>=a}function u(r){if(!r?.element)return!1;try{let a=r.element,w=a.getBoundingClientRect(),y=r.block?.start.getParentElement().ref.value.highlightInfo?.scrollElementSelector??Pe(),R=document.querySelector(y);if(R){let A=R.getBoundingClientRect();return w.top>=A.top&&w.bottom<=A.bottom}return!l(a,20)}catch(a){return console.error("Error in isElementVisible Hover Player:",a),!1}}let I=r=>{d&&r&&o(r)},h=null,b=!1,V=B.subscribe((r,a)=>{a?.hoveredParagraph!==r?.hoveredParagraph&&(r?.hoveredParagraph&&u(r.hoveredParagraph)?(h=r?.hoveredParagraph?.getFirstThreeWordsRect()??null,m(r.hoveredParagraph),p(r.hoveredParagraph)):(g(),X("hover-player-hints")),r?.hoveredParagraph?.element!==a?.hoveredParagraph?.element&&(a?.hoveredParagraph?.element&&(Z.unobserve(a?.hoveredParagraph?.element),me.unobserve(a?.hoveredParagraph?.element)),r?.hoveredParagraph?.element&&(Z.observe(r?.hoveredParagraph?.element),me.observe(r?.hoveredParagraph?.element))))}),F=(0,M.debounce)(()=>{b=!1;let{hoveredParagraph:r}=B.getState();r&&(h=r.getFirstThreeWordsRect(),u(r)||(g(),X("hover-player-hints")))},100),T=()=>{b=!0,F()};window.addEventListener("scroll",T);let G=()=>{};L()&&(G=yr(()=>{let{currentContent:r}=D.getBundleState();r&&_(r)}));let z=()=>{let{hoveredParagraph:r}=B.getState();if(!r)return;let a=r.getFirstThreeWordsRect();if(!(a.x!==h?.x||a.y!==h?.y||a.width!==h?.width||a.height!==h?.height))return;let y=de({wasLifecycleAudioLoadedTriggered:!1,element:r.element,block:r.block,index:r.blockIndex});o(y),h=a},ue=!1,re=r=>{ue=r[0].isIntersecting},Z=new ResizeObserver(z),me=new IntersectionObserver(re),oe,_e=()=>{!b&&ue&&z(),oe=requestAnimationFrame(_e)};return oe=requestAnimationFrame(_e),()=>{s(),oe&&cancelAnimationFrame(oe),window.removeEventListener("scroll",T),Z.disconnect(),me.disconnect(),G(),$(),V(),Oe(),X("hover-player-hints"),g()}}var Er=({startElement:e,endElement:t,tagName:o="P"})=>{let n=e,d=i=>{let c=i;for(;c;){if(c.tagName===o)return!0;c=c.parentElement}return!1};for(;n&&n!==t.parentElement;){if(d(n))return n;if(n.firstElementChild)n=n.firstElementChild;else{for(;n&&!n.nextElementSibling&&n!==t;)n=n.parentElement;n&&(n=n.nextElementSibling)}}return null};v();E();var vr=U(se)`
  border-radius: 8px;
  margin-top: 1.5rem;
  position: relative;
`,Ut=({removeNotification:e})=>preactH(Qe,{removeNotification:e},preactH(se,{column:!0,separation:"12px"},preactH(vr,null,preactH(et,{alt:"hover player demo",src:"hoverPlayer/notification.png",style:{marginLeft:"-21px",height:"64px",width:"252px"}})),preactH(se,{column:!0,yAlign:!0,separation:"4px"},preactH(Ie,{semiBold:!0,fontSize:"16px"},"One click play"),preactH(Ie,{fontSize:"14px",color:le.icnTxtSec,lineHeight:"20px"},"Hover over the first three words of any paragraph to start listening from there."))));var Rr=()=>!(lt()||ct()||ut()||st()||dt()||mt()||nt()||ot()||it()||rt()||ht()||ft()||at()||gt()||pt());var te={"paragraph-player":!1,"hover-player":!1},J=()=>Object.values(te).filter(Boolean).length,Ir=e=>J()===1&&te[e],ee=[],$t=e=>{Ir(e)&&(ee.forEach(t=>t()),ee=[]),te[e]=!1};async function wr(e,t,o,n,d){let i=o.name;if(i==="paragraph-player"&&L()&&e?.playButtons?.googledocs?.paragraphPlayer===!1||i==="hover-player"&&!Rr())return;if(J()>0)return te[i]=!0,()=>$t(i);te[i]=!0;let c=await fe(t);if(J()===0){c();return}ee.push(c),ee.push(Fe(async()=>{c(),c=await fe(t),J()===0&&c()}));let f=await ce("hover-player-hints",!0);if(J()!==0)return f||ee.push(k.registerHook("PLAYBACK_STATE_CHANGED",async({state:s})=>{if(s==="playing"&&(Et("still-listening"),!Ce())){let p=await Rt("hover-player");if(p){let{dismissedByUser:m,displayCount:g}=p;if(m||g>0)return}vt({id:"hover-player",priority:100,showOnMobile:!1,timeSensitive:!0,render:({dismiss:m})=>preactH(Ut,{removeNotification:m})})}})),()=>$t(i)}export{wr as default};
//# sourceMappingURL=init-ESVNB32Q.js.map
