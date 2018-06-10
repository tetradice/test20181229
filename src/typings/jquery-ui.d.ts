// jquery ui
interface ResizableOptions {
    stop: Function;
    minWidth: number;
    minHeight: number;
}
interface JQuery {
    draggable({stop: Function}): any;
    resizable(ResizableOptions): any;
}