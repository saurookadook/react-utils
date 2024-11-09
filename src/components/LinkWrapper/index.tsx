import React from 'react';

type AnchorTagProps = React.JSX.IntrinsicElements['a']

const Link: React.FC<AnchorTagProps> = ({ children, href, ...props }) => {
    // function Link<>({ children, href, ...props }) {
    return (
        <a href={href} target="_blank" {...props}>
            {children}
        </a>
    );
};

export default Link;
