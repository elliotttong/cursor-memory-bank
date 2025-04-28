import{a as I}from"./chunk-HP3G6UBE.js";import{a as _}from"./chunk-JAS7OVYG.js";import{a as M,b as A,c as D}from"./chunk-F6UTSCF4.js";import{b as w}from"./chunk-L27FCKAN.js";import"./chunk-FEYPXFJ6.js";import"./chunk-BVP7ZEFD.js";import"./chunk-FJMP4XPS.js";import"./chunk-BRU4RAVQ.js";import"./chunk-QEP7SRH7.js";import"./chunk-OFYWCEWM.js";import"./chunk-TVWAVI6A.js";import"./chunk-CVF2X5Y4.js";import"./chunk-BD5GYQVX.js";import"./chunk-LBZ34ZL2.js";import"./chunk-SI7CO4VP.js";import"./chunk-JAWPO7FD.js";import"./chunk-N3ET5YJZ.js";import"./chunk-LXDXREIX.js";import"./chunk-MQX2TL35.js";import"./chunk-SWWFND36.js";import"./chunk-PJRECGUK.js";import{Ac as R,Ia as S,b,db as l}from"./chunk-6VFX2JNU.js";import{r as E,t as L}from"./chunk-LUKOAFYK.js";import"./chunk-O77QQVYU.js";import"./chunk-35EEQS33.js";import"./chunk-BGIN6QNH.js";import"./chunk-UQBFOPQH.js";import"./chunk-6HLOLWYC.js";import"./chunk-LUPITSSL.js";import"./chunk-XFWXZVUM.js";import"./chunk-D2ACMGPV.js";import{b as m,c as P,g as T,k as i}from"./chunk-NORECDYR.js";import{g as B}from"./chunk-RQERJHUS.js";import{d as F,h as u,j as preactH,l as C,n as U,o as a}from"./chunk-NUN3A7RC.js";a();u();U();a();u();var e=F(B());a();u();var O=o=>preactH("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",...o},preactH("g",{id:"icons/20"},preactH("path",{d:"M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z",fill:"#2D2D2F"}),preactH("path",{id:"Union","fill-rule":"evenodd","clip-rule":"evenodd",d:"M12.3884 6.38861C12.6813 6.09572 13.1561 6.09572 13.449 6.38862C13.7419 6.68151 13.7419 7.15639 13.449 7.44928L10.9794 9.91892L13.4491 12.3886C13.742 12.6815 13.742 13.1564 13.4491 13.4493C13.1562 13.7422 12.6813 13.7422 12.3884 13.4493L9.9187 10.9796L7.44897 13.4493C7.15607 13.7422 6.6812 13.7422 6.38831 13.4493C6.09542 13.1564 6.09542 12.6815 6.38831 12.3886L8.85803 9.91892L6.38837 7.44928C6.09547 7.15639 6.09547 6.68151 6.38836 6.38862C6.68125 6.09572 7.15613 6.09572 7.44902 6.38861L9.9187 8.85826L12.3884 6.38861Z",fill:"#9899A6"})));var N=["speechify.com","app.speechify.com","onboarding.speechify.com","calendar.google.com","sheets.google.com","youtube.com","google.com","mail.google.com","read.amazon.in","read.amazon.com"],V=i.div`
  cursor: grab;
  position: fixed;
  z-index: 999999999;
  border: 6px solid transparent;

  opacity: 0.4;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 1;
  }
`,Y=i(l)`
  background: ${m.bgSec0110};
  color: #ffffff;
  padding: 8px;
  border-radius: 12px;
  border-color: ${m.brdrSec2060};
  font-size: 14px;
  font-family: ABCDiatype;
  position: relative;
  user-select: none;
`,G=i.div`
  width: 2px;
  height: 16px;
  border-radius: 999px;
  background: ${m.brdrPrim1080};
`,X=i(l)`
  position: relative;
  font-size: 14px;

  & > *:not(:last-child) {
    margin-right: 8px;
  }
`,W=i(l)`
  min-width: 12px;
  padding: 0 6px;
  height: 26px;
  border-radius: 6px;
  background-color: ${m.bgSec090};
  color: ${m.icnTxtWhite};
  border: 1px solid ${m.brdrPrim1080};
`,Z=i(l)`
  padding: 4px;
`,K=i.button`
  width: 20px;
  height: 20px;
  padding: 0px;
  background: none;
  border: none;
  outline: none;
  box-shadow: none;
`,j=i(O)`
  width: 20px;
  height: 20px;
  fill: #9899a6;

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`,q=i(l)`
  width: 28px;
  height: 28px;
  background-color: ${m.logoSpeechifyBlue};
  border-radius: 6px;

  & > svg {
    width: 24px;
    color: ${m.icnTxtWhite};
  }
`,c={},J=o=>{let n=(0,e.useRef)();(0,e.useEffect)(()=>{if(o){let t=s=>{if(n.current){let{x:g,y:d}=n.current,x=s.clientX-g,p=s.clientY-d,h={x:Number(o.style.left.replace("px","")),y:Number(o.style.bottom.replace("px",""))};c.x=h.x+x,c.y=h.y-p,o.style.left=`${c.x}px`,o.style.bottom=`${c.y}px`,n.current={x:s.clientX,y:s.clientY}}},r=()=>{n.current=void 0,o.style.cursor="grab"},f=s=>{o.style.cursor="grabbing",n.current={x:s.clientX,y:s.clientY}};return o.addEventListener("mousedown",f),document.addEventListener("mousemove",t),document.addEventListener("mouseup",r),()=>{o.removeEventListener("mousedown",f),document.removeEventListener("mousemove",t),document.removeEventListener("mouseup",r)}}},[o])},Q=!1,H=()=>{let[o,n]=(0,e.useState)(!1);return(0,e.useEffect)(()=>{let t=async()=>n(!0);return E("hide-shortcut-prompt",t,"shortcuts-prompt"),()=>L("hide-shortcut-prompt",t)},[]),o};function k({root:o}){let[n,t]=(0,e.useState)(null),r=S(),f=H(),[s,g]=(0,e.useState)(!0),[d,x]=(0,e.useState)(!1),p=M();(0,e.useEffect)(()=>{D()},[]);let h=(0,e.useMemo)(()=>(p["play-pause-new"]||p["play-pause"])?.shortcut.split("+"),[p]);J(n),_(g);let $=()=>{g(!0),w(),R("extension_shortcut_prompt_closed")},z=(0,e.useMemo)(()=>P({key:"shortcuts-prompt-emotion-cache",container:o}),[o]);return N.includes(window.location.hostname)||f||s||!r||!h?null:preactH(T,{value:z},preactH(V,{ref:t,style:{left:c.x?c.x:Q?274:26,bottom:c.y?c.y:26},onMouseEnter:()=>x(!0),onMouseLeave:()=>x(!1)},preactH(Y,{separation:"8px",yAlign:!0},preactH(q,{xAlign:!0,yAlign:!0},preactH(I,null)),d&&preactH(G,null),d&&preactH("span",null,"Press"),preactH(X,{yAlign:!0},h.map(y=>preactH(l,{key:y,yAlign:!0,separation:"4px"},preactH(W,{yAlign:!0,xAlign:!0},y)))),d&&preactH("span",null,"to listen"),d&&preactH(Z,null,preactH(K,{onClick:$},preactH(j,null))))))}var v;async function oo({disabled:o=!1}){if(!o){if(!v){let r=document.createElement("div");r.id="speechify-shortcuts-prompt",document.body.appendChild(r),v=r.attachShadow({mode:"open"})}let n=async()=>{if(document.visibilityState==="hidden")return;let r=await b("/keyboard-shortcuts/force-get-command-list");A(r)};document.addEventListener("visibilitychange",n);let t=document.createElement("div");return t.id="speechify-shortcuts-prompt-root",v.appendChild(t),C(preactH(k,{root:t}),t),()=>{document.removeEventListener("visibilitychange",n),C(()=>null,t)}}}export{oo as default};
//# sourceMappingURL=init-BQQPFSUG.js.map
