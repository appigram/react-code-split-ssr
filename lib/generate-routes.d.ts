import * as React from 'react';
export interface IJSXModule {
    default: React.SFC | React.ComponentClass;
}
export interface ISSRRoute {
    path: string;
    component: () => React.SFCElement<{
        mod: Promise<IJSXModule>;
    }>;
    exact?: boolean;
    strict?: boolean;
}
export interface IRedirects {
    from: string;
    to: string | object;
    push?: boolean;
}
export interface IOptions {
    pathname: string;
    routes: ISSRRoute[];
    redirects?: IRedirects[];
    notFoundComp?: () => React.SFCElement<{
        mod: Promise<IJSXModule>;
    }>;
}
declare const generateRoutes: (options?: IOptions) => Promise<any>;
export default generateRoutes;
