var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { matchPath, Route, Routes } from "react-router-dom";
const generateRoutes = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (options = {
    pathname: "/",
    routes: [],
}) {
    if (!Array.isArray(options.routes) || options.routes.length === 0) {
        throw new Error("options.routes must be an non-empty array");
    }
    const preload = options.routes.find((route) => !!matchPath(route.path, options.pathname));
    const preloadedElement = preload === undefined ? options.notFoundComp : preload.element;
    // fallback to previous version
    const preloadedComp = typeof preloadedElement === 'function' ?
        yield preloadedElement().props.mod
        :
            yield preloadedElement.props.mod;
    const renderElement = (path, bundle) => {
        if (!preloadedComp)
            return bundle;
        const isRouteMatched = (preload && preload.path === path) || (!preload && !path);
        const Element = isRouteMatched ? preloadedComp.default : bundle;
        return isRouteMatched ? _jsx(Element, {}) : Element;
    };
    return (_jsxs(Routes, { children: [options.routes.map((props, i) => {
                return (_jsx(Route, { path: props.path, element: renderElement(props.path, props.element) }, i));
            }), _jsx(Route, { path: '*', element: renderElement(null, options.notFoundComp) }, 'nf')] }));
});
export default generateRoutes;
