import {useState, useEffect} from 'react'

export interface IProps {
  mod: Promise<any>
  loading?: React.FC
}

export interface IState {
  mod: JSX.Element
}

const Bundle = ({ mod, loading }: IProps) => {
  const [ state, setState ] = useState({ mod: null })

  useEffect(() => {
    (async function () {
      const Mod = await mod
      setState({ mod: Mod.default })
    })()
  }, [])

  const Mod = state.mod
  const Loading = loading || (() => <div />)
  return state.mod ? <Mod /> : <Loading />
}

export default Bundle
