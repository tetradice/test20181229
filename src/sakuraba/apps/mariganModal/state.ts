export interface State {
    shown: boolean;
    side: PlayerSide;
    cardIds: string[];
    selectedCardIds: string[];

    promiseResolve: (selectedCardIds: string[]) => void;
    promiseReject: Function;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(
          side: PlayerSide
        , cardIds: string[]
        , promiseResolve: (selectedCardIds: string[]) => void
        , promiseReject: Function
    ): State{
        return {
              shown: true
            , side: side
            , cardIds: cardIds
            , selectedCardIds: []
            
            , promiseResolve: promiseResolve
            , promiseReject: promiseReject
        };
    }
}