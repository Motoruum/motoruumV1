import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SendIcon = (props) => (
  <Svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M15.07.934a1.454 1.454 0 0 0-1.447-.375L1.556 4.045A1.435 1.435 0 0 0 .518 5.18c-.106.56.266 1.27.752 1.567L5.043 9.05a.981.981 0 0 0 1.207-.143l4.32-4.32a.551.551 0 0 1 .796 0 .566.566 0 0 1 0 .794L7.037 9.702a.983.983 0 0 0-.144 1.207l2.305 3.787c.27.45.735.705 1.245.705.06 0 .128 0 .188-.008a1.458 1.458 0 0 0 1.222-1.035l3.578-11.977a1.457 1.457 0 0 0-.36-1.447Z"
      fill={props.fillColor}
    />
    <Path
      opacity={0.4}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.258 11.606a.562.562 0 0 1-.397-.96L1.883 9.62a.564.564 0 0 1 .796 0 .564.564 0 0 1 0 .796l-1.025 1.024a.558.558 0 0 1-.397.165Zm2.82.894a.562.562 0 0 1-.398-.96l1.025-1.024a.564.564 0 0 1 .796 0 .564.564 0 0 1 0 .795l-1.025 1.024a.558.558 0 0 1-.397.165Zm.191 2.676a.558.558 0 0 0 .795 0l1.025-1.024a.564.564 0 0 0 0-.795.564.564 0 0 0-.796 0L4.269 14.38a.562.562 0 0 0 0 .795Z"
      fill={props.fillColor}
    />
  </Svg>
);

export default SendIcon;