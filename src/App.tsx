import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'rsuite/dist/rsuite.min.css';
import { CustomProvider } from 'rsuite';
import { Layout } from '@components/Layout';

const App: React.FC = () => (
    <CustomProvider theme="light">
        <Layout />
    </CustomProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
