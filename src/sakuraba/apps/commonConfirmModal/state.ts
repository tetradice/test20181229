export interface State {
    shown: boolean;
    message: hyperapp.Children | hyperapp.Children[];

    promiseResolve: () => void;
    promiseReject: () => void;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(
          message: State['message']
        , promiseResolve: State['promiseResolve']
        , promiseReject: State['promiseReject']
    ): State{
        return {
              shown: true
            , message: message
            , promiseResolve: promiseResolve
            , promiseReject: promiseReject
        };
    }
}