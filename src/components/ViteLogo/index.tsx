import viteLogo from '/vite.svg';
import { LinkWrapper } from '@src/components';

function ViteLogo() {
    return (
        <LinkWrapper href="https://vite.dev">
            <img src={viteLogo} className="logo" alt="Vite logo" />
        </LinkWrapper>
    );
};

export default ViteLogo;
