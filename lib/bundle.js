import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
const Bundle = ({ mod, loading }) => {
    const [state, setState] = useState({ mod: null });
    useEffect(() => {
        (async function () {
            const Mod = await mod;
            setState({ mod: Mod.default });
        })();
    }, []);
    const Mod = state.mod;
    const Loading = loading || (() => _jsx("div", {}));
    return Mod ? _jsx(Mod, {}) : _jsx(Loading, {});
};
export default Bundle;
