import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import Home from './index.js';

export default {
    title: 'Pages/Home',
    component: Home,
    decorators: [withA11y, withKnobs],
};

export const welcome = () => ({
    props: {
        message: text('message', 'Hello World'),
    },
});
