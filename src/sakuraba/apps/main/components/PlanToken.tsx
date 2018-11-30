import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as utils from "sakuraba/utils";
import dragInfo from "sakuraba/dragInfo";
import { t } from "i18next";

/** 計略 */
export const PlanToken = (p: {side: PlayerSide, planState: PlanState, left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${100 * 0.45 * state.zoom}px`
        , height: `${116 * 0.45 * state.zoom}px`
        , position: 'absolute'
    };
    const onclick = (e) => {
        if(p.side === state.side){
            $('#CONTEXT-PLAN-TOKEN-CLICK').contextMenu({x: e.pageX, y: e.pageY});
        }
    };
    let imageName: string = p.planState;
    if(p.planState === 'back-blue' || p.planState === 'back-red') imageName = 'back';

    const setPopup = (element) => {
        // SemanticUI ポップアップ初期化
        $(element).popup({
            hoverable: true,
            delay: {show: 500, hide: 0},
            onShow: function(): false | void{
                if(dragInfo.draggingFrom !== null) return false;
            },
            lastResort: true
        });
    }
  
    const oncreate = (element) => {
        //if(state.draggingFromCard !== null) return;
        setPopup(element);
    }

    let popupTitle: string = null;
    // 自分側の計略の場合のみ、内容を確認可能
    if(p.side === state.side){
        if(p.planState === 'back-blue') popupTitle = t('神算');
        if(p.planState === 'back-red') popupTitle = t('鬼謀');
    }

    return <img class={`plan-token ` + (p.side === state.side ? 'clickable' : '')} data-title={popupTitle} src={`//inazumaapps.info/furuyoni_simulator/deliv/furuyoni_commons/furuyoni_na/board_token/plan_${imageName}.png`} oncreate={oncreate} style={styles} onclick={onclick} />;
}