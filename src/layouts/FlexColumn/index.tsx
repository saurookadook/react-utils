import * as React from 'react';

import './styles.css';

type FlexColumnProps = React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>;

function FlexColumn({ children, ...props }: FlexColumnProps) {
    return (
        <div className="flex-column" {...props}>
            {children}
        </div>
    );
}

export default FlexColumn;
