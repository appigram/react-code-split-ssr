import React, { ReactElement } from "react";
import { matchPath, Route, Routes } from "react-router";

export interface IJSXModule {
	default: React.FC | React.ComponentClass;
}

export interface ISSRRoute {
	caseSensitive?: boolean;
	children?: React.ReactNode;
	element?: any; // () => React.FunctionComponentElement<{ mod: Promise<IJSXModule> }>;
	index?: boolean;
	path?: string;
}

export interface IOptions {
	pathname: string;
	routes: ISSRRoute[];
	notFoundComp?: any; // () => React.FunctionComponentElement<{ mod: Promise<IJSXModule> }>;
}

const generateRoutes = async (
	options: IOptions = {
		pathname: "/",
		routes: [],
	}
) => {
	if (!Array.isArray(options.routes) || options.routes.length === 0) {
		throw new Error("options.routes must be an non-empty array");
	}

	const preload = options.routes.find(
		(route) => !!matchPath(route.path, options.pathname)
	);

	const preloadedElement = preload === undefined ? options.notFoundComp : preload.element;

	// fallback to previous version
	const preloadedComp: any = typeof preloadedElement === 'function' ?
		await preloadedElement().props.mod
		:
		await preloadedElement.props.mod;

	const renderElement = (path: string, bundle: ReactElement) => {
		if (!preloadedComp) return bundle;
		const isRouteMatched = (preload && preload.path === path) || (!preload && !path);
		const Element = isRouteMatched ? preloadedComp.default : bundle;
		return isRouteMatched ? <Element /> : Element;
	};

	return (
		<Routes>
			{options.routes.map((props, i) => {
				return (
					<Route
						key={i}
						path={props.path}
						element={renderElement(props.path, props.element)}
					/>
				);
			})}
			<Route key='nf' path='*' element={renderElement(null, options.notFoundComp)} />
		</Routes>
	);
};

export default generateRoutes;
