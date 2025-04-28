import{Ac as C,db as u}from"./chunk-6VFX2JNU.js";import{a as b}from"./chunk-D2ACMGPV.js";import{b as g,j as T,k as s}from"./chunk-NORECDYR.js";import{g as E}from"./chunk-RQERJHUS.js";import{d as R,f as browser,h as m,j as preactH,o as f}from"./chunk-NUN3A7RC.js";f();m();var $=({angle:o,translateVar:t})=>T`
  0%,
  100% {
    transform: translate(0, 0) rotate(${o}deg);
  }

  50% {
    transform: translate(${t}) rotate(${o}deg);
  }
`,v=s.svg`
  height: ${({height:o})=>o??"20px"};
  width: ${({width:o})=>o??"16px"};
  animation: ${$} 1s ease-in-out infinite;
`,k=({direction:o,height:t,width:e,disableAnimation:i=!1})=>{let n={right:0,down:90,left:180,up:270}[o]??0,r={right:"5px, 0",down:"0, 5px",left:"-5px, 0",up:"0, -5px"}[o];return preactH(v,{direction:o,height:t,width:e,xmlns:"http://www.w3.org/2000/SvgStyle",viewBox:"0 0 18 19",angle:n,translateVar:i?"0, 0":r},preactH("path",{fillRule:"evenodd",d:"M17.469 10.782l-6.689 7.086c-1.573 1.647-4.013-.907-2.439-2.554l3.856-3.955H1.652c-2.203 0-2.203-3.626 0-3.626h10.78L8.342 3.45c-1.574-1.648.866-4.202 2.44-2.472l6.688 7.004c.708.659.708 2.142 0 2.801z"}))},S=k;var _=({direction:o,animate:t=!1,animationDistance:e="5px",style:i,...n})=>{let r={down:0,left:90,up:180,right:270}[o]??0,a={right:`${e}, 0`,down:`0, ${e}`,left:`-${e}, 0`,up:`0, -${e}`}[o];return preactH(t?v:b,{width:"15",height:"9",viewBox:"0 0 15 9",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",style:{transform:`rotate(${r}deg)`,...i},angle:r,translateVar:a,...n},preactH("path",{d:"M7.33008 8.43115C7.5376 8.43115 7.74512 8.34814 7.88623 8.19043L14.311 1.60791C14.4521 1.4668 14.5352 1.28418 14.5352 1.07666C14.5352 0.64502 14.2114 0.312988 13.7798 0.312988C13.5723 0.312988 13.3813 0.395996 13.2402 0.528809L7.33008 6.57178L1.41162 0.528809C1.27881 0.395996 1.08789 0.312988 0.87207 0.312988C0.44043 0.312988 0.116699 0.64502 0.116699 1.07666C0.116699 1.28418 0.199707 1.4668 0.34082 1.61621L6.76562 8.19043C6.92334 8.34814 7.11426 8.43115 7.33008 8.43115Z"}))};f();m();var l=R(E());var D=s(u)`
  font-family: var(--font-family);
  color: rgb(109, 109, 109);
  font-weight: 500;
  font-size: 16px;
  width: 178px;
  position: absolute;
  z-index: 5000;
  left: 3px;
  bottom: 100%;
  background-color: #1e1e1e;
  padding: 6px 8px;
  background: #1e1e1e;
  border-radius: 6px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
  > span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 133.333% */
    letter-spacing: 0.12px;
    color: #ffffff;
  }
`.withComponent("div"),M=s.div`
  position: absolute;
  left: 8px;
  bottom: -8px;
`,A=s.div`
  position: absolute;
  right: -8px;
  top: -8px;
  cursor: pointer;
`,L=s.div`
  position: relative;
`,B=s(u)`
  font-family: var(--font-family);
  color: rgb(109, 109, 109);
  font-weight: 500;
  font-size: 16px;
  ${({direction:o})=>o==="up"||o==="down"?"width: 240px;":""}

  position: absolute;
  z-index: 5000;

  ${({direction:o})=>o==="down"&&`
  transform: translateX(-50%);
  margin-bottom: 8px;
  left: 50%;
  bottom: 100%;
  `}

  ${({direction:o})=>o==="up"&&`
  transform: translateX(-50%);
  margin-top: 8px;
  left: 50%;
  top: 100%;
  `}

  ${({direction:o})=>o==="left"&&`
  left: 100%;
  top: 0;
  bottom: 0;
  margin-left: 8px;
  `};

  ${({direction:o})=>o==="right"&&`
  right: 100%;
  top: 0;
  bottom: 0;
  margin-right: 8px;
  `};

  > svg {
    ${({direction:o})=>o==="left"||o==="right"?"width: 35px;":""}

    > path {
      fill: rgb(109, 109, 109);
    }
  }

  > span {
    ${({direction:o})=>o==="left"||o==="right"?"width: max-content;":""}
    position: relative;
    color: #112d6d;
    display: flex;
    border-radius: 6px;
    border: 1px solid rgba(58, 98, 254, 0.12);
    box-sizing: border-box;
    font-size: 14px;
    cursor: pointer;
    background-color: #ffffff;
    padding: 5px;
    align-items: center;
    sup {
      position: absolute;
      top: -7.5px;
      right: -7.5px;
    }
  }
`,G=s.sup`
  font-size: 13px;
  margin-left: 4px;
`,N=({children:o,direction:t,...e})=>{let i=(0,l.useMemo)(()=>({left:"row",right:"row-reverse",up:"column",down:"column-reverse"})[t]??"row",[t]);return preactH(B,{xAlign:!0,yAlign:!0,separation:"4px",direction:t,...e,style:{flexDirection:i,...e?.style??{}}},preactH(S,{direction:t}),preactH("span",null,o,preactH(G,null,preactH("svg",{width:"12",height:"12",viewBox:"0 0 12 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},preactH("path",{d:"M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z",fill:"white",stroke:"#E7ECFF",strokeLinecap:"round",strokeLinejoin:"round"}),preactH("path",{d:"M7.5 4.5L4.5 7.5",stroke:"#3A62FE",strokeLinecap:"round",strokeLinejoin:"round"}),preactH("path",{d:"M4.5 4.5L7.5 7.5",stroke:"#3A62FE",strokeLinecap:"round",strokeLinejoin:"round"})))))},z=({text:o,direction:t,display:e,children:i,tooltipStyle:n,...r})=>preactH(L,{...r},i,e&&preactH(N,{direction:t,style:n},o)),V=({text:o,direction:t,display:e,children:i,...n})=>preactH(L,{...n},i,e&&preactH(D,{xAlign:!0,yAlign:!0,separation:"4px",direction:t,...n,style:{...n?.style??{}}},preactH(M,null,preactH("svg",{xmlns:"http://www.w3.org/2000/svg",width:"6",height:"6",viewBox:"0 0 6 6",fill:"none"},preactH("path",{d:"M0 3L2.82843 0.171573L5.65685 3L2.82843 5.82843L0 3Z",fill:"#1E1E1E"}))),preactH("span",null,o,preactH(A,{onClick:n?.onClick},preactH("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none"},preactH("rect",{width:"16",height:"16",rx:"8",fill:"#2D2D2F"}),preactH("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M10.3884 4.38837C10.6813 4.09548 11.1562 4.09548 11.4491 4.38837C11.742 4.68127 11.742 5.15614 11.4491 5.44903L8.97942 7.91867L11.4491 10.3884C11.742 10.6813 11.742 11.1561 11.4491 11.449C11.1563 11.7419 10.6814 11.7419 10.3885 11.449L7.91876 8.97933L5.44903 11.449C5.15613 11.7419 4.68126 11.7419 4.38837 11.449C4.09548 11.1561 4.09548 10.6813 4.38837 10.3884L6.85809 7.91867L4.38843 5.44903C4.09553 5.15614 4.09553 4.68127 4.38842 4.38837C4.68132 4.09548 5.15619 4.09548 5.44908 4.38837L7.91876 6.85802L10.3884 4.38837Z",fill:"white"})))))),po=({id:o,display:t,variant:e="simple",onToolTipDismiss:i,...n})=>{let[r,a]=(0,l.useState)(!1),d=(0,l.useRef)(null);(0,l.useEffect)(()=>{(async()=>{let{oneTimeTooltips:y}=await new Promise(p=>browser.storage.sync.get(["oneTimeTooltips"],p));a(!y?.[o]),browser.storage.onChanged.addListener(async(p,x)=>{if(x!=="sync"||!p.oneTimeTooltips)return;let{oneTimeTooltips:h}=await new Promise(P=>browser.storage.sync.get(["oneTimeTooltips"],P));a(!h?.[o])})})()},[]);let w=async c=>{if(i?.(),c.preventDefault(),c.stopPropagation(),!r)return;let p=d.current?.base?.contains(c.target)?"extension_listen_nudge_dismissed":"extension_listened_while_nudge_shown";C(p,{source:o}),a(!1);let{oneTimeTooltips:x}=await new Promise(h=>browser.storage.sync.get(["oneTimeTooltips"],h));browser.storage.sync.set({oneTimeTooltips:{...x,[o]:!0}})};return e==="simple"?preactH(z,{id:o,ref:d,display:t??r,onClick:w,...n}):e==="gmailStyle"?preactH(V,{id:o,ref:d,display:t??r,onClick:w,...n}):null},W=s.div`
  position: absolute;
  ${({display:o})=>o?"opacity: 1":"opacity: 0"};
  transition: 0.26s opacity;
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1));
`,I=s.div`
  position: absolute;
  ${({direction:o})=>["up","down"].includes(o)?`top:${o==="up"?" 0":"100%"}; left: 50%;`:`left:${o==="left"?" 0":"100%"}; top: 50%;`}
  transform: translate(-50%, -50%);
  z-index: 100;
`,F=s(u)`
  padding: 4px 8px;
  border-radius: 3px;
  min-height: 24px;
  min-width: 100px;
  background: ${({background:o})=>o};
`,co=({direction:o,display:t,children:e,tooltipStyle:i,background:n,style:r,...a})=>preactH(W,{style:r,...a,display:t},t&&preactH(F,{xAlign:!0,yAlign:!0,style:i,background:n},preactH(I,{direction:o},preactH("svg",{width:"8",height:"8",viewBox:"0 0 6 6",fill:"none",xmlns:"http://www.w3.org/2000/svg"},preactH("path",{d:"M0 3L2.82843 0.171573L5.65685 3L2.82843 5.82843L0 3Z",fill:n}))),e));function O(){let[o,t]=(0,l.useState)(!1),e=(0,l.useRef)(),i=(0,l.useCallback)(()=>{e.current=window.setTimeout(()=>{t(!0)},300)},[]),n=(0,l.useCallback)(()=>{clearTimeout(e.current),t(!1)},[]);return{showTooltip:o,onMouseEnter:i,onMouseLeave:n}}var mo=s.div`
  position: relative;
  display: inline-block;
  pointer-events: auto;

  span {
    visibility: hidden;
    width: 133px;
    background-color: ${g.bgPrimW100};
    font-family: 'ABCDiatype';
    color: #d9d9d9;
    font-size: 12px;
    padding: 8px;
    border-radius: 3px;
    position: absolute;
    opacity: 1;
    z-index: 1;
    ${({down:o})=>o?"top: 150%":"bottom: 150%"};
    left: 154%;
    margin-left: -87px;

    &:after {
      content: '';
      position: absolute;
      ${({down:o})=>o?"bottom: 100%":"top: 100%"};
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      ${({down:o})=>o?`border-color: transparent transparent ${g.brdrPrim10100} transparent`:`border-color: ${g.brdrPrim10100} transparent transparent transparent;`};
    }
  }

  :hover span {
    visibility: visible;
  }
`;function fo(o){return({children:t,...e})=>{let{showTooltip:i,onMouseLeave:n,onMouseEnter:r}=O();return preactH(o,{...e,showTooltip:i,onMouseLeave:n,onMouseEnter:r},typeof t=="function"?t(i):t)}}export{_ as a,po as b,co as c,O as d,fo as e};
//# sourceMappingURL=chunk-N3ET5YJZ.js.map
