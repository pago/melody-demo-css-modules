import {
    BehaviorSubject,
    Subject,
    combineLatest,
    of,
    isObservable
} from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { enqueueComponent } from 'melody-idom';
import { toPairs } from 'lodash';

class RxComponent {
    constructor(el) {
        this.el = el;
        this.refs = {};

        this.props = new BehaviorSubject({});
        this.updated = new Subject();
        this.subscriptions = [];
        this.state = {};
    }

    apply(props) {
        this.props.next(props);
        if (this.subscriptions.length === 0) {
            const t = this.getTransform({
                dispatch(eventName, detail, options = {}) {
                    const event = new CustomEvent(eventName, {
                        ...options,
                        detail
                    });
                    this.el.dispatchEvent(event);
                },
                props: this.props,
                updated: this.updated,
                subscribe: obs => this.subscriptions.push(obs.subscribe())
            });
            const s = t
                .pipe(distinctUntilChanged(shallowEqual))
                .subscribe(state => {
                    this.state = state;
                    enqueueComponent(this);
                });
            this.subscriptions.push(s);
        }
    }

    notify() {
        this.updated.next();
    }

    componentWillUnmount() {
        this.props.complete();
        this.updated.complete();
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions.length = 0;
    }

    render() {}
}

export const useState = initialValue => {
    const subj = new BehaviorSubject(initialValue);

    const mutator = newValue => {
        if (typeof newValue === 'function') {
            subj.next(newValue(subj.getValue()));
        } else {
            subj.next(newValue);
        }
    };

    return [subj, mutator, subj.getValue.bind(subj)];
};

export const useEvents = handler => {
    const subj = new Subject();
    const refHandler = el => {
        return handler(el).subscribe(next => subj.next(next));
    };
    return [refHandler, subj];
};

const mergeIntoObject = (...streams) => {
    return combineLatest(streams, (...values) => Object.assign({}, ...values));
};

const mergeObject = spec => {
    const pairs = toPairs(spec);
    const observables = pairs.map(([key, value]) => {
        if (isObservable(value)) {
            return value.pipe(map(val => ({ [key]: val })));
        }
        return of({ [key]: value });
    });
    return mergeIntoObject(...observables);
};

export const combine = (...streams) =>
    mergeIntoObject(
        ...streams.map(stream =>
            isObservable(stream) ? stream : mergeObject(stream)
        )
    );

export const createComponent = (transform, template) =>
    class Component extends RxComponent {
        getTransform(spec) {
            return transform(spec);
        }

        render() {
            return template(this.state);
        }
    };

// TODO: move elsewhere
const hasOwn = Object.prototype.hasOwnProperty;

// Object.is polyfill
const is = (x, y) => {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
};

const shallowEqual = (a, b) => {
    if (is(a, b)) return true;

    if (
        typeof a !== 'object' ||
        a === null ||
        typeof b !== 'object' ||
        b === null
    ) {
        return false;
    }

    if (Array.isArray(a) !== Array.isArray(b)) {
        return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (let i = 0; i < keysA.length; i++) {
        if (!hasOwn.call(b, keysA[i]) || !is(a[keysA[i]], b[keysA[i]])) {
            return false;
        }
    }

    return true;
};
(function() {
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail
        );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();
