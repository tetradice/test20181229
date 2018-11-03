import { h, app, View } from "hyperapp";
import * as components from "./components";
import { actions, ActionsType } from "./actions";
import * as utils from "sakuraba/utils";
import * as models from "sakuraba/models";
import _ from "lodash";
import { CARD_DATA, MEGAMI_DATA } from "sakuraba";
import { MegamiTarots } from "sakuraba/apps/common/components";
import { StackedCards } from "sakuraba/apps/common/components/StackedCards";
import { BOARD_BASE_WIDTH } from "sakuraba/const";

/** レイアウト種別 */
type LayoutType = 'horizontal' | 'horizontal-distance' | 'vertical' | 'stacked';

/** 各種オブジェクトを配置する領域 */
type Params = {
    left: number;
    top: number;
    width: number;
    height: number;
    region: string;
    cardLayoutType?: LayoutType;
}

type LayoutResult<T extends state.BoardObject> = [T, number, number][];

/** オブジェクトの配置(座標の決定)を行う */
function layoutObjects<T extends state.BoardObject>(
      objects: T[]
    , layoutType: LayoutType
    , areaWidth: number
    , objectWidth: number
    , padding: number
    , spacing: number
): LayoutResult<T> {
    let ret: LayoutResult<T> = [];
    let cx = padding;
    let cy = padding;

    // カードを領域インデックス順に並べる
    objects = objects.sort((a, b) => a.indexOfRegion - b.indexOfRegion);

    // 横並びで配置する場合
    if(layoutType === 'horizontal'){
        let innerWidth = areaWidth - (padding * 2);
        let requiredWidth = objectWidth * objects.length + spacing * (objects.length - 1);
        
        if(requiredWidth <= innerWidth || objects.length <= 1){
            // 領域の幅に収まる場合か、オブジェクトが1つ以下の場合は、spacing分の間隔をあけて配置
            objects.forEach((child, i) => {
                ret.push([child, cx, cy]);

                cx += objectWidth;
                cx += spacing;
            });
        } else {
            // 領域の幅に収まらない場合は、収まるように均等に詰めて並べる
            let overlapWidth = ((objectWidth * objects.length) - innerWidth) / (objects.length - 1);
            objects.forEach((child, i) => {
                ret.push([child, cx, cy]);

                cx += objectWidth;
                cx -= overlapWidth;
            });        
        }
    }

    // 横並びで配置する場合 (間合用)
    if(layoutType === 'horizontal-distance'){
        let tokens = objects as state.SakuraToken[];
        
        // まず、通常の桜花結晶を配置
        tokens.filter(o => o.type === 'sakura-token' && !o.artificial).forEach((child, i) => {
            ret.push([child as T, cx, cy]);

            cx += objectWidth;
            cx += spacing;
        });

        // 次に、間合+1トークンとして配置されている造花結晶を配置
        tokens.filter(o => o.type === 'sakura-token' && o.artificial && !o.distanceMinus).forEach((child, i) => {
            ret.push([child as T, cx, cy]);

            cx += objectWidth;
            cx += spacing;
        });

        // 最後に、間合-1トークンとして配置されている造花結晶を、通常の結晶に重ねるように配置
        cx = spacing;
        tokens.filter(o => o.type === 'sakura-token' && o.artificial && o.distanceMinus).forEach((child, i) => {
            ret.push([child as T, cx + 1, cy + 1]);

            cx += objectWidth;
            cx += spacing;
        });
    }

    // 垂直に配置する場合 (padding, spacingは無視)
    if(layoutType === 'vertical'){
        objects.forEach((child, i) => {
            ret.push([child, cx, cy]);
            cy += 24;
        });
    }

    // 積み重ねる場合 (padding, spacingは無視)
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

    let selfSide = state.viewingSide;
    let opponentSide: PlayerSide = (state.viewingSide === 'p1' ? 'p2' : 'p1');

    // 各プレイヤーがサリヤを宿していて、かつ決闘開始済みかどうかを判定
    let hasMachineTarot = {
          p1: state.board.mariganFlags.p1 && state.board.megamis.p1.indexOf('thallya') >= 0
        , p2: state.board.mariganFlags.p2 && state.board.megamis.p2.indexOf('thallya') >= 0
    }
  
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
              { region: 'used',        side: opponentSide,  title: null, cardLayoutType: 'horizontal', left: 750,   top: 200,  width: 450, height: 160 }
            , { region: 'hidden-used', side: opponentSide,  title: null, cardLayoutType: 'stacked',    left: 560,  top: 200,  width: 170, height: 160, cardCountDisplay: true }
            , { region: 'library',     side: opponentSide,  title: null, cardLayoutType: 'stacked',    left: 380,  top: 200,  width: 160, height: 160, cardCountDisplay: true }
            , { region: 'hand',        side: opponentSide,  title: null, cardLayoutType: 'horizontal', left: (hasMachineTarot[opponentSide] ? 190 : 0) + 560, top: 30, width: (hasMachineTarot[opponentSide] ? 450 : 640), height: 160 }
            , { region: 'special',     side: opponentSide,  title: null, cardLayoutType: 'horizontal', left: (hasMachineTarot[opponentSide] ? 200 : 0) + 10,  top: 30, width: 330, height: 160 }

            // 自分
            , { region: 'used',        side: selfSide, title: "使用済み", cardLayoutType: 'horizontal', left: 10,   top: 430,  width: 450, height: 160 }
            , { region: 'hidden-used', side: selfSide, title: "伏せ札",   cardLayoutType: 'stacked',    left: 480,  top: 430,  width: 170, height: 160, cardCountDisplay: true }
            , { region: 'library',     side: selfSide, title: "山札",     cardLayoutType: 'stacked',    left: 670,  top: 430,  width: 160, height: 160, cardCountDisplay: true }
            , { region: 'hand',        side: selfSide, title: "手札",     cardLayoutType: 'horizontal', left: 10,   top: 600, width: (hasMachineTarot[selfSide] ? 450 : 640), height: 160 }
            , { region: 'special',     side: selfSide, title: "切札",     cardLayoutType: 'horizontal', left: (hasMachineTarot[selfSide] ? 670 : 850),  top: 600, width: 330, height: 160 }
    ];

    // 桜花決闘を開始していなければ、自陣営の全エリア非表示
    // 代わりに全体枠1つだけを表示
    let READY_AREA_LOCATIONS: {[side: string]: [number, number]} = {};
    ['p1', 'p2'].forEach((side: PlayerSide) => {
        READY_AREA_LOCATIONS[side] = (side === state.viewingSide ? [10, 430] : [380, 30]);

        if(!state.board.mariganFlags[side]){
            // 最初の手札を引いており、引き直しの有無を選択していない場合は、手札だけは表示する (タイトルなし)
            if(state.board.firstDrawFlags[side]){
                _.remove(cardAreaData, a => a.side === side && a.region !== 'hand');
                cardAreaData.find(a => a.side === side && a.region === 'hand').title = null;
            } else {
                _.remove(cardAreaData, a => a.side === side);
            }
            cardAreaData.push({
                  region: null
                , side: side
                , title: null
                , cardLayoutType: 'horizontal'
                , left: READY_AREA_LOCATIONS[side][0]
                , top: READY_AREA_LOCATIONS[side][1]
                , width: 820
                , height: 330
            });
        }

    });

    // 追加札を持つメガミを宿しており、かつメガミ公開済みの場合のみ、追加札領域を追加
    ['p1', 'p2'].forEach((side: PlayerSide) => {
        if(state.board.megamis[side] &&
        state.board.megamiOpenFlags[side] &&
        state.board.megamis[side].find((megami) => megami === 'chikage' || megami === 'kururu' || megami === 'thallya' || megami === 'raira')){
            cardAreaData.push({
                  region: 'extra'
                , side: side
                , title: (side === state.viewingSide ? '追加札' : '')
                , cardLayoutType: 'vertical'
                , left: 1220
                , top: (side === state.viewingSide ? 430 : 30)
                , width: 120
                , height: 340
            });
        }
    });

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
            { region: 'aura', side: opponentSide, title: "オーラ", layoutType: 'horizontal', left: 10, top: 200, width: 220, tokenWidth: 130, height: 30 }
            , { region: 'life', side: opponentSide, title: "ライフ", layoutType: 'horizontal', left: 10, top: 240, width: 350, tokenWidth: 260, height: 30 }
            , { region: 'flair', side: opponentSide, title: "フレア", layoutType: 'horizontal', left: 10, top: 280, width: 350, tokenWidth: 260, height: 30 }

          , { region: 'distance', side: null, title: "間合",   layoutType: 'horizontal-distance', left: 10,    top: 380,  width: 350, tokenWidth: 260, height: 30 }
          , { region: 'dust',     side: null, title: "ダスト", layoutType: 'horizontal', left: 380,   top: 380,  width: 350, tokenWidth: 260, height: 30 }

            , { region: 'aura', side: selfSide, title: "オーラ", layoutType: 'horizontal', left: 850, top: 430, width: 220, tokenWidth: 130, height: 30 }
            , { region: 'life', side: selfSide, title: "ライフ", layoutType: 'horizontal', left: 850, top: 470, width: 350, tokenWidth: 260, height: 30 }
            , { region: 'flair', side: selfSide, title: "フレア", layoutType: 'horizontal', left: 850, top: 510, width: 350, tokenWidth: 260, height: 30 }
        ];

    // サリヤを宿しており、かつ決闘開始済の場合、マシン領域と燃焼済を追加
    ['p1', 'p2'].forEach((side: PlayerSide) => {
        if(hasMachineTarot[side]){
            sakuraTokenAreaData.push({
                  region: 'machine'
                , side: side
                , title: 'STEAM ENGINE'
                , layoutType: 'horizontal'
                , left: (side === state.viewingSide ? 1010 : 50)
                , top: (side === state.viewingSide ? 600 : 140)
                , width: 150
                , height: 50
                , tokenWidth: 130
            });

            sakuraTokenAreaData.push({
                region: 'burned'
              , side: side
              , title: 'BURNED'
              , layoutType: 'horizontal'
              , left: (side === state.viewingSide ? 1010 : 50)
              , top: (side === state.viewingSide ? 660 : 80)
              , width: 150
              , height: 50
              , tokenWidth: 130
          });
        }
    });


    let frameNodes: hyperapp.Children[] = [];
    let objectNodes: hyperapp.Children[] = [];
    let cardLocations: {[id: string]: [number, number]} = {};

    // 通常カードを配置
    cardAreaData.forEach((area) => {
        // 指定された領域のカードをすべてインデックス順に取得
        let cards = boardModel.getRegionCards(area.side, area.region, null);

        // 指定されたレイアウト情報に応じて、カードをレイアウトし、各カードの座標を決定
        let layoutResults = layoutObjects(cards, area.cardLayoutType, area.width, 100, 8, 6);

        // カードを領域の子オブジェクトとして追加
        layoutResults.forEach((ret) => {
            let card = ret[0];
            let left = area.left + ret[1];
            let top = area.top + ret[2];

            // 相手側の場合はカードの座標を逆転
            if(area.side === opponentSide){
                let minus = (card.rotated || (card.region === 'used' && CARD_DATA[card.cardId].baseType === 'transform') ? 140 : 100);
                left = area.left + (area.width - ret[1] - minus);
            }

            objectNodes.push(<components.BoardCard target={card} left={left} top={top} />);

            // 座標を記憶しておく
            cardLocations[card.id] = [left, top];
        });

        // フレームを追加
        frameNodes.push(<components.CardAreaBackground side={area.side} region={area.region} title={area.title} left={area.left} top={area.top} width={area.width} height={area.height} cardCount={area.cardCountDisplay ? cards.length : null} />);
        frameNodes.push(<components.CardAreaDroppable side={area.side} region={area.region} linkedCardId={null} left={area.left} top={area.top} width={area.width} height={area.height} />);
    });

    // 通常桜花結晶を配置
    sakuraTokenAreaData.forEach((area) => {
        // 指定された領域の桜花結晶をすべてインデックス順に取得
        let tokens = boardModel.getRegionSakuraTokens(area.side, area.region, null);

        // 指定されたレイアウト情報に応じて、桜花結晶をレイアウトし、各桜花結晶の座標を決定
        let layoutResults = layoutObjects(tokens, area.layoutType, area.tokenWidth, 20, 2, 6);

        // 桜花結晶を領域の子オブジェクトとして追加
        layoutResults.forEach((ret) => {
            let token = ret[0];
            let left = area.left + ret[1];
            let top = area.top + ret[2];

            objectNodes.push(<components.SakuraToken target={token} left={left} top={top} />);
        });

        // フレームを追加
        let count = (area.region === 'distance' ? boardModel.getDistance() : tokens.length);
        frameNodes.push(<components.SakuraTokenAreaBackground side={area.side} region={area.region} title={area.title} left={area.left} top={area.top} width={area.width} height={area.height} tokenCount={count} />);
        frameNodes.push(<components.SakuraTokenAreaDroppable side={area.side} region={area.region} linkedCardId={null} left={area.left} top={area.top} width={area.width} height={area.height} />);
    });
    
    // カード下に封印されているカードは別扱い
    let sealedCards = state.board.objects.filter(o => o.type === 'card' && o.region === 'on-card') as state.Card[];
    let sealedCardsLinkedCardIds = _.uniq(sealedCards.map(token => token.linkedCardId));
    
    sealedCardsLinkedCardIds.forEach((linkedCardId) => {
        // そのカードに封印されている全カードを取得
        let sealdCards = sealedCards.filter(o => o.linkedCardId === linkedCardId);
        let baseCard = state.board.objects.find(o => o.id === linkedCardId) as state.Card;
        let cardLocation = cardLocations[baseCard.id];

        // 封印されたカードをレイアウトし、各カードの座標を決定
        let layoutResults = layoutObjects(sealdCards, 'stacked', 0, 100, 0, 0);

        layoutResults.forEach((ret) => {
            let card = ret[0];
            let left = cardLocation[0] + 8 + ret[1];
            let top = cardLocation[1] + 8 + ret[2];
            objectNodes.push(<components.BoardCard target={card} left={left} top={top} />);
        });
    });

    // カード上にある桜花結晶は別扱い
    let onCardTokens = state.board.objects.filter(o => o.type === 'sakura-token' && o.region === 'on-card') as state.SakuraToken[];
    let tokenLinkedCardIds = _.uniq(onCardTokens.map(token => token.linkedCardId));
    
    tokenLinkedCardIds.forEach((linkedCardId) => {
        // そのカードにひも付いている全桜花結晶を取得
        let tokens = onCardTokens.filter(o => o.linkedCardId === linkedCardId);
        let card = state.board.objects.find(o => o.id === linkedCardId) as state.Card;
        let cardLocation = cardLocations[card.id];

        // 桜花結晶をレイアウトし、各桜花結晶の座標を決定
        let layoutResults = layoutObjects(tokens, 'horizontal', 100 - 12, 26, 0, 0);

        layoutResults.forEach((ret) => {
            let token = ret[0];
            let draggingCount = tokens.length - token.indexOfRegion;
            let left = cardLocation[0] + ret[1];
            let top = cardLocation[1] + (card.side === selfSide ? 24 : (140 - 24 - 26));
            objectNodes.push(<components.SakuraToken target={token} left={left} top={top} />);
        });
    });

    // カードを封印することが可能な全カードについて、ドロップ領域を配置
    let sealableCards = state.board.objects.filter(o => o.type === 'card' && (o.region === 'used' || o.region === 'special') && CARD_DATA[o.cardId].sealable && o.openState === 'opened') as state.Card[];
    sealableCards.forEach(card => {
        let cardLocation = cardLocations[card.id];
        frameNodes.push(<components.CardAreaDroppable side={card.side} region="on-card" linkedCardId={card.id} left={cardLocation[0]} top={cardLocation[1]} width={100} height={140} />);
    });

    // 桜花結晶を載せることが可能な全カードについて、ドロップ領域を配置
    let tokenDroppableCards = state.board.objects.filter(o => o.type === 'card' && (o.region === 'used' || o.region === 'special') && CARD_DATA[o.cardId].types.find(t => t === 'enhance') && o.openState === 'opened') as state.Card[];
    tokenDroppableCards.forEach(card => {
        let cardLocation = cardLocations[card.id];
        frameNodes.push(<components.SakuraTokenAreaDroppable side={card.side} region="on-card" linkedCardId={card.id} left={cardLocation[0]} top={cardLocation[1]} width={100} height={140} />);
    });

    // メガミによっては追加トークン類を並べる
    const addExtraToken = (tokens: JSX.Element[], side: PlayerSide, left: number, top: number) => {
        let cx = left;

        // メガミ未選択時はスキップ
        let megamis = state.board.megamis[side];
        if(megamis === null) return;

        for(let megamiIndex = 0; megamiIndex <= 1; megamiIndex++){
            // ユキヒを選択しており、傘の状態を初期化済みであれば表示
            if(megamis[megamiIndex] === 'yukihi' && state.board.umbrellaStatus[side] !== null){
                tokens.push(<components.UmbrellaToken side={side} umbrellaState={state.board.umbrellaStatus[side]} left={cx} top={top} />);
                cx += 60;
            }

            // シンラを選択しており、計略の状態を初期化済みであれば表示
            if(megamis[megamiIndex] === 'shinra' && state.board.planStatus[side] !== null){
                tokens.push(<components.PlanToken side={side} planState={state.board.planStatus[side]} left={cx} top={top} />);
                cx += 50;
            }

            // ライラを選択しており、風雷ゲージの状態を初期化済みであれば表示
            if(megamis[megamiIndex] === 'raira' && state.board.windGuage[side] !== null){
                tokens.push(<components.WindAndThunderGuage side={side} wind={state.board.windGuage[side]} thunder={state.board.thunderGuage[side]} left={cx} top={top} />);
                cx += 190;
            }
        }
    }

    let extraTokens = [];
    addExtraToken(extraTokens, selfSide, 850, 545);
    addExtraToken(extraTokens, opponentSide, 10, 315);

    let megamiNumber = 0;
    for(let key in MEGAMI_DATA){
        megamiNumber++;
    }

    // 準備中オブジェクトの配置
    let readyObjects = [];
    let mainProcessButtonLeft: number = 0;

    ['p1', 'p2'].forEach((side: PlayerSide) => {
        // プレイヤー名が決まっていない場合はスキップ
        if(state.board.playerNames[side] === null) return true;

        let [readyAreaLeft, readyAreaTop] = READY_AREA_LOCATIONS[side];
        if(!state.board.megamiOpenFlags[side]){
            // メガミ選択中の場合
            readyObjects.push(<MegamiTarots left={readyAreaLeft + 40} top={readyAreaTop + 20} zoom={state.zoom} stackedCount={megamiNumber - (state.board.megamis[side] !== null ? 2 : 0)} />);
            if(state.board.megamis[side] !== null){
                readyObjects.push(<MegamiTarots left={readyAreaLeft + 570} top={readyAreaTop + 40} zoom={state.zoom} stackedCount={1} />);
                readyObjects.push(<MegamiTarots left={readyAreaLeft + 680} top={readyAreaTop + 40} zoom={state.zoom} stackedCount={1} />);
            }

            if(side === state.side){
                mainProcessButtonLeft = 260;
            }
        } else if(!state.board.firstDrawFlags[side]){
            // デッキ構築中の場合
            let deckBuilded = boardModel.getSideCards(side).length >= 1;

            readyObjects.push(<StackedCards left={readyAreaLeft + 40} top={readyAreaTop + 20} zoom={state.zoom} stackedCount={14 - (deckBuilded ? 7 : 0)} baseClass="back-normal" />);
            readyObjects.push(<StackedCards left={readyAreaLeft + 170} top={readyAreaTop + 20} zoom={state.zoom} stackedCount={8 - (deckBuilded ? 3 : 0)}  baseClass="back-special" />);
            if(deckBuilded){
                let baseLeft = (side === state.viewingSide ? 850 : 10);;
                let baseTop = (side === state.viewingSide ? 560 : 30);
                readyObjects.push(<StackedCards left={baseLeft} top={baseTop} zoom={state.zoom} stackedCount={7} baseClass="back-normal" />);
                readyObjects.push(<StackedCards left={baseLeft + 130} top={baseTop} zoom={state.zoom} stackedCount={3}  baseClass="back-special" />);
            }

            if(side === state.side){
                mainProcessButtonLeft = 340;
            }

        } else if(!state.board.mariganFlags[side]){
            // 手札引き直しを選択中の場合
            if(side === state.side){
                mainProcessButtonLeft = 450;
            }
        }

        return true;
    });

    let selfSideMagemi1FaceLeft = 10;
    let selfSideMagemi1FaceTop = (state.board.firstDrawFlags[selfSide] ? 430 : 630);
    let selfSideMagemi2FaceLeft = (state.board.firstDrawFlags[selfSide] ?  (hasMachineTarot[selfSide] ? 40 : 240) : (10 + 820 - 390));
    let selfSideMageme2FaceTop = (state.board.firstDrawFlags[selfSide] ? 600 : 630);
    let selfSideMagemiSize = (state.board.firstDrawFlags[selfSide] ?  [480, 160] : [390, 130]);
    let opponentSideMagemi1FaceLeft = (state.board.firstDrawFlags[opponentSide] ? 720 : (380 + 820 - 480));
    let opponentSideMagemi2FaceLeft = (state.board.firstDrawFlags[opponentSide] ? (hasMachineTarot[opponentSide] ? 690 : 490) : (380 + 820 - 480));
    let opponentSideMagemiSize = [480, 160];

    return (
        <div id="BOARD-PLAYAREA" style={{width: `${BOARD_BASE_WIDTH * state.zoom}px`}}>
            {objectNodes}
            {frameNodes}
            <components.Vigor side={opponentSide} left={(hasMachineTarot[opponentSide] ? 190 : 0) + 390} top={60} />
            <components.Vigor side={selfSide} left={680 - (hasMachineTarot[selfSide] ? 190 : 0)} top={630} />
            <components.WitheredToken side={opponentSide} left={(hasMachineTarot[opponentSide] ? 190 : 0) + 390} top={60} />
            <components.WitheredToken side={selfSide} left={680 - (hasMachineTarot[selfSide] ? 190 : 0)} top={630} />
            <components.ControlPanel />
            <components.ChatLogArea logs={state.chatLog} />
            <components.ActionLogWindow logs={state.actionLog} shown={state.actionLogVisible} />
            <components.HelpWindow shown={state.helpVisible} />
            <components.SettingWindow shown={state.settingVisible} />
            <components.BGMWindow shown={state.bgmPlaying} />
            {extraTokens}
            <components.PlayerNameDisplay left={10} top={10} width={1200} side={utils.flipSide(selfSide)} />
            <components.PlayerNameDisplay left={10} top={770} width={1200} side={selfSide} />

            <components.MainProcessButtons left={mainProcessButtonLeft} />
            {readyObjects}
            {state.side !== 'watcher' && hasMachineTarot[selfSide] ? <components.MachineButtons side={selfSide} left={1010} top={720}></components.MachineButtons> : null}
            {state.board.megamis[selfSide] && state.board.megamiOpenFlags[selfSide] && state.setting.megamiFaceViewMode === 'background1' ? <components.MegamiFace megami={state.board.megamis[selfSide][0]} left={selfSideMagemi1FaceLeft} top={selfSideMagemi1FaceTop} width={selfSideMagemiSize[0]} height={selfSideMagemiSize[1]} /> : null}
            {state.board.megamis[selfSide] && state.board.megamiOpenFlags[selfSide] && state.setting.megamiFaceViewMode === 'background1' ? <components.MegamiFace megami={state.board.megamis[selfSide][1]} left={selfSideMagemi2FaceLeft} top={selfSideMageme2FaceTop}  width={selfSideMagemiSize[0]} height={selfSideMagemiSize[1]}/> : null}
            {state.board.megamis[opponentSide] && state.board.megamiOpenFlags[opponentSide] && state.setting.megamiFaceViewMode === 'background1' ? <components.MegamiFace megami={state.board.megamis[opponentSide][0]} left={opponentSideMagemi1FaceLeft} top={200}  width={opponentSideMagemiSize[0]} height={opponentSideMagemiSize[1]}/> : null}
            {state.board.megamis[opponentSide] && state.board.megamiOpenFlags[opponentSide] && state.setting.megamiFaceViewMode === 'background1' ? <components.MegamiFace megami={state.board.megamis[opponentSide][1]} left={opponentSideMagemi2FaceLeft} top={30}  width={opponentSideMagemiSize[0]} height={opponentSideMagemiSize[1]}/> : null}
        </div>
    );
}

export default view;