import{a as v}from"./chunk-HP3G6UBE.js";import{a as g}from"./chunk-SI7CO4VP.js";import{Ac as w,Nb as y,Rb as h,Wc as N,Xc as b,Zc as S,b as d,db as e,lb as s,rb as T}from"./chunk-6VFX2JNU.js";import"./chunk-LUKOAFYK.js";import"./chunk-O77QQVYU.js";import"./chunk-35EEQS33.js";import"./chunk-BGIN6QNH.js";import"./chunk-UQBFOPQH.js";import"./chunk-6HLOLWYC.js";import"./chunk-D2ACMGPV.js";import{b as t,k as n}from"./chunk-NORECDYR.js";import{g as E}from"./chunk-RQERJHUS.js";import{d as C,h as a,j as preactH,o as m}from"./chunk-NUN3A7RC.js";m();a();m();a();var x=C(E()),O=n(e)`
  pointer-events: auto;
  font-family: 'ABCDiatype';
  font-style: normal;
  letter-spacing: 0.01em;
  box-sizing: border-box;
  padding: 16px;
  font-style: normal;
  width: 360px;
  background: ${t.bgPrimWB};
  border: 1px solid ${t.brdrPrim10100};
  border-radius: 12px;
  position: absolute;
  z-index: 20000;
  top: 20px;
  right: 30px;
`,_=n(s)`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
`,R=n(s)`
  color: ${t.brdrPrimInv8010};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`,A=n(s)`
  color: ${t.icnTxtSec};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
`,L=n(T)`
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
  fill: ${t.icnTxtSec};
`,k=n(e)`
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: ${t.hgltSec};
  border-radius: 50%;
`,F=n(e)`
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  width: 250px;
  border-radius: 4px;
  background: ${t.bgPrimW100};
  margin-top: 16px;
`,M=n(s)`
  color: ${t.brdrPrimInv8010};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`,$=n(e)`
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${t.sfPrimCta};
  cursor: pointer;
`,P=({historyItem:i,onRemind:c,onPlay:I,removeNotification:r})=>{let l=(0,x.useMemo)(()=>`${Math.ceil((1-i.leavePosition)*i.duration/60)}`,[i]),f=(0,x.useMemo)(()=>`https://www.google.com/s2/favicons?domain=${new URL(i.url).hostname}`,[i]);return preactH(O,null,preactH(e,{separation:"16px"},preactH(k,null,preactH(v,{color:t.icnTxtPrimElectric,width:"24px",height:"13px"})),preactH(e,{column:!0,separation:"4px"},preactH(_,null,"Listen to where you left"),preactH(e,{column:!0,separation:"8px"},preactH(R,null,"You haven’t finished this article. Spend ",l," minutes to wrap it up!"),preactH(F,{separation:"8px"},preactH(e,{yAlign:!0,separation:"8px"},preactH("img",{src:f,alt:""}),preactH(M,null,i.title)),preactH($,{onClick:I},preactH(g,{size:"14px",color:t.icnTxtPrimInv}))),preactH(A,{onClick:c},"Remind me later")))),preactH(L,{onClick:r}))};var H=12*60*60*1e3,Y=36*60*60*1e3,z=.2,D=.7,W=48*60*60*1e3;async function G(){let i=new Date().getTime(),c=await S("listen-history-item");if(i-(c?.lastDisplayedAt??0)<W)return;let r=(await d("/listen-history/get-history-list")).find(o=>i-o.updatedAt>=H&&i-o.updatedAt<=Y&&o.leavePosition>=z&&o.leavePosition<=D&&o.url!==window.location.href);if(!r)return;let l=await y("ListeningHistoryNotification");if(h("ListeningHistoryNotification",l),l!=="notification")return;b({id:"listen-history-item",timeSensitive:!1,priority:151,duration:0,global:!0,allowPointerActions:!0,showOnMobile:!1,render:({dismiss:o})=>preactH(P,{historyItem:r,onRemind:f,onPlay:p,removeNotification:o})});let f=()=>{u()},p=async()=>{let o=r.url;w("extension_listen_history_click_notification",{url:o,title:r.title,duration:r.duration,readingProgress:r.leavePosition}),u(),await d("/listen-history/navigate-history-item",{url:o}),window.open(o,"_blank")};return u}function u(){N("listen-history-item")}export{G as default,u as destroyHistoryNotification};
//# sourceMappingURL=init-WPU7FI2N.js.map
