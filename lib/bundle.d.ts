/// <reference types="react" />
export interface IProps {
    mod: Promise<any>;
    loading?: React.FC;
}
declare const Bundle: ({ mod, loading }: IProps) => import("react/jsx-runtime").JSX.Element;
export default Bundle;
