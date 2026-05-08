import { type ReactElement } from "react";
import { matchPath, Route, Routes } from "react-router";

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
		(route): route is ISSRRoute & { path: string; } => !!route.path && !!matchPath(route.path, options.pathname)
	);

	const preloadedElement = preload === undefined ? options.notFoundComp : preload.element;

	const preloadedComp: IJSXModule | null = typeof preloadedElement === 'function'
		? await preloadedElement().props.mod
		: await preloadedElement?.props?.mod ?? null;

	const renderElement = (path: string | null, bundle: ReactElement) => {
		if (!preloadedComp) return bundle;
		const isRouteMatched = (preload && preload.path === path) || (!preload && !path);
		const Element = isRouteMatched ? preloadedComp.default : null;
		return isRouteMatched && Element ? <Element /> : bundle;
	};

	return (
		<Routes>
			{options.routes.map((props, i) => (
				<Route
					key={i}
					path={props.path}
					element={renderElement(props.path ?? null, props.element)}
				/>
			))}
			<Route key='nf' path='*' element={renderElement(null, options.notFoundComp)} />
		</Routes>
	);
};

export default generateRoutes;