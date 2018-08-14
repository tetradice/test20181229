export interface State {
    shown: boolean;
    side: PlayerSide;
    cards: state.Card[];
    selectedCards: state.Card[];

    promiseResolve: (selectedCards: state.Card[]) => void;
    promiseReject: Function;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(
          side: PlayerSide
        , cards: state.Card[]
        , promiseResolve: (selectedCards: state.Card[]) => void
        , promiseReject: Function
    ): State{
        return {
              shown: true
            , side: side
            , cards: cards
            , selectedCards: []
            
            , promiseResolve: promiseResolve
            , promiseReject: promiseReject
        };
    }
}