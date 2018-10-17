import * as _ from "lodash";
import { Megami } from "sakuraba";
import * as utils from "sakuraba/utils";

export class Board implements state.Board {
    objects: state.Board['objects'];
    playerNames: state.Board['playerNames'];
    watchers: state.Board['watchers'];
    megamis: state.Board['megamis'];
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

    actionLog: state.LogRecord[];
    chatLog: state.LogRecord[];

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

    /** カード移動時などの領域情報一括更新 */
    updateRegionInfo(){
        let cards = this.getCards();
        let sideAndCardRegions = _.uniq(cards.map(c => [c.side, c.region, c.linkedCardId])) as [PlayerSide, CardRegion, string | null][];
        sideAndCardRegions.forEach(r => {
            let [side, region, linkedCardId] = r;

            let regionCards = this.getRegionCards(side, region, linkedCardId).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
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
                c.openState = utils.judgeCardOpenState(c, handOpenFlag);

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
        });
    }
}
