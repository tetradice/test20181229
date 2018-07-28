import { h, app, View } from "hyperapp";
import * as components from "./components";
import { actions, ActionsType } from "./actions";
import * as utils from "./utils";
import * as models from "./models";

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

type LayoutResult = [state.BoardObject, number, number][];

/** オブジェクトの配置(座標の決定)を行う */
function layoutObjects(
    objects: state.BoardObject[]
    , layoutType: LayoutType
    , areaWidth: number
    , objectWidth: number
    , padding: number
    , spacing: number
): LayoutResult {
    let ret: LayoutResult = [];
    let cx = padding;
    let cy = padding;

    // カードを領域インデックス順に並べる
    objects = objects.sort((a, b) => a.indexOfRegion - b.indexOfRegion);

    // 横並びで配置する場合
    if(layoutType === 'horizontal'){
        let innerWidth = areaWidth - (padding * 2);
        let requiredWidth = objectWidth * objects.length + padding * (objects.length - 1);
        
        if(requiredWidth <= innerWidth){
            // 領域の幅に収まる場合は、spacing分の間隔をあけて配置
            objects.forEach((child, i) => {
                ret.push([child, cx, cy]);

                cx += objectWidth;
                cx += spacing;
            });
        } else {
            // 領域の幅に収まらない場合は、収まるように均等に詰めて並べる
            let overlapWidth = ((objectWidth * objects.length) - innerWidth) / objects.length;
            objects.forEach((child, i) => {
                ret.push([child, cx, cy]);

                cx += objectWidth;
                cx -= overlapWidth;
            });        
        }
    }

    // 積み重ねる場合
    if(layoutType === 'stacked'){
        objects.forEach((child, i) => {
            ret.push([child, cx, cy]);
            cx += 6;
            cy += 2;
        });
    }

    return ret;
}

// メインビューの定義
export const view: View<state.State, ActionsType> = (state, actions) => {
    let boardModel = new models.Board(state.board);

    // 各領域ごとにフレーム、カード、桜花結晶の配置を行う
    let cardAreaData: {
          region: CardRegion
        , title: string
        , cardLayoutType: LayoutType
        , left: number
        , top: number
        , width: number
        , height: number
        , cardCountDisplay?: boolean
    }[] = [
              { region: 'used',        title: "使用済み", cardLayoutType: 'horizontal', left: 0,   top: 80,  width: 450, height: 160 }
            , { region: 'hidden-used', title: "伏せ札",   cardLayoutType: 'stacked',    left: 470, top: 80,  width: 170, height: 140, cardCountDisplay: true }
            , { region: 'library',     title: "山札",     cardLayoutType: 'stacked',    left: 720, top: 80,  width: 160, height: 160, cardCountDisplay: true }
            , { region: 'hand',        title: "手札",     cardLayoutType: 'horizontal', left: 0,   top: 250, width: 700, height: 160 }
            , { region: 'special',     title: "切札",     cardLayoutType: 'horizontal', left: 250, top: 720, width: 330, height: 160 }
    ];

    let sakuraTokenAreaData: {
        region: SakuraTokenRegion
      , title: string
      , layoutType: LayoutType
      , left: number
      , top: number
      , width: number
      , height: number
  }[] = [
            { region: 'aura',     title: "オーラ", layoutType: 'horizontal', left: 10,   top: 400,  width: 400, height: 30 }
          , { region: 'life',     title: "ライフ", layoutType: 'horizontal', left: 10,   top: 440,  width: 400, height: 30 }
          , { region: 'flair',    title: "フレア", layoutType: 'horizontal', left: 10,   top: 480,  width: 400, height: 30 }
      ];


    let frameNodes: hyperapp.Children[] = [];
    let objectNodes: hyperapp.Children[] = [];

    cardAreaData.forEach((area) => {
        // 指定された領域のカードをすべてインデックス順に取得
        let cards = utils.getCards(state, area.region);

        // 指定されたレイアウト情報に応じて、カードをレイアウトし、各カードの座標を決定
        let layoutResults = layoutObjects(cards, area.cardLayoutType, area.width, 100, 8, 6);

        // カードを領域の子オブジェクトとして追加
        layoutResults.forEach((ret) => {
            let card = ret[0] as state.Card;
            let left = area.left + ret[1];
            let top = area.top + ret[2];
            objectNodes.push(<components.Card target={card} left={left} top={top} />);
        });

        // フレームを追加
        frameNodes.push(<components.CardAreaBackground region={area.region} title={area.title} left={area.left} top={area.top} width={area.width} height={area.height} cardCount={area.cardCountDisplay ? cards.length : null} />);
        frameNodes.push(<components.CardAreaDroppable region={area.region} left={area.left} top={area.top} width={area.width} height={area.height} />);
    });

    sakuraTokenAreaData.forEach((area) => {
        // 指定された領域の桜花結晶をすべてインデックス順に取得
        let tokens = boardModel.getRegionSakuraTokens(area.region);

        // 指定されたレイアウト情報に応じて、桜花結晶をレイアウトし、各桜花結晶の座標を決定
        let layoutResults = layoutObjects(tokens, area.layoutType, area.width, 20, 2, 10);

        // 桜花結晶を領域の子オブジェクトとして追加
        layoutResults.forEach((ret) => {
            let token = ret[0] as state.SakuraToken;
            let left = area.left + ret[1];
            let top = area.top + ret[2];
            objectNodes.push(<components.SakuraToken target={token} left={left} top={top} />);
        });

        // フレームを追加
        frameNodes.push(<components.SakuraTokenAreaBackground region={area.region} title={area.title} left={area.left} top={area.top} width={area.width} height={area.height} tokenCount={tokens.length} />);
        frameNodes.push(<components.SakuraTokenAreaDroppable region={area.region} left={area.left} top={area.top} width={area.width} height={area.height} />);
    });


    return (
        <div style={{ position: 'relative', zIndex: 100 }}>
            {objectNodes}
            {frameNodes}
            <components.Vigor left={720} top={280} />
            <components.ControlPanel />
        </div>
    );
}
