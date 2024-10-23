import React from "react";
import { SvgProps } from "../types";

const Logo: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <>
      <img src="/images/pixel/dynasty.gif" width="11%" alt="logo" />
    </>
  );
};

export default Logo;
