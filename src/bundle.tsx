import React, { useState, useEffect } from 'react';

export interface IProps {
  mod: Promise<any>;
  loading?: React.FC;
}

type BundleState = {
  mod: React.FC | React.ComponentClass | null;
};

const Bundle = ({ mod, loading }: IProps) => {
  const [state, setState] = useState<BundleState>({ mod: null });

  useEffect(() => {
    (async function () {
      const Mod = await mod;
      setState({ mod: Mod.default });
    })();
  }, []);

  const Mod = state.mod;
  const Loading = loading || (() => <div />);

  return Mod ? <Mod /> : <Loading />;
};

export default Bundle;