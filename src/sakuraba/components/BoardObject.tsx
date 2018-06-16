import { h } from "hyperapp";
import { Card } from "./Card";
import { ActionsType } from "../actions";

/** 盤上のオブジェクト */
export const BoardObject = (params: {target: state.BoardObject}) => (state: state.State, acts: ActionsType) => {
    let obj = params.target;
    if(obj.type === 'card'){
        return <Card card={obj}></Card>;
    }
    return null;
}