
declare namespace SemanticUI {
    // TODO: Should 'value'/'values' parameters be of type 'string' instead of 'any'?

    interface Dropdown {
        (settings?: {placeholder: string, values: {name: string, value: string, selected?: boolean}[]}): JQuery;
    }
}