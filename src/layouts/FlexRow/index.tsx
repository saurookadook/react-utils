import * as React from 'react';

import './styles.css';

type FlexRowProps = React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>;

function FlexRow({ children, ...props }: FlexRowProps) {
    return (
        <div className="flex-row" {...props}>
            {children}
        </div>
    );
}

export default FlexRow;
