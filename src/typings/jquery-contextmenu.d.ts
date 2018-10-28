// jquery-contextMenuの定義
interface JQueryStatic {
    contextMenu(options: {
        selector?: string,
        callback?: Function,
        items?: Object,
        trigger?: string,
        zIndex?: number | (() => number),
        events?: {show?: Function, hide?: Function, activated?: Function},
    }): any;

    contextMenu(options: {
        selector?: string,
        trigger?: string,
        zIndex?: number | (() => number),
        build?: ($triggerElement: JQuery, event: JQueryEventObject) => Object,
        events?: {show?: Function, hide?: Function, activeted?: Function}
    }): any;
}
interface JQuery {
    contextMenu(options?: Object): any;
}


