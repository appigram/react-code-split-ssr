import { matchPath, Route, Routes } from "react-router-dom";
// import Bundle from './bundle'

export interface IJSXModule {
	default: React.FC | React.ComponentClass;
}

export interface ISSRRoute {
	caseSensitive?: boolean;
  children?: React.ReactNode;
  element?: React.ReactElement | null;
  index?: boolean;
  path?: string;
}

export interface IOptions {
	pathname: string;
	routes: ISSRRoute[];
	notFoundComp?: React.ReactElement | null;
}

const generateRoutes = async (
	options: IOptions = {
		pathname: "/",
		routes: []
	}
): Promise<React.FC> => {
	if (!Array.isArray(options.routes) || options.routes.length === 0) {
		throw new Error("options.routes must be an non-empty array");
	}

	const preload = options.routes.find(
		(route) =>
			!!matchPath(route.path, options.pathname)
	);

	const preloadedComp: React.ReactElement =
		preload === undefined
			? await options.notFoundComp
			: await preload.element;

	const renderComp = (path: string, bundle: React.ReactElement) => {
		if (!preloadedComp) return bundle;
		const isSSR = (preload && preload.path === path) || (!preload && !path);
		return isSSR ? preloadedComp : bundle;
	};

	return () => {
		return (
			<Routes>
				{options.routes.map((props, i) => (
					<Route
						key={i}
						{...props}
						element={renderComp(props.path, props.element)}
					/>
				))}
				<Route element={renderComp(null, options.notFoundComp)} />
			</Routes>
		);
	};
};

export default generateRoutes;
