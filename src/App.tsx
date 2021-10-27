import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'rsuite/dist/rsuite.min.css';
import { CustomProvider } from 'rsuite';

const App: React.FC = () => (
    <CustomProvider theme="light">
        <span>Hello World!</span>
    </CustomProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
