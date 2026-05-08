"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_router_1 = require("react-router");
const generateRoutes = async (options = {
    pathname: "/",
    routes: [],
}) => {
    if (!Array.isArray(options.routes) || options.routes.length === 0) {
        throw new Error("options.routes must be an non-empty array");
    }
    const preload = options.routes.find((route) => !!(0, react_router_1.matchPath)(route.path, options.pathname));
    const preloadedElement = preload === undefined ? options.notFoundComp : preload.element;
    // fallback to previous version
    const preloadedComp = typeof preloadedElement === 'function' ?
        await preloadedElement().props.mod
        :
            await preloadedElement.props.mod;
    const renderElement = (path, bundle) => {
        if (!preloadedComp)
            return bundle;
        const isRouteMatched = (preload && preload.path === path) || (!preload && !path);
        const Element = isRouteMatched ? preloadedComp.default : bundle;
        return isRouteMatched ? (0, jsx_runtime_1.jsx)(Element, {}) : Element;
    };
    return ((0, jsx_runtime_1.jsxs)(react_router_1.Routes, { children: [options.routes.map((props, i) => {
                return ((0, jsx_runtime_1.jsx)(react_router_1.Route, { path: props.path, element: renderElement(props.path, props.element) }, i));
            }), (0, jsx_runtime_1.jsx)(react_router_1.Route, { path: '*', element: renderElement(null, options.notFoundComp) }, 'nf')] }));
};
exports.default = generateRoutes;
