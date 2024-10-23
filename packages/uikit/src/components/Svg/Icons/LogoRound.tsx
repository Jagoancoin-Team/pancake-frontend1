import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <img src="/images/pixel/dynasty.gif" height="20px" width="20px" alt="logo" />;
};

export default Icon;
