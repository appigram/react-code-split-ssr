import React from "react";
export interface IJSXModule {
    default: React.FC | React.ComponentClass;
}
export interface ISSRRoute {
    caseSensitive?: boolean;
    children?: React.ReactNode;
    element?: any;
    index?: boolean;
    path?: string;
}
export interface IOptions {
    pathname: string;
    routes: ISSRRoute[];
    notFoundComp?: any;
}
declare const generateRoutes: (options?: IOptions) => Promise<import("react/jsx-runtime").JSX.Element>;
export default generateRoutes;
