import * as _ from "lodash";
import { Megami } from "sakuraba";

export class Board implements state.Board {
    objects: state.BoardObject[];
    playerNames: {p1: string, p2: string};
    megamis: {p1: Megami[], p2: Megami[]};
    vigors: {p1: VigorValue, p2: VigorValue};
    witherFlags: {p1: boolean, p2: boolean};
    firstDrawFlags: {p1: boolean, p2: boolean};
    mariganFlags: {p1: boolean, p2: boolean};

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
    getRegionCards(side: PlayerSide, region: CardRegion): state.Card[] {
        return this.objects.filter(v => v.type === 'card' && v.side === side && v.region === region) as state.Card[];
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
    getRegionSakuraTokens(side: PlayerSide, region: SakuraTokenRegion): state.SakuraToken[] {
        return this.objects.filter(v => v.type === 'sakura-token' && v.side === side && v.region == region) as state.SakuraToken[];
    }

    /** カード移動時などの領域情報一括更新 */
    updateRegionInfo(){
        let cards = this.getCards();
        let sideAndRegions = _.uniq(cards.map(c => [c.side, c.region])) as [PlayerSide, CardRegion][];
        sideAndRegions.forEach(r => {
            let [side, region] = r;

            let regionCards = this.getRegionCards(side, region).sort((a, b) => a.indexOfRegion - b.indexOfRegion);
            let index = 0;
            regionCards.forEach(c => {
                // インデックス更新
                c.indexOfRegion = index;
                index++;

                // 開閉状態更新
                c.opened = (region === 'used' || region === 'hand');

                // 回転状態更新
                c.rotated = (region === 'hidden-used');

                // known状態 (中身を知っているかどうか) 更新
                c.known.p1 = true;
                if(c.region === 'library') c.known.p1 = false; // 山札の場合は分からない

            });
        });
    }
}
