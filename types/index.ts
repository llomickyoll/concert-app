import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}
