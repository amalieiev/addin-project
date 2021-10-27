let globalParent;
const componentState = new Map();

export function createSubject(initialValue) {
    return {
        value: initialValue,
        callbacks: [],
        subscribe(callback) {
            this.callbacks.push(callback);
        },
        next(value) {
            this.value = value;
            this.callbacks.forEach((callback) => {
                callback(value);
            });
        },
    };
}

export function useMounted(callback) {
    ((parent) => {
        componentState.set(parent, {
            ...componentState.get(parent),
            onMounted: callback,
        });
    })(globalParent);
}

export function render(component, props, parent) {
    componentState.set(parent, {
        ...componentState.get(parent),
        onMounted() {},
    });

    globalParent = parent;
    const html = component(props);
    parent.innerHTML = html;

    componentState.get(parent).onMounted(parent);
}
