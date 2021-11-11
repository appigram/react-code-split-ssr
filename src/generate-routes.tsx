import { ReactElement } from "react";
import { matchPath, Route, Routes } from "react-router-dom";

export interface IJSXModule {
	default: React.FC | React.ComponentClass;
}

export interface ISSRRoute {
	caseSensitive?: boolean;
	children?: React.ReactNode;
	element?: () => React.FunctionComponentElement<{ mod: Promise<IJSXModule> }>;
	index?: boolean;
	path?: string;
}

export interface IOptions {
	pathname: string;
	routes: ISSRRoute[];
	notFoundComp?: () => React.FunctionComponentElement<{ mod: Promise<IJSXModule> }>;
}

const generateRoutes = async (
	options: IOptions = {
		pathname: "/",
		routes: [],
	}
): Promise<React.FC> => {
	if (!Array.isArray(options.routes) || options.routes.length === 0) {
		throw new Error("options.routes must be an non-empty array");
	}

	const preload = options.routes.find(
		(route) => !!matchPath(route.path, options.pathname)
	);

	const preloadedComp: any =
		preload === undefined
			? await options.notFoundComp().props.mod
			: await preload.element().props.mod;

	const renderElement = (path: string, bundle: ReactElement) => {
		if (!preloadedComp) return bundle;
		const isSSR = (preload && preload.path === path) || (!preload && !path);
		const Element = isSSR ? preloadedComp.default : bundle;
		return <Element />;
	};

	return () => {
		return (
			<Routes>
				{options.routes.map((props, i) => {
					return (
						<Route
							key={i}
							path={props.path}
							element={renderElement(props.path, props.element())}
						/>
					);
				})}
				<Route element={renderElement(null, options.notFoundComp())} />
			</Routes>
		);
	};
};

export default generateRoutes;
