// jquery-contextMenuの定義
interface JQueryStatic {
    contextMenu(options: {
        selector?: string,
        callback?: Function,
        items?: Object,
        trigger?: string,
        events?: {show?: Function, hide?: Function, activated?: Function},
    }): any;

    contextMenu(options: {
        selector?: string,
        build?: ($triggerElement: JQuery, event: JQueryEventObject) => Object,
    }): any;
}
interface JQuery {
    contextMenu(options?: Object): any;
}

