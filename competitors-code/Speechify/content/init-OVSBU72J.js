import{a as M}from"./chunk-VYK2SFTV.js";import{Aa as h,Ab as f,Da as y,Xb as O,ab as w,bb as C,ha as p,kb as P,s as N,t as S,ua as L,za as H,zb as k}from"./chunk-6VFX2JNU.js";import{k as q}from"./chunk-LUKOAFYK.js";import"./chunk-O77QQVYU.js";import"./chunk-35EEQS33.js";import"./chunk-BGIN6QNH.js";import"./chunk-UQBFOPQH.js";import"./chunk-6HLOLWYC.js";import"./chunk-NORECDYR.js";import"./chunk-RQERJHUS.js";import{d as _,h as A,o as T}from"./chunk-NUN3A7RC.js";T();A();var v=_(q());var F=e=>{let r=document.createRange();return e.length===0?document.body:(r.setStartBefore(e[0]),r.setEndAfter(e[e.length-1]),r.commonAncestorContainer??document.body)},I=async({awaitedElement:e,startingNode:r,shouldParseShadowRoot:o,useHybridParsingMode:t})=>{let{ObjectRef:i}=await p();e&&await y(e);let s=r?document.querySelector(r)??document.body:document.body;w({getContent:await C(async({invalidateCache:n})=>({content:await O.getParsedElements({useHybridParsingMode:t,invalidateCache:n,shouldParseShadowRoot:o,startingNodeElement:s}),chunksBefore:0,chunksAfter:0})),converter:n=>({text:M(n),ref:new i({ref:n})}),options:{sideEffects:!1,autoplay:!1,experimentalEdits:async function*(n){let a=f({ignoreCache:!1,startingNode:s??document.body,shouldParseShadowRoot:o}),d=s??F(a),m=()=>new Promise(l=>{let c=[],u=()=>{b.disconnect(),l([])},g=(0,v.debounce)(E=>{c=[];let x=f({startingNode:s??document.body,shouldParseShadowRoot:o,ignoreCache:!0});a.length!==x.length&&(a=x,b.disconnect(),n.removeEventListener("abort",u),l(E))},1e3),b=new MutationObserver(E=>{c.push(...E),g(c)});n.addEventListener("abort",u),b.observe(d,{childList:!0,subtree:!0})});for(;!n.aborted&&a.length<1e3;)yield await m()}},metadata:{source:"PillPlayer"}},!0)},R=e=>{let r=[],o=e.heading?H(e.heading):null,t=Array.from(h(e.paragraphChunks));if(e.subHeading){let n=Array.from(h(e.subHeading));n.length>0&&t.unshift(...n)}let i=0;return(o?[o,...t]:t).forEach(n=>{if(L(n)&&!k(n)){let a=P(n).textContent??"";i+=a.length,r.push(n)}}),i<100&&(r=f({ignoreCache:!0})),r},B=async e=>{let{ObjectRef:r}=await p();e.awaitedElement&&await y(e.awaitedElement);let o=window.location.origin.includes("wikipedia.org");w({getContent:await C(async()=>({content:R(e),chunksBefore:0,chunksAfter:0})),converter:t=>{let i=t instanceof HTMLElement?P(t):t;return{text:M(i),ref:new r({ref:t,highlightInfo:{startOffset:0,unsetColor:o}})}},options:{sideEffects:!1,autoplay:!1,experimentalEdits:async function*(t){let i=R(e),s=F(i),n=()=>new Promise(a=>{let d=[],m=()=>{c.disconnect(),a([])},l=(0,v.debounce)(u=>{d=[];let g=R(e);i.length!==g.length&&(i=g,c.disconnect(),t.removeEventListener("abort",m),a(u))},1e3),c=new MutationObserver(u=>{d.push(...u),l(d)});t.addEventListener("abort",m),c.observe(s,{childList:!0,subtree:!0})});for(;!t.aborted;)yield await n()}},metadata:{source:"PillPlayer"}},!0)},D=async(e,r)=>{if(e&&N(e))return B(e.selectors);let o=r.ceParsingMode,t=e&&S(e)?e.config:{awaitedElement:null,startingNode:{selector:null,parseShadowRoot:!1},useHybridParsingMode:o==="hybrid"&&e?.mode!=="extract"};return I({awaitedElement:t?.awaitedElement,startingNode:t?.startingNode?.selector??null,shouldParseShadowRoot:t?.startingNode?.parseShadowRoot,useHybridParsingMode:t?.useHybridParsingMode??!1})};async function G(e,r,o,t){await D(e,t)}export{G as default,D as queueContent};
//# sourceMappingURL=init-OVSBU72J.js.map
