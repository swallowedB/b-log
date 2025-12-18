declare module "*.svg" {
  import * as React from "react";

  const SVGComponent: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}
