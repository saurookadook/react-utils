import { Outlet, Link } from "react-router-dom";

import { routerConfig } from "@src/app/browserRouter";
import './styles.css';

function Root() {
    return (
        <div id="root-layout">
            <nav className="top-nav-bar">
                <ul>
                    {routerConfig[0].children.map((config, index) => {
                        return (
                            <li key={`top-nav-${index}`}>
                                <Link to={config.path}>{config.label}</Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <Outlet />
        </div>
    );
}

export default Root;
