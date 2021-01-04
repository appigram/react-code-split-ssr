import {FunctionComponentElement} from 'react'
import { matchPath, Navigate, Route, Routes } from 'react-router-dom'
// import Bundle from './bundle'

export interface IJSXModule {
  default: React.FC | React.ComponentClass
}

export interface ISSRRoute {
  path: string
  element: () => FunctionComponentElement<{ mod: Promise<IJSXModule> }>
  exact?: boolean
  strict?: boolean
}

export interface IRedirects {
  from: string
  to: string | object
  push?: boolean
}

export interface IOptions {
  pathname: string
  routes: ISSRRoute[],
  redirects?: IRedirects[],
  notFoundComp?: () => FunctionComponentElement<{ mod: Promise<IJSXModule> }>
}

const generateRoutes = async (
  options: IOptions = {
    pathname: '/',
    routes: [],
    redirects: [],
  },
): Promise<React.FC> => {
  if (!Array.isArray(options.routes) || options.routes.length === 0) {
    throw new Error('options.routes must be an non-empty array')
  }

  if (!Array.isArray(options.redirects)) {
    throw new Error('options.redirects must be an array')
  }

  const preload = options.routes.find((route) =>
    !!matchPath(options.pathname, {
      path: route.path,
      exact: route.exact || false,
      strict: route.strict || false,
    }),
  )

  const preloadedComp: IJSXModule = preload === undefined
    ? await options.notFoundComp().props.mod
    : await preload.element().props.mod

  const renderComp = (path: string, bundle: React.FC) => {
    if (!preloadedComp) return bundle
    const isSSR = (preload && preload.path === path) || (!preload && !path)
    return isSSR ? preloadedComp.default : bundle
  }

  return () => {
    return (
      <Routes>
        {options.routes.map((props, i) => (
          <Route key={i} {...props} element={renderComp(props.path, props.element)} />
        ))}
        {options.redirects.map((props, i) => (
          <Navigate key={i} {...props} />
        ))}
        <Route element={renderComp(null, options.notFoundComp)} />
      </Routes>
    )
  }
}

export default generateRoutes
