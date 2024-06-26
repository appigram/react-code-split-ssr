var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const Bundle = ({ mod, loading }) => {
    const [state, setState] = useState({ mod: null });
    useEffect(() => {
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                const Mod = yield mod;
                setState({ mod: Mod.default });
            });
        })();
    }, []);
    const Mod = state.mod;
    const Loading = loading || (() => _jsx("div", {}));
    return state.mod ? _jsx(Mod, {}) : _jsx(Loading, {});
};
export default Bundle;
