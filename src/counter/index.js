import template from './index.twig';

import { createComponent, useEvents, mergeObject } from '../lib/stream';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo, scan } from 'rxjs/operators';

const onEvent = eventName => useEvents(el => fromEvent(el, eventName));

const counter = ({ subscribe }) => {
    const [foo, incremented] = onEvent('click');
    const [decrementButton, decremented] = onEvent('click');

    const count = merge(
        of(0),
        incremented.pipe(mapTo(1)),
        decremented.pipe(mapTo(-1))
    ).pipe(scan((acc, next) => acc + next, 0));

    return mergeObject({
        count,
        incrementButton: foo,
        decrementButton
    });
};

export default createComponent(counter, template);
