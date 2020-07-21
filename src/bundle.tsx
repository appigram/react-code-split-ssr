import * as React from 'react'

export interface IProps {
  mod: Promise<any>
  loading?: React.FC
}

export interface IState {
  mod: JSX.Element
}

const Bundle = ({ mod, loading }: IProps) => {
  const [ state, setState ] = React.useState({ mod: null })

  React.useEffect(() => {
    const getMod = async () => {
      const Mod = await mod
      setState({ mod: Mod.default })
    }
    getMod()
  }, [])

  const Mod = state.mod
  const Loading = loading || (() => <div />)
  return state.mod ? <Mod /> : <Loading />
}

export default Bundle
