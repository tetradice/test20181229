export interface State {
    shown: boolean;
    selectedCardSet: CardSet;

    promiseResolve: (selectedCardSet: CardSet) => void;
    promiseReject: Function;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(
          cardSet: CardSet
        , promiseResolve: (selectedCardSet: CardSet) => void
        , promiseReject: Function
    ): State{
        return {
              shown: true
            , selectedCardSet: cardSet
            
            , promiseResolve: promiseResolve
            , promiseReject: promiseReject
        };
    }
}