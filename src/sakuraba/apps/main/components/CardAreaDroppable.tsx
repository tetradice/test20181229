import { h } from "hyperapp";
import { ActionsType } from "../actions";
import * as sakuraba from "sakuraba";
import * as utils from "sakuraba/utils";

/** 領域枠 */
interface Param {
    region: CardRegion;
    side: PlayerSide;
    linkedCardId: string;
    
    left: number;
    top: number;
    width: number;
    height: number;
}

export const CardAreaDroppable = (p: Param) => (state: state.State, actions: ActionsType) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , width: `${p.width * state.zoom}px`
        , height: `${p.height * state.zoom}px`
        , position: 'relative'
    };
    // const dragover = (e: DragEvent) => {
    //     if (e.preventDefault) {
    //         e.preventDefault(); // Necessary. Allows us to drop.
    //     }
    //     e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    //     return false;
    // };
    // const dragenter = (e: DragEvent) => {
    //     actions.cardDragEnter({side: p.side, region: p.region});
    // };
    // const dragleave = (e: DragEvent) => {
    //     actions.cardDragLeave();
    // };
    // const drop = (e: DragEvent) => {
    //     if (e.stopPropagation) {
    //         e.stopPropagation(); // stops the browser from redirecting.
    //     }
    //     let currentState = actions.getState();
        
    //     // カードを移動 (リージョンが空でなければ)
    //     if(currentState.draggingHoverCardRegion){
    //         // 移動ログを決定
    //         let log: string;
    //         let cardName = sakuraba.CARD_DATA[currentState.draggingFromCard.cardId].name;
    //         let fromRegionTitle = utils.getCardRegionTitle(currentState.side, currentState.draggingFromCard.side, currentState.draggingFromCard.region);
    //         let toRegionTitle = utils.getCardRegionTitle(currentState.side, currentState.draggingHoverSide, currentState.draggingHoverCardRegion);

    //         log = `[${cardName}]を移動しました：${fromRegionTitle} → ${toRegionTitle}`;
    //         let cardNameLogging = false;
            
    //         // 一定の条件を満たす場合はログを置き換える
    //         if(currentState.draggingFromCard.region === 'hand' && currentState.draggingHoverCardRegion === 'hidden-used'){
    //             log = `[${cardName}]を伏せ札にしました`;
    //         }
    //         if(currentState.draggingFromCard.region === 'hand' && currentState.draggingHoverCardRegion === 'used'){
    //             log = `[${cardName}]を場に出しました`;
    //         }
    //         if(currentState.draggingFromCard.region === 'library' && currentState.draggingHoverCardRegion === 'hand'){
    //             log = `カードを1枚引きました`;
    //             cardNameLogging = true;
    //         }

    //         actions.operate({
    //             logText: log,
    //             proc: () => {
    //                 actions.moveCard({
    //                     from: currentState.draggingFromCard.id
    //                   , to: [currentState.draggingHoverSide, currentState.draggingHoverCardRegion] 
    //                   , cardNameLogging: cardNameLogging
    //                 });
    //             }
    //         });
    //     }

    //     return false;
    // };

    return (
        <div
         class="area droppable card-region"
         style={styles}
         data-side={p.side}
         data-region={p.region}
         data-linked-card-id={p.linkedCardId || 'none'}
         key={`CardAreaDroppable_${p.side}_${p.region}_${p.linkedCardId}`}
         ></div>
    );
}