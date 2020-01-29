import { action } from '@storybook/addon-actions';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';
import template from './index.twig';
import Counter from './index.js';

export default {
    title: 'Components/Counter',
    decorators: [withA11y, withKnobs],
};

export const basicTemplate = () => ({
    component: template,
    props: {
        count: number('Count', 42),
        incrementButton: clickHandler(action('increment clicked')),
        decrementButton: clickHandler(action('decrement clicked')),
    },
});

export const negativeCount = () => ({
    component: template,
    props: {
        count: number('Count', -42),
        incrementButton: clickHandler(action('increment clicked')),
        decrementButton: clickHandler(action('decrement clicked')),
    },
});

export const basicComponent = () => ({
    component: Counter,
    props: {
        count: 5,
    },
});

function clickHandler(handler) {
    return el => {
        el.addEventListener('click', handler, false);
        return {
            unsubscribe() {
                el.removeEventListener('click', handler, false);
            },
        };
    };
}
