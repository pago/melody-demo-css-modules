import { createComponent } from '../lib/stream';
import template from './index.twig';

export default createComponent(({ props }) => props, template);
