import { h } from "hyperapp";
import {CPCard} from "./CPCard";
import actions from "../actions";

/** 盤上のオブジェクト */
export const CPBoardObject = (params: {target: BoardObject}) => (state: State, acts: typeof actions) => {
    let obj = params.target;
    if(obj.type === 'card'){
        return <CPCard target={obj}></CPCard>;
    }
    return null;
}