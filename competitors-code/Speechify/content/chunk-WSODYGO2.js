import{a as $}from"./chunk-7D3ZJIMI.js";import{Nb as w,Rb as I,Uc as P,Vc as O,Zc as A,b as C,rb as R}from"./chunk-6VFX2JNU.js";import{k as S}from"./chunk-LUKOAFYK.js";import{c as D,g as _,j as L,k as x}from"./chunk-NORECDYR.js";import{g as Q}from"./chunk-RQERJHUS.js";import{d as g,h as p,j as preactH,l as E,n as J,o as d}from"./chunk-NUN3A7RC.js";d();p();J();var G=g(S());d();p();var i=g(Q()),k=g(S());var tt=-45,et=-30,N=10,ot=12,nt=8,it=L`
  from { opacity: 0; }
  to { opacity: 1; }
`,rt=x(R)`
  cursor: pointer;
  position: absolute;
  right: 6px;
  top: 8px;
`,st=x.div`
  position: absolute;
  z-index: 2147483645;
  height: fit-content;
  font-size: initial;

  opacity: ${({visible:t})=>t?1:0};
  animation: ${it} 0.25s ease;

  background: #373737;
  border: 1px solid #373737;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-family: ABCDiatype, sans-serif;
  font-size: 14px;
  line-height: 16px;
  padding: ${nt}px ${ot}px;

  margin-top: ${tt}px;
  margin-left: ${et}px;
  width: max-content;

  svg {
    display: none;
  }

  &.closable {
    padding: 8px 32px 8px 12px;

    svg {
      display: inherit;
      fill: #fff;
    }
  }

  &::after {
    border-color: #373737 transparent transparent transparent;
    border-style: solid;
    border-width: ${N/2}px;
    bottom: ${-N}px;
    content: '';
    left: ${N}px;
    position: absolute;
  }

  &.light {
    background: #f1f4f9;
    border: 1px solid #e4eaf1;
    color: #1e1e1e;

    &::after {
      border-color: #f1f4f9 transparent transparent transparent;
    }

    svg {
      fill: #1e1e1e;
    }
  }
`,lt=t=>{if(!t)return null;if(t.nodeType===Node.ELEMENT_NODE)return t.getBoundingClientRect();if(t.nodeType===Node.TEXT_NODE){let e=document.createRange();return e.selectNode(t),e.getBoundingClientRect()}return null},M=({className:t,onClick:e,onClose:o,root:r,text:l="",visible:v=!0,anchorElement:s,xOffset:u=0,yOffset:m=0,maxWidth:z,hintId:h,...U})=>{let{isDarkBackground:V}=$(document.body),[W,K]=(0,i.useState)(0),[X,Y]=(0,i.useState)(0),T=(0,i.useRef)(null),Z=(0,i.useMemo)(()=>D({key:"player-emotion-cache",container:r}),[r]),j=n=>{n.preventDefault(),n.stopPropagation(),e&&e()},q=n=>{n.preventDefault(),n.stopPropagation(),o&&o()};return(0,i.useEffect)(()=>{if(!s)return;let n=()=>{if(!s)return;let c=lt(s)||{left:0,top:0};K(c.left),Y(c.top)},a=new ResizeObserver(n);a.observe(s),n();let b=(0,k.debounce)(n,50);return window.addEventListener("resize",b),()=>{a.disconnect(),window.removeEventListener("resize",b)}},[s]),(0,i.useEffect)(()=>{let n=new IntersectionObserver(a=>{a.find(c=>c.isIntersecting)&&(B(h),n.disconnect())});return n.observe(T.current),()=>{n.disconnect()}},[T.current,h]),preactH(_,{value:Z},preactH(st,{ref:T,id:"speechify-hint-tooltip",visible:v,className:`
              ${t?`${t} `:""}
              fadeIn
              ${V?"light":""}
              ${U.closable?"closable":""}
            `,onClick:j,style:{display:"inherit",position:"absolute",top:`${X+m+window.scrollY}px`,left:`${W+u+window.scrollX}px`,maxWidth:z,zIndex:2147483640}},preactH("span",{className:"hint-tooltip-text"},l),preactH(rt,{onClick:q})))};var Lt=["hover-player-hints","click-to-listen-hints"],at=new Date(2024,0,1),Rt=async(t,e=!1)=>{let o=await w("listeningHints"),r=o==="enabled";I("listeningHints",o),Number.parseInt((0,G.get)(await C("/auth/get-user"),"user.createdAt"))>=at.getTime()||(r=!1);let s=await A(t);if(!e&&s){let{dismissedByUser:u,displayCount:m}=s;(u||m>=1)&&(r=!1)}return I("listeningHintsEnabled",r),r},y,f={},H=t=>{let e=f[t];e&&(E(null,e),e.remove(),f[t]=null)},wt=H,ct=t=>{O(t),H(t)},F={},B=t=>{let e=F[t],o=window.location.href;e!==o&&(F[t]=o,P(t))},Pt=({hintId:t,...e})=>{if(!y){let l=document.createElement("div");l.id="speechify-hint-tooltip-shadow-root",document.body.appendChild(l),y=l.attachShadow({mode:"open"})}let o=f[t];o||(o=document.createElement("div"),o.id=`speechify-hint-tooltip-root-${t}`,y.appendChild(o),f[t]=o);let r=e.onClose??(()=>ct(t));return E(preactH(M,{...e,root:o,hintId:t,onClose:r}),o),()=>H(t)};export{et as a,N as b,Lt as c,at as d,Rt as e,wt as f,ct as g,B as h,Pt as i};
//# sourceMappingURL=chunk-WSODYGO2.js.map
