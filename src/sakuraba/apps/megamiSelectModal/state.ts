import { Setting } from "sakuraba/typings/state";
import { Megami } from "sakuraba";

export interface State {
    shown: boolean;
    cardSet: CardSet;
    side: PlayerSide;
    selectedMegamis: Megami[];
    zoom: number;
    setting: Setting;

    promiseResolve: (selectedMegamis: Megami[]) => void;
    promiseReject: Function;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(
          cardSet: CardSet
        , side: PlayerSide
        , zoom: number
        , setting: Setting
        , promiseResolve: (selectedCards: Megami[]) => void
        , promiseReject: Function
    ): State{
        return {
              shown: true
            , cardSet: cardSet
            , side: side
            , selectedMegamis: []
            , zoom: zoom
            , setting: setting
            
            , promiseResolve: promiseResolve
            , promiseReject: promiseReject
        };
    }
}