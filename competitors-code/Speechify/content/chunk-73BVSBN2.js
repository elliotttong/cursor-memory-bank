import{rb as p}from"./chunk-6VFX2JNU.js";import{k as o}from"./chunk-NORECDYR.js";import{h as r,o as n}from"./chunk-NUN3A7RC.js";n();r();var l="top-right";function a(t){let[e,i]=t.split("-");return e==="bottom"?`
      bottom: -5px;
      ${i==="left"?"left: 12px;":"right: 12px;"}
    `:e==="left"?`
      right: -5px;
      ${i==="up"?"top: 12px;":"bottom: 12px;"}
    `:e==="right"?`
      left: -5px;
      ${i==="up"?"top: 12px;":"bottom: 12px;"}
    `:e==="top"?`
      top: -5px;
      ${i==="left"?"left: 12px;":"right: 12px;"}
    `:""}function d(t){let[e,i]=t.split("-");return e==="bottom"?`
      bottom: 1px;
      ${i==="left"?"left: 7px;":"right: 7px;"}
      width: 27px;
      height: 32px;
    `:e==="left"?`
      right: 1px;
      ${i==="up"?"top: 7px;":"bottom: 7px;"}
      width: 32px;
      height: 27px;
    `:e==="right"?`
      left: 1px;
      ${i==="up"?"top: 7px;":"bottom: 7px;"}
      width: 32px;
      height: 27px;
    `:e==="top"?`
      top: 1px;
      ${i==="left"?"left: 7px;":"right: 7px;"}
      width: 27px;
      height: 10px;
    `:""}var c=o.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
  top: 2px;
  z-index: 1;
`,u=o(p)`
  fill: #9899a6;

  &:hover {
    fill: #fff;
  }

  .dark & {
    &:hover {
      fill: #000;
    }
  }
`,b=o.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  width: ${({width:t})=>t}px;
`,m=o.button`
  align-items: center;
  background: #4759f7;
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  display: flex;
  flex: 1 0 0;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  gap: 0px;
  justify-content: center;
  letter-spacing: 0.14px;
  line-height: 20px;
  padding: 8px 16px 8px 8px;
  white-space: nowrap;
`,y=o.div`
  align-items: flex-end;
  display: flex;
  gap: 4.356px;
  height: 20px;
  justify-content: center;
  padding-right: 0.087px;
  width: 115.631px;

  .dark & {
    svg {
      path {
        fill: #2f43fa;
      }
    }
  }
`,w=o.div`
  font-family: ABCDiatype, sans-serif;
  height: 100%;
  min-width: 230px;
  padding: 0;
  width: 100%;
`,$=o.div`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.14px;
  line-height: 20px;

  .dark & {
    color: #000;
  }
`,v=o.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  gap: 16px;
`,k=o.div`
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.16px;
  line-height: 24px;

  .dark & {
    color: #000;
  }
`,P=o.div`
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.32);
  color: #fff;
  cursor: default;
  display: flex;
  flex-direction: column;
  overflow: visible;
  pointer-events: auto;
  position: fixed;
  visibility: ${({visible:t=!1})=>t?"visible":"hidden"};
  opacity: ${({visible:t=!1})=>t?1:0};

  &.dark {
    background: #f5f5fa;
    box-shadow: npne;
    color: #000 !important;
  }

  &.initial {
    transition: none;
  }

  ${({position:t,anchorOffset:e={x:0,y:8}})=>{if(!t)return`
        left: -4px;
        top: 36px;
      `;let i=t.bottom!==void 0?`bottom: ${typeof t.bottom=="number"?t.bottom+(e.y||0)+"px":t.bottom};`:"",f=t.left!==void 0?`left: ${typeof t.left=="number"?t.left+(e.x||0)+"px":t.left};`:"",x=t.right!==void 0?`right: ${typeof t.right=="number"?t.right+(e.x||0)+"px":t.right};`:"";return`
      ${t.top!==void 0?`top: ${typeof t.top=="number"?t.top+(e.y||0)+"px":t.top};`:""}
      ${f}
      ${x}
      ${i}
    `}}

  ${({showPointer:t,pointerPosition:e=l})=>t?`
      &::before {
        background: #1e1e1e;
        box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.32);
        content: '';
        height: 12px;
        position: absolute;
        transform: rotate(45deg);
        width: 12px;
        ${a(e)}
      }

      &.dark::before {
        background: #f5f5fa;
        box-shadow: none;
      }
      
      &::after {
        background: #1e1e1e;
        content: '';
        position: absolute;
        ${d(e)}
      }

      &.dark::after {
        background: #f5f5fa;
      }
    `:""}
`,C=o.div`
  flex-shrink: 0;
  height: 20px;
  width: 20px;

  .dark & {
    svg[data-platform='x'] {
      path {
        fill: #000;
      }
    }
  }
`,N=o.div`
  background: #3c3c3e;
  border-radius: 10px;
  height: 10px;
  width: 2px;

  .dark & {
    background: #e9eaf0;
  }
`,S=o.div`
  flex-shrink: 0;
  height: 16.926px;
  width: 78.157px;
`,B=o.div`
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;export{c as a,u as b,b as c,m as d,y as e,w as f,$ as g,v as h,k as i,P as j,C as k,N as l,S as m,B as n};
//# sourceMappingURL=chunk-73BVSBN2.js.map
