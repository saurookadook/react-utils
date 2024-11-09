import reactLogo from '@src/assets/react.svg';
import { LinkWrapper } from '@src/components';

function ReactLogo() {
    return (
        <LinkWrapper href="https://react.dev">
            <img src={reactLogo} className="logo react" alt="React logo" />
        </LinkWrapper>
    );
};

export default ReactLogo;
