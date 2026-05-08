import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from "react";
import { matchPath, Route, Routes } from "react-router";
const generateRoutes = async (options = {
    pathname: "/",
    routes: [],
}) => {
    if (!Array.isArray(options.routes) || options.routes.length === 0) {
        throw new Error("options.routes must be an non-empty array");
    }
    const preload = options.routes.find((route) => !!route.path && !!matchPath(route.path, options.pathname));
    const preloadedElement = preload === undefined ? options.notFoundComp : preload.element;
    const preloadedComp = typeof preloadedElement === 'function'
        ? await preloadedElement().props.mod
        : await preloadedElement?.props?.mod ?? null;
    const renderElement = (path, bundle) => {
        if (!preloadedComp)
            return bundle;
        const isRouteMatched = (preload && preload.path === path) || (!preload && !path);
        const Element = isRouteMatched ? preloadedComp.default : null;
        return isRouteMatched && Element ? _jsx(Element, {}) : bundle;
    };
    return (_jsxs(Routes, { children: [options.routes.map((props, i) => (_jsx(Route, { path: props.path, element: renderElement(props.path ?? null, props.element) }, i))), _jsx(Route, { path: '*', element: renderElement(null, options.notFoundComp) }, 'nf')] }));
};
export default generateRoutes;
