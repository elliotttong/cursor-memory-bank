import{a as O,b as W}from"./chunk-AWMOQZPV.js";import{a as G}from"./chunk-7D3ZJIMI.js";import{c as F,e as B}from"./chunk-N3ET5YJZ.js";import{a as D}from"./chunk-LXDXREIX.js";import{Ca as v,La as L,Oa as A,bb as k,db as m,ha as w,ja as b,lb as R,qb as N}from"./chunk-6VFX2JNU.js";import{p as E,v as I}from"./chunk-LUKOAFYK.js";import"./chunk-O77QQVYU.js";import"./chunk-35EEQS33.js";import"./chunk-BGIN6QNH.js";import"./chunk-UQBFOPQH.js";import"./chunk-6HLOLWYC.js";import"./chunk-D2ACMGPV.js";import{b as n,k as c}from"./chunk-NORECDYR.js";import{g as Z}from"./chunk-RQERJHUS.js";import{d as Y,f as browser,h as g,j as preactH,k as Fragment,l as S,n as J,o as y}from"./chunk-NUN3A7RC.js";y();g();J();y();g();var a=Y(Z());var H=c(m)`
  font-family: var(--font-family);
  background: ${({isDarkBackground:e})=>e?n.sfPrimCta:n.bgPrimInvBW};
  border-radius: 4000px;
  cursor: pointer;
  height: 24px;
  padding: 3px 4px;
  overflow: hidden;
  width: 55px;
  margin-left: ${({isUSVersion:e})=>e?"0px":"10px"};
  margin-top: 3px;
`,ee=c(m)`
  font-family: var(--font-family);
  cursor: pointer;
  overflow: hidden;
`,te=c(m)`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
`,oe=B(c.div`
  position: relative;

  // this is to make sure the tooltip and the icon are center aligned and we don't have to hack the margin left/right values for the tooltip;
  display: flex;
  flex-direction: column;
  align-items: center;
`),ne=c(F)`
  position: absolute;
  margin-top: 42px;
  margin-left: 10px;
  z-index: 1000;
`,ie=e=>o=>!(e.ignoredSelectors?.some(t=>o.classList.contains(t))||e.ignoredSelectorForCodeSegment&&e.ignoredTagForCodeSegment&&o.classList.contains(e.ignoredSelectorForCodeSegment)&&o.tagName.toLowerCase()===e.ignoredTagForCodeSegment);function q(e){let o="";return e instanceof Node?(e.childNodes.forEach(t=>{if(t.nodeType===Node.ELEMENT_NODE){let r=window.getComputedStyle(t);r.display!=="none"&&r.visibility!=="hidden"&&(o+=q(t))}else t.nodeType===Node.TEXT_NODE&&(o+=t.textContent)}),o.trim()):e.text}var re=({isPlaying:e,isLoading:o,isDarkBackground:t,...r})=>{let i=(0,a.useMemo)(()=>o?"loading":e?"playing":"paused",[e,o]);return preactH(m,{...r},i==="playing"&&preactH(O,{pathFill:t?n.icnTxtPrim:n.icnTxtPrimElectric,width:"18",height:"18"}),i==="loading"&&preactH(D,{color:t?n.icnTxtPrim:n.icnTxtPrimElectric,width:"18",height:"18"}),i==="paused"&&preactH(W,{pathFill:t?n.icnTxtPrim:n.icnTxtPrimElectric,width:"18",height:"18"}))},M=({isUSVersion:e,selectors:o})=>{let{isDarkBackground:t}=G(document.body),[r,i]=(0,a.useState)(!0),l=document.querySelector(o.contentMainSelector),V="showGoogleGenAIListenCopy",[C,_]=(0,a.useState)(null),{state:h,play:$,pause:z,queueAndPlayContent:Q,isActive:p}=A(C),{duration:P}=L(C,p),u=p&&h==="playing",x=p&&h==="buffering";(0,a.useEffect)(()=>{(async()=>{let j=Array.from(document.querySelectorAll(o.contentSelector)).filter(d=>getComputedStyle(d.parentElement,null)?.getPropertyValue("display")!=="none").filter(ie(o)),{ObjectRef:K}=await w(),X={getContent:await k(async()=>({content:j,chunksAfter:0,chunksBefore:0})),converter:d=>({text:q(d),ref:new K({ref:d})}),options:{autoplay:!0,sideEffects:!1},metadata:{source:"GoogleGenAIResult"}};_(X)})()},[l]),(0,a.useEffect)(()=>{(async()=>{let{showGoogleGenAIListenCopy:s}=await browser.storage.local.get([V]);i(s??!0)})()},[]);let T=async s=>{if(s.preventDefault(),s.stopPropagation(),E()||I("browser-action",{animate:!1},"pill-player"),!p)return Q();if(!x){if(u)return z();if(!u)return $();await browser.storage.local.set({showGoogleGenAIListenCopy:!1}),i(!1)}};return preactH(oe,null,s=>preactH(Fragment,null,preactH(ne,{background:t?n.bgSecInv1000:n.bgPrimW100,display:s&&!r&&!x&&!u,direction:"up",tooltipStyle:{justifyContent:"space-between",minWidth:"128px",fontFamily:"ABCDiatype",fontSize:"14px"}},preactH(R,{color:t?n.icnTxtPrimInv:n.icnTxtPrim},"Listen to this answer")),preactH(ee,{yAlign:!0,relative:!0,column:!1,onClick:f=>T(f)},preactH(H,{yAlign:!0,relative:!0,column:!1,isUSVersion:!!e,onClick:f=>T(f),isDarkBackground:t,separation:"3px"},!P.isLoading&&preactH(re,{isLoading:x,isPlaying:u,isDarkBackground:t}),preactH(te,{yAlign:!0,xAlign:!0},preactH(N,{color:t?n.icnTxtPrim:n.icnTxtPrimElectric,fixedWidthNumbers:!0,duration:P}))),r&&preactH("h3",{style:{color:t?n.icnTxtPrim:n.icnTxtPrimElectric,fontFamily:"ABCDiatype",marginLeft:"8px",marginTop:"4px",fontSize:"16px"}},"Listen to answer"))))};var U="speechify-google-gen-ai-player-root";async function le(e){let o=e.selectors;await v(o.mainSelectorUS),ae(),await b(800);let t=!document.querySelector(`${o.mainSelectorIN}`),r=t?o.mainSelectorUS:o.mainSelectorIN,i=document.querySelector(`${r}`);if(i){let l=document.createElement("span");l.id=U,t&&(l.style.display="flex",l.style.marginTop="10px",l.style.marginBottom="10px"),t?i.prepend(l):i.appendChild(l),S(preactH(M,{isUSVersion:t,selectors:o}),l)}}var ae=()=>{let e=document.querySelector(`#${U}`);e&&(e.remove(),S(null,e))};export{le as default};
//# sourceMappingURL=init-44ZT64ND.js.map
