import React from 'react';
export interface IProps {
    mod: Promise<any>;
    loading?: React.FC;
}
declare const Bundle: ({ mod, loading }: IProps) => React.JSX.Element;
export default Bundle;
