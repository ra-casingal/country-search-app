const BouncingCirclesSvgIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    className="w-6 h-6"
  >
    <circle cx="40" cy="65" r="15" stroke="#000" strokeWidth="15">
      <animate
        attributeName="cy"
        begin="-0.2"
        calcMode="spline"
        dur="1"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        values="65;135;65;"
      ></animate>
    </circle>
    <circle cx="100" cy="65" r="15" stroke="#000" strokeWidth="15">
      <animate
        attributeName="cy"
        begin="-0.1"
        calcMode="spline"
        dur="1"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        values="65;135;65;"
      ></animate>
    </circle>
    <circle cx="160" cy="65" r="15" stroke="#000" strokeWidth="15">
      <animate
        attributeName="cy"
        begin="0"
        calcMode="spline"
        dur="1"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        values="65;135;65;"
      ></animate>
    </circle>
  </svg>
);

export default BouncingCirclesSvgIcon;
