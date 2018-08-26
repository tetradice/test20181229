import { h, app, View } from "hyperapp";
import * as components from "./components";
import { actions, ActionsType } from "./actions";
import * as utils from "sakuraba/utils";
import * as models from "sakuraba/models";

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
        let requiredWidth = objectWidth * objects.length + spacing * (objects.length - 1);
        
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
const view: View<state.State, ActionsType> = (state, actions) => {
    let boardModel = new models.Board(state.board);

    let selfSide = state.side;
    let opponentSide: PlayerSide = (state.side === 'p1' ? 'p2' : 'p1');

    // 各領域ごとにフレーム、カード、桜花結晶の配置を行う
    let cardAreaData: {
          region: CardRegion
        , side: PlayerSide
        , title: string
        , cardLayoutType: LayoutType
        , left: number
        , top: number
        , width: number
        , height: number
        , cardCountDisplay?: boolean
    }[] = [
            // 対戦相手
              { region: 'used',        side: opponentSide,  title: null, cardLayoutType: 'horizontal', left: 750,   top: 180,  width: 450, height: 160 }
            , { region: 'hidden-used', side: opponentSide,  title: null, cardLayoutType: 'stacked',    left: 560,  top: 180,  width: 170, height: 160, cardCountDisplay: true }
            , { region: 'library',     side: opponentSide,  title: null, cardLayoutType: 'stacked',    left: 380,  top: 180,  width: 160, height: 160, cardCountDisplay: true }
            , { region: 'hand',        side: opponentSide,  title: null, cardLayoutType: 'horizontal', left: 560,   top: 10, width: 640, height: 160 }
            , { region: 'special',     side: opponentSide,  title: null, cardLayoutType: 'horizontal', left: 10,  top: 10, width: 330, height: 160 }

            // 自分
            , { region: 'used',        side: selfSide, title: "使用済み", cardLayoutType: 'horizontal', left: 10,   top: 410,  width: 450, height: 160 }
            , { region: 'hidden-used', side: selfSide, title: "伏せ札",   cardLayoutType: 'stacked',    left: 480,  top: 410,  width: 170, height: 160, cardCountDisplay: true }
            , { region: 'library',     side: selfSide, title: "山札",     cardLayoutType: 'stacked',    left: 670,  top: 410,  width: 160, height: 160, cardCountDisplay: true }
            , { region: 'hand',        side: selfSide, title: "手札",     cardLayoutType: 'horizontal', left: 10,   top: 580, width: 640, height: 160 }
            , { region: 'special',     side: selfSide, title: "切札",     cardLayoutType: 'horizontal', left: 850,  top: 580, width: 330, height: 160 }
    ];

    let sakuraTokenAreaData: {
        region: SakuraTokenRegion
      , side: PlayerSide
      , title: string
      , layoutType: LayoutType
      , left: number
      , top: number
      , width: number
      , tokenWidth: number
      , height: number
  }[] = [
            { region: 'aura',     side: opponentSide, title: "オーラ", layoutType: 'horizontal', left: 10,   top: 180,  width: 350, tokenWidth: 280, height: 30 }
          , { region: 'life',     side: opponentSide, title: "ライフ", layoutType: 'horizontal', left: 10,   top: 220,  width: 350, tokenWidth: 280, height: 30 }
          , { region: 'flair',    side: opponentSide, title: "フレア", layoutType: 'horizontal', left: 10,   top: 260,  width: 350, tokenWidth: 280, height: 30 }

          , { region: 'distance', side: null, title: "間合",   layoutType: 'horizontal', left: 10,    top: 360,  width: 350, tokenWidth: 280, height: 30 }
          , { region: 'dust',     side: null, title: "ダスト", layoutType: 'horizontal', left: 380,   top: 360,  width: 350, tokenWidth: 280, height: 30 }

          , { region: 'aura',     side: selfSide, title: "オーラ", layoutType: 'horizontal', left: 850,   top: 410,  width: 350, tokenWidth: 280, height: 30 }
          , { region: 'life',     side: selfSide, title: "ライフ", layoutType: 'horizontal', left: 850,   top: 450,  width: 350, tokenWidth: 280, height: 30 }
          , { region: 'flair',    side: selfSide, title: "フレア", layoutType: 'horizontal', left: 850,   top: 490,  width: 350, tokenWidth: 280, height: 30 }
          
      ];

    let frameNodes: hyperapp.Children[] = [];
    let objectNodes: hyperapp.Children[] = [];

    cardAreaData.forEach((area) => {
        // 指定された領域のカードをすべてインデックス順に取得
        let cards = boardModel.getRegionCards(area.side, area.region);

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
        frameNodes.push(<components.CardAreaBackground side={area.side} region={area.region} title={area.title} left={area.left} top={area.top} width={area.width} height={area.height} cardCount={area.cardCountDisplay ? cards.length : null} />);
        frameNodes.push(<components.CardAreaDroppable side={area.side} region={area.region} left={area.left} top={area.top} width={area.width} height={area.height} />);
    });

    sakuraTokenAreaData.forEach((area) => {
        // 指定された領域の桜花結晶をすべてインデックス順に取得
        let tokens = boardModel.getRegionSakuraTokens(area.side, area.region);

        // 指定されたレイアウト情報に応じて、桜花結晶をレイアウトし、各桜花結晶の座標を決定
        let layoutResults = layoutObjects(tokens, area.layoutType, area.tokenWidth, 20, 2, 8);

        // 桜花結晶を領域の子オブジェクトとして追加
        layoutResults.forEach((ret) => {
            let token = ret[0] as state.SakuraToken;
            let left = area.left + ret[1];
            let top = area.top + ret[2];
            objectNodes.push(<components.SakuraToken target={token} left={left} top={top} />);
        });

        // フレームを追加
        frameNodes.push(<components.SakuraTokenAreaBackground side={area.side} region={area.region} title={area.title} left={area.left} top={area.top} width={area.width} height={area.height} tokenCount={tokens.length} />);
        frameNodes.push(<components.SakuraTokenAreaDroppable side={area.side} region={area.region} left={area.left} top={area.top} width={area.width} height={area.height} />);
    });

    return (
        <div style={{ position: 'relative', zIndex: 100 }}>
            {objectNodes}
            {frameNodes}
            <components.Vigor side={opponentSide} left={390} top={40} />
            <components.Vigor side={selfSide} left={680} top={610} />
            <components.WitheredToken side={opponentSide} left={390} top={40} />
            <components.WitheredToken side={selfSide} left={680} top={610} />
            <components.ControlPanel />
            <components.MariganButton left={10} top={750} />
            <components.ActionLogWindow logs={state.actionLog} shown={state.actionLogVisible} />
        </div>
    );
}

export default view;