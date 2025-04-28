import{$a as h,Na as C,_a as P,db as S,fb as y,gb as R,mb as D}from"./chunk-6VFX2JNU.js";import{n as B}from"./chunk-LUKOAFYK.js";import{b as E,k as b}from"./chunk-NORECDYR.js";import{a as A,f as N,g as I}from"./chunk-RQERJHUS.js";import{d as U,h as g,j as preactH,o as f}from"./chunk-NUN3A7RC.js";f();g();N();f();g();var a=U(I());f();g();var V=({strokeLineCap:e,...o})=>preactH("path",{d:"M 1,1 L 99,1","fill-opacity":"0","stroke-width":"0.5",stroke:E.brdrSec2060,"stroke-linecap":e??"square",...o}),M=({percent:e,strokeColor:o,strokeLineCap:n,...r})=>preactH("svg",{viewBox:"0 0 100 2",preserveAspectRatio:"none","aria-label":y("SEEKBAR"),"data-testid":R.SEEKBAR,style:{width:"100%",cursor:"pointer",height:"16px"},...r},preactH("defs",null,preactH("linearGradient",{id:"grad1",x1:"56",y1:"4",x2:"55.4314",y2:"-3.95987",gradientUnits:"userSpaceOnUse"},preactH("stop",{"stop-color":"#EA6AFF"}),preactH("stop",{offset:"1","stop-color":"#6B78FC"}))),preactH(V,{strokeLineCap:n}),preactH(V,{stroke:o,strokeLineCap:n,style:{strokeDashoffset:"0.2px",strokeDasharray:`${Math.max(e-.2,0)}px, 100px`}}));var w=b(S)`
  position: absolute;
  left: 0;
  right: 0;

  &:hover .seek-handle {
    display: flex;
  }
`,_=b(S)`
  width: 100%;
  margin-bottom: 10px;
  justify-content: space-between;
  padding: 0 8px;
`,T=E.sfPrimCta,L=b("div")`
  display: none;
  width: 10px;
  height: 10px;
  background: ${({background:e})=>e??T};
  border-radius: 50%;
  pointer-events: none;

  position: absolute;
  top: 16px;
  transform: translateY(-50%);
  ${({isDragging:e})=>e&&"display: flex !important;"}
`,$=b(S)`
  &:hover .seek-handle {
    display: flex;
  }
`,x=({ariaElement:e,time:o,isRemainTime:n=!1,color:r})=>preactH(D,{color:r,"aria-label":y(e),fixedWidthNumbers:!0,fontSize:"14px",style:{whiteSpace:"nowrap",fontWeight:500}},n?"-":"",B("short")(o)),G=({customStyle:e,currentTime:o,duration:n,onChange:r,onMouseUp:c,...l})=>{let u=(0,a.useRef)(null),d=Math.max(n-o,0),[i,v]=(0,a.useState)(!1),t=Math.min(o/Math.max(n,1)*100,100),m=(0,a.useCallback)(s=>{let p=u.current?.base?.getBoundingClientRect();return p?Math.max(0,(s.clientX-p.x)/p.width*n):0},[u,n]),k=(0,a.useCallback)(s=>{l.disabledSeek||(s.stopPropagation(),r(m(s)),v(!0))},[i,m,r]);return(0,a.useEffect)(()=>{if(!i)return;let s=p=>r(m(p));return window.addEventListener("mousemove",s),()=>window.removeEventListener("mousemove",s)},[i,m,r]),(0,a.useEffect)(()=>{if(!i)return;let s=p=>{v(!1),typeof c=="function"&&c(m(p)),window.removeEventListener("mouseup",s)};return window.addEventListener("mouseup",s),()=>window.removeEventListener("mouseup",s)},[i,m,r]),e?.position?e?.position==="top"?preactH(w,{yAlign:!0,relative:!0,...l,style:{top:0}},preactH(M,{ref:u,percent:t,strokeColor:T,onMouseDown:k}),preactH(L,{style:{left:`${t}%`,width:"10px",top:"8px"},className:"seek-handle",isDragging:i,background:e?.seekHandleColor})):preactH(w,{yAlign:!0,relative:!0,...l,style:{bottom:0}},e.withTimeLabel&&preactH(_,{relative:!0,align:!0},preactH(x,{ariaElement:"CURRENT_TIME",time:o}),preactH(x,{ariaElement:"REMAIN_TIME",time:d,isRemainTime:!0})),preactH(w,{yAlign:!0,relative:!0,...l,style:{bottom:0}},preactH(M,{ref:u,percent:t,strokeColor:T,onMouseDown:k}),preactH(L,{className:"seek-handle",style:{left:`${t}%`,top:"8px"},isDragging:i,background:e?.seekHandleColor}))):preactH(S,{separation:"6px",yAlign:!0,...l},preactH(x,{color:e?.timeLabelColor,ariaElement:"CURRENT_TIME",time:o}),preactH($,{yAlign:!0,relative:!0},preactH(M,{ref:u,percent:t,strokeColor:e?.seekbarColor??"#4759F7",strokeLineCap:"round",onMouseDown:k,style:{width:"100%",cursor:"pointer",padding:"8px 0",height:"16px"}}),preactH(L,{style:{left:`${t>0?`${t<100?t:"98.5"}%`:"6px"}`},className:"seek-handle",isDragging:i,background:e?.seekHandleColor})),preactH(x,{color:e?.timeLabelColor,ariaElement:"REMAIN_TIME",time:d,isRemainTime:!0}))};var le=({customStyle:e={},duration:o,seek:n,...r})=>{let c=h.useProgress(),l=h.useTime(),[u,d]=A(null),i=l.isLoading?Math.floor((c??0)*o):l.currentTime;return preactH(G,{customStyle:e,currentTime:u??i,duration:o,onChange:async t=>{t<=o&&d(Math.round(t))},onMouseUp:t=>{n(t/o).then(()=>{if(C(h.getPlayingState()))d(null);else{let m=P.registerHook("PLAYBACK_STATE_CHANGED",async({state:k})=>{C(k)&&(d(null),m())})}})},...r})};export{le as a};
//# sourceMappingURL=chunk-MZJO7N7V.js.map
