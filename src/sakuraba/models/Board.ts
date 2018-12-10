import * as _ from "lodash";
import { Megami, CARD_DATA, CardDataItem } from "sakuraba";
import * as utils from "sakuraba/utils";
import * as models from "sakuraba/models";

export class Board implements state.Board {
    objects: state.Board['objects'];
    playerNames: state.Board['playerNames'];
    watchers: state.Board['watchers'];
    megamis: state.Board['megamis'];
    cardSet: state.Board['cardSet'];
    vigors: state.Board['vigors'];
    witherFlags: state.Board['witherFlags'];
    megamiOpenFlags: state.Board['megamiOpenFlags'];
    firstDrawFlags: state.Board['firstDrawFlags'];
    mariganFlags: state.Board['mariganFlags'];
    handOpenFlags: state.Board['handOpenFlags'];
    handCardOpenFlags: state.Board['handCardOpenFlags'];
    planStatus: state.Board['planStatus'];
    umbrellaStatus: state.Board['umbrellaStatus'];
    windGuage: state.Board['windGuage'];
    thunderGuage: state.Board['thunderGuage'];

    constructor(original?: state.Board, deepCloning?: boolean){
        if(original !== undefined){
            if(deepCloning === true){
                _.merge(this, original);
            } else {
                _.extend(this, original);
            }
        }
    }

    static clone(original: state.Board): Board{
        return new Board(original, true);
    }

    /** 指定したカードのカード情報を取得（複製済みでゅーぷりぎあがあればそれも考慮する） */
    getCardData(card: state.Card, language: string): models.CardData {
        if(card.cardId === '10-kururu-o-s-3-ex1'){ // でゅーぷりぎあ
            // でゅーぷりぎあの場合、複製対象のカードがあるかどうかを探す
            // (でゅーぷりぎあ所有者の切札に使用済みのいんだすとりあがあり、かつ何かのカードが封印されていれば、それを複製する)
            // 複製しているカードがあればその情報を返す
            let usedIndustria = this.getRegionCards(card.ownerSide, 'special', null).find(c => c.specialUsed && c.cardId === '10-kururu-o-s-3'); // いんだすとりあ
            if(usedIndustria){
                let sealedCards = this.getRegionCards(usedIndustria.side, 'on-card', usedIndustria.id);
                if(sealedCards.length >= 1){
                    return new models.CardData(card.cardId, language, sealedCards[0].cardId);
                }
            }
        }

        // でゅーぷりぎあ以外のカードか、複製元がないでゅーぷりぎあなら、通常通りカード情報を取得
        return new models.CardData(card.cardId, language);
    }

    /** すべてのカードを取得 */
    getCards(): state.Card[] {
        return this.objects.filter(v => v.type === 'card') as state.Card[];
    } 

    /** 指定したIDのカードを取得 */
    getCard(objectId: string): state.Card {
        return this.objects.find(v => v.type === 'card' && v.id === objectId) as state.Card;
    }

    /** 指定したサイドのカードを一括取得 */
    getSideCards(side: PlayerSide): state.Card[] {
        return this.objects.filter(v => v.type === 'card' && v.side === side) as state.Card[];
    }

    /** 指定した領域にあるカードを一括取得 */
    getRegionCards(side: PlayerSide, region: CardRegion, linkedCardId: string | null): state.Card[] {
        return this.objects.filter(v => v.type === 'card' && v.side === side && v.region === region && v.linkedCardId === linkedCardId) as state.Card[];
    }

    /** 指定したカードの下に封印されているカードを一括取得 */
    getSealedCards(baseCardId: string): state.Card[]{
        let sealedCards = this.objects.filter(o => o.type === 'card' && o.region === 'on-card' && o.linkedCardId === baseCardId) as state.Card[];
        return sealedCards;
    }

    /** すべての桜花結晶を取得 */
    getSakuraTokens(): state.SakuraToken[] {
        return this.objects.filter(v => v.type === 'sakura-token') as state.SakuraToken[];
    } 

    /** 指定したIDの桜花結晶を取得 */
    getSakuraToken(objectId: string): state.SakuraToken {
        return this.objects.find(v => v.type === 'sakura-token' && v.id === objectId) as state.SakuraToken;
    }

    /** 指定した領域にある桜花結晶を一括取得 */
    getRegionSakuraTokens(side: PlayerSide, region: SakuraTokenRegion, linkedCardId: string): state.SakuraToken[] {
        return this.objects.filter(v => v.type === 'sakura-token' && v.side === side && v.region == region && v.linkedCardId == linkedCardId) as state.SakuraToken[];
    }

    /** 間合にある、指定したグループの桜花結晶を一括取得 */
    getDistanceSakuraTokens(group: state.SakuraTokenGroup): state.SakuraToken[] {
        return this.objects.filter(v => v.type === 'sakura-token' && v.side === null && v.region == 'distance' && v.linkedCardId == null && v.group === group) as state.SakuraToken[];
    }

    /** 現在の間合の値を取得 (騎動分も加味する) */
    getDistance(): number {
        let tokens = this.getRegionSakuraTokens(null, 'distance', null);

        return tokens.filter(x => !(x.artificial && x.distanceMinus)).length - tokens.filter(x => x.artificial && x.distanceMinus).length;
    }

    /** 現在の間合にいくつ分の結晶が置かれているかを取得 (間合-1トークン除く) */
    getDistanceTokenCount(): number {
        let flatTokens = this.getRegionSakuraTokens(null, 'distance', null).filter(t => !t.distanceMinus); // 間合-1トークンを除いたすべての結晶を取得

        return flatTokens.length;
    }


    /** 指定数の騎動前進が実行可能かどうか */
    isRideForwardEnabled(side: PlayerSide, moveNumber: number): boolean {
        let activeSakuraTokens = this.getDistanceSakuraTokens('normal'); // 有効な桜花結晶を取得
        let machineTokens = this.getRegionSakuraTokens(side, 'machine', null);

        return machineTokens.length >= moveNumber && moveNumber <= activeSakuraTokens.length; // 造花結晶数が必要な数あり、かつ移動数 <= 有効な桜花結晶数なら移動可能
    }

    /** 指定数の騎動後退が実行可能かどうか */
    isRideBackEnabled(side: PlayerSide, moveNumber: number): boolean {
        let machineTokens = this.getRegionSakuraTokens(side, 'machine', null);
        return machineTokens.length >= moveNumber && this.getDistanceTokenCount() + moveNumber <= 10; // 造花結晶数が必要な数あり、かつボード上に置かれている結晶数（間合-1トークン除く） + 移動数 が10を超えなければ移動可能
    }

    /** 各基本動作が実行可能かどうかを一括チェック */
    checkBasicActionEnabled(side: PlayerSide) {
        let distanceCount = this.getDistanceTokenCount();
        let distanceNormalTokens = this.getDistanceSakuraTokens('normal');
        let dustCount = this.getRegionSakuraTokens(null, 'dust', null).length;
        let myAuraCount = this.getRegionSakuraTokens(side, 'aura', null).length;

        return {
            // 前進は間合に通常の桜花結晶が1つ以上あり、オーラ5未満なら可能
              forward: distanceNormalTokens.length >= 1 && myAuraCount < 5
            // 離脱はダスト1以上、間合10未満なら可能
            , leave: dustCount >= 1 && distanceCount < 10
            // 後退はオーラ1以上、間合10未満なら可能
            , back: myAuraCount >= 1 && distanceCount < 10
            // 纏いはダスト1以上、オーラ5未満なら可能
            , wear: dustCount >= 1 && myAuraCount < 5
            // 宿しはオーラ1以上なら可能
            , charge: myAuraCount >= 1
        };
    }

    /** カード移動時などの領域情報一括更新 */
    updateRegionInfo(){
        let cards = this.getCards();
        let sideAndCardRegions = _.uniq(cards.map(c => [c.side, c.region, c.linkedCardId])) as [PlayerSide, CardRegion, string | null][];
        sideAndCardRegions.forEach(r => {
            let [side, region, linkedCardId] = r;

            let regionCards = this.getRegionCards(side, region, linkedCardId);
            // 追加札は常にカードID順でソート、それ以外は以前の順序でソート。ただしTransformカードは後ろに並べる
            if (region === 'extra') {
                regionCards = _.sortBy(regionCards, [((c: state.Card) => c.cardId)]);
            } else {
                regionCards = _.sortBy(regionCards, [((c: state.Card) => CARD_DATA[this.cardSet][c.cardId].baseType), ((c: state.Card) => c.indexOfRegion)]);
            }

            let index = 0;
            regionCards.forEach(c => {
                // インデックス更新
                c.indexOfRegion = index;
                index++;

                // 対象のカードが手札にない場合、手札から公開しているフラグを強制的にOFF
                if(region !== 'hand' && this.handCardOpenFlags[c.side][c.id]){
                    this.handCardOpenFlags[c.side][c.id] = false;
                }

                // 対象のカードが使用済みでも切札でもない場合、帯電解除フラグを強制的にOFF
                if(region !== 'used' && region !== 'special' && c.discharged){
                    c.discharged = false;
                }

                // 開閉状態更新
                let handOpenFlag = this.handOpenFlags[c.side] || this.handCardOpenFlags[c.side][c.id];
                c.openState = utils.judgeCardOpenState(this.cardSet, c, handOpenFlag);

                // 回転状態更新
                c.rotated = (region === 'hidden-used') || c.discharged;
            });
        });

        let tokens = this.getSakuraTokens();
        let sideAndSakuraTokenRegions = _.uniq(tokens.map(c => [c.side, c.region, c.linkedCardId])) as [PlayerSide, SakuraTokenRegion, string][];
        sideAndSakuraTokenRegions.forEach(r => {
            let [side, region, linkedCardId] = r;

            let regionSakuraTokens = this.getRegionSakuraTokens(side, region, linkedCardId).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
            let index = 0;
            regionSakuraTokens.forEach(c => {
                // インデックス更新
                c.indexOfRegion = index;
                index++;
            });

            // グループ情報も更新する
            if (region === 'distance') {
                let normalTokens = regionSakuraTokens.filter(t => !t.artificial);
                let artificialTokens = regionSakuraTokens.filter(t => t.artificial);
                let distanceMinusTokens = regionSakuraTokens.filter(t => t.artificial && t.distanceMinus);

                // いくつの桜花結晶が有効かを数える (通常の桜花結晶数 - 間合-1トークン数)
                let activeNormalTokenCount = normalTokens.length - distanceMinusTokens.length;

                // 造花結晶のグループを振る
                let artificialTokensP1 = artificialTokens.filter(t => t.ownerSide === 'p1');
                let artificialTokensP2 = artificialTokens.filter(t => t.ownerSide === 'p2');
                artificialTokensP1.forEach((c, i) => {
                    c.group = 'artificial-p1';
                    c.groupTokenDraggingCount = artificialTokensP1.length; // ドラッグ時には全造花結晶をまとめて操作
                });
                artificialTokensP2.forEach((c, i) => {
                    c.group = 'artificial-p2';
                    c.groupTokenDraggingCount = artificialTokensP2.length; // ドラッグ時には全造花結晶をまとめて操作
                });


                // 通常の桜花結晶は、間合-1トークンの数だけ無効
                // それ以外は有効
                let activeIndex = 0;
                for(let i = 0; i < normalTokens.length; i++){
                    let c = normalTokens[i];
                    if(i < distanceMinusTokens.length){
                        c.group = 'inactive';
                        c.groupTokenDraggingCount = 0; // ドラッグ不可
                    } else {
                        c.group = 'normal';
                        c.groupTokenDraggingCount = activeNormalTokenCount - activeIndex;
                        activeIndex++;
                    }
                }
            } else {
                // 通常の場合は、全トークン同じグループに属する
                regionSakuraTokens.forEach((c, i) => {
                    c.group = 'normal';
                    c.groupTokenDraggingCount = regionSakuraTokens.length - i;
                });
            }
        });
    }
}
