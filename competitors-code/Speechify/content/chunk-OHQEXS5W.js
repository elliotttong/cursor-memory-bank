import{h as o}from"./chunk-XFWXZVUM.js";import{k as n}from"./chunk-NORECDYR.js";import{h as e,o as r}from"./chunk-NUN3A7RC.js";r();e();var i=n(o)`
  left: ${({left:t})=>t??"-6px"};
  pointer-events: none;
  position: absolute;
  top: ${({top:t})=>t??"-4px"};
  g {
    transform-origin: center;
    animation: spinner_rotation 2s linear infinite;
  }

  g circle {
    stroke-linecap: round;
    animation: spinner_dash 2s ease-in-out infinite;
  }

  @keyframes spinner_rotation {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spinner_dash {
    0% {
      stroke-dasharray: 0 330;
      stroke-dashoffset: 0;
    }

    47.5% {
      stroke-dasharray: 92 330;
      stroke-dashoffset: -35;
    }

    95%,
    100% {
      stroke-dasharray: 92 330;
      stroke-dashoffset: -119;
    }
  }
`;export{i as a};
//# sourceMappingURL=chunk-OHQEXS5W.js.map
