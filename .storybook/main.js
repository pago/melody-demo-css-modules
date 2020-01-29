// our app's webpack.config.js
const custom = require('../webpack.config.js');

module.exports = {
    stories: ['../src/**/*.stories.[tj]s'],
    addons: [
        '@storybook/addon-actions/register',
        '@storybook/addon-storysource',
        '@storybook/addon-a11y/register',
        '@storybook/addon-knobs/register',
    ],
    webpackFinal: config => {
        return {
            ...config,
            module: { ...config.module, rules: custom.module.rules },
        };
    },
};