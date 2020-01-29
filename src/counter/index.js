import template from './index.twig';

import { createComponent, useEvents, combine, useState } from '../lib/stream';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo, scan, last } from 'rxjs/operators';

const onEvent = eventName => useEvents(el => fromEvent(el, eventName));

const reducer = (acc, next) => acc + next;

const counter = () => {
    const [incrementButton, incremented] = onEvent('click');
    const [decrementButton, decremented] = onEvent('click');

    const count = merge(
        of(0),
        incremented.pipe(mapTo(1)),
        decremented.pipe(mapTo(-1))
    ).pipe(scan(reducer, 0));

    return combine({
        count,
        incrementButton,
        decrementButton,
    });
};

export default createComponent(counter, template);
