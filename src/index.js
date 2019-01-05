import { render } from 'melody-component';
import home from './home';

const documentRoot = document.getElementById('root');
render(documentRoot, home, {
    message: 'Welcome to Melody!'
});