import template from './index.twig';

import { createComponent, useEvents, combine } from '../lib/stream';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo, scan } from 'rxjs/operators';

const onEvent = eventName => useEvents(el => fromEvent(el, eventName));

const counter = () => {
    const [incrementButton, incremented] = onEvent('click');
    const [decrementButton, decremented] = onEvent('click');

    const count = merge(
        of(0),
        incremented.pipe(mapTo(1)),
        decremented.pipe(mapTo(-1))
    ).pipe(scan((acc, next) => acc + next, 0));

    return combine({
        count,
        incrementButton,
        decrementButton
    });
};

export default createComponent(counter, template);
