import { useState } from 'react';
import { ReactLogo, ViteLogo } from '@src/components';
import '@src/app/App.css';

function App() {
    const [count, setCount] = useState(0);

    return (
        <main>
            <div>
                <ViteLogo />
                <ReactLogo />
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </main>
    );
}

export default App;
