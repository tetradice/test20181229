import { h, app, View } from "hyperapp";
import * as components from "./components";
import { actions, ActionsType } from "./actions";
import * as utils from "./utils";

/** レイアウト種別 */
type LayoutType = 'horizontal' | 'stacked';

/** 各種オブジェクトを配置する領域 */
type Params = {
    left: number;
    top: number;
    width: number;
    height: number;
    region: string;
    cardLayoutType?: LayoutType;
}

type LayoutResult = [state.Card, number, number][];

/** カードの配置(座標の決定)を行う */
function layoutCards(cards: state.Card[], layoutType: LayoutType, areaWidth: number, cardWidth: number): LayoutResult {
    let padding = 8;
    let ret: LayoutResult = [];
    let cx = padding;
    let cy = padding;

    // カードを領域インデックス順に並べる
    cards = cards.sort((a, b) => a.indexOfRegion - b.indexOfRegion);

    // 横並びで配置する場合
    if(layoutType === 'horizontal'){
        let spacing = 2;
        let innerWidth = areaWidth - (padding * 2);
        let requiredWidth = cardWidth * cards.length + padding * (cards.length - 1);
        
        if(requiredWidth <= innerWidth){
            // 領域の幅に収まる場合は、spacing分の間隔をあけて配置
            cards.forEach((child, i) => {
                ret.push([child, cx, cy]);

                cx += cardWidth;
                cx += spacing;
            });
        } else {
            // 領域の幅に収まらない場合は、収まるように均等に詰めて並べる
            let overlapWidth = ((cardWidth * cards.length) - innerWidth) / cards.length;
            cards.forEach((child, i) => {
                ret.push([child, cx, cy]);

                cx += cardWidth;
                cx -= overlapWidth;
            });        
        }
    }

    // 積み重ねる場合
    if(layoutType === 'stacked'){
        cards.forEach((child, i) => {
            ret.push([child, cx, cy]);
            cx += 6;
            cy += 2;
        });
    }

    return ret;
}

// メインビューの定義
export const view: View<state.State, ActionsType> = (state, actions) => {
    // 各領域ごとにフレーム、カード、桜花結晶の配置を行う
    let areaData: {
        region: CardRegion
        , cardLayoutType: LayoutType
        , left: number
        , top: number
        , width: number
        , height: number
    }[] = [
            { region: 'used', cardLayoutType: 'horizontal', left: 0, top: 80, width: 450, height: 150 }
            , { region: 'hidden-used', cardLayoutType: 'stacked', left: 470, top: 80, width: 170, height: 140 }
            , { region: 'library', cardLayoutType: 'stacked', left: 720, top: 80, width: 160, height: 160 }
            , { region: 'hand', cardLayoutType: 'horizontal', left: 0, top: 250, width: 700, height: 150 }
            , { region: 'special', cardLayoutType: 'horizontal', left: 250, top: 720, width: 330, height: 150 }
        ];

    let frameNodes: hyperapp.Children[] = [];
    let objectNodes: hyperapp.Children[] = [];

    areaData.forEach((area) => {
        // 指定された領域のカードをすべてインデックス順に取得
        let cards = utils.getCards(state, area.region);

        // 指定されたレイアウト情報に応じて、カードをレイアウトし、各カードの座標を決定
        let layoutResults = layoutCards(cards, area.cardLayoutType, area.width, 100);

        // カードを領域の子オブジェクトとして追加
        layoutResults.forEach((ret) => {
            let card = ret[0];
            let left = area.left + ret[1];
            let top = area.top + ret[2];
            objectNodes.push(<components.Card target={card} left={left} top={top} />);
        });

        // フレームを追加
        frameNodes.push(<components.AreaFrame left={area.left} top={area.top} width={area.width} height={area.height} />);
    });

    return (
        <div style={{ position: 'relative', zIndex: 100 }}>
            {objectNodes}
            {frameNodes}
            <components.ControlPanel />
        </div>
    );
}
