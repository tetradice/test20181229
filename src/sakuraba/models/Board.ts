import * as _ from "lodash";
import { Megami } from "../../sakuraba";

export class Board implements state.Board {
    objects: state.BoardObject[];
    playerNames: {p1: string, p2: string};
    megamis: {p1: Megami[], p2: Megami[]};

    actionLog: state.LogRecord[];
    chatLog: state.LogRecord[];

    constructor(original?: state.Board){
        if(original !== undefined){
            _.merge(this, original);
        }
    }

    getCards(): state.Card[] {
        return this.objects.filter(v => v.type === 'card') as state.Card[];
    } 

    /** 指定した領域にあるカードを一括取得 */
    getRegionCards(region: CardRegion): state.Card[] {
        return this.objects.filter(v => v.type === 'card' && v.region == region) as state.Card[];
    }

    /** カード移動時などの領域情報一括更新 */
    updateRegionInfo(){
        let cards = this.getCards();
        let regions = _.uniq(cards.map(c => c.region));
        regions.forEach(r => {
            let regionCards = this.getRegionCards(r);
            let index = 0;
            regionCards.forEach(c => {
                // インデックス更新
                c.indexOfRegion = index;
                index++;

                // 開閉状態更新
                c.opened = (r === 'used' || r === 'hand');

                // 回転状態更新
                c.rotated = (r === 'hidden-used');

                // known状態 (中身を知っているかどうか) 更新
                c.known.p1 = true;
                if(c.region === 'library') c.known.p1 = false; // 山札の場合は分からない

            });
        });
    }
}
