import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
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
                element: this.el,
                props: this.props,
                updated: this.updated,
                subscribe: obs => this.subscriptions.push(obs.subscribe())
            });
            const s = t.subscribe(state => {
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

export const mergeIntoObject = (...streams) => {
    return combineLatest(streams, (...values) => Object.assign({}, ...values));
};

export const mergeObject = spec => {
    const pairs = toPairs(spec);
    const observables = pairs.map(([key, value]) => {
        console.log('key ', key, '; value = ', value);
        if (value.subscribe) {
            return value.pipe(map(val => ({ [key]: val })));
        }
        return of({ [key]: value });
    });
    return mergeIntoObject(...observables);
};

export const createComponent = (transform, template) =>
    class Component extends RxComponent {
        getTransform(spec) {
            return transform(spec);
        }

        render() {
            return template(this.state);
        }
    };
