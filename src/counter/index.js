import template from './index.twig';

import {
    createComponent,
    useState,
    useEvents,
    mergeObject
} from '../lib/stream';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

const counter = ({ subscribe }) => {
    const [count, setCount, getCount] = useState(0);

    const [foo, incremented] = useEvents(el => fromEvent(el, 'click'));
    subscribe(incremented.pipe(tap(_ => setCount(count => count + 1))));

    const [decrementButton] = useEvents(el =>
        fromEvent(el, 'click').pipe(tap(_ => setCount(getCount() - 1)))
    );

    return mergeObject({
        count,
        incrementButton: foo,
        decrementButton
    });
};

export default createComponent(counter, template);
