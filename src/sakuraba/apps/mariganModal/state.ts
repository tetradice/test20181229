import { Setting } from "sakuraba/typings/state";

export interface State {
    shown: boolean;
    cardSet: CardSet;
    side: PlayerSide;
    cards: state.Card[];
    selectedCards: state.Card[];
    zoom: number;
    setting: Setting;

    promiseResolve: (selectedCards: state.Card[]) => void;
    promiseReject: Function;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(
          cardSet: CardSet
        , side: PlayerSide
        , cards: state.Card[]
        , zoom: number
        , setting: Setting
        , promiseResolve: (selectedCards: state.Card[]) => void
        , promiseReject: Function
    ): State{
        return {
              shown: true
            , cardSet: cardSet
            , side: side
            , cards: cards
            , selectedCards: []
            , zoom: zoom
            , setting: setting
            
            , promiseResolve: promiseResolve
            , promiseReject: promiseReject
        };
    }
}