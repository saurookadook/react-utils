import { Outlet } from "react-router-dom";

function Root() {
    return (
        <div id="root-layout">
            <Outlet />
        </div>
    );
}

export default Root;
