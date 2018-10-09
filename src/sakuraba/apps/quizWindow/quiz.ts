import { CARD_DATA, CardDataItem } from "sakuraba";

// 指定した配列から1つの要素をランダムに選出して返す
function pick<T>(array: T[]): T | null{
    let list = pickMultiple(array, 1);
    if(list === null) return null;
    return list[0];
}

// 指定した配列から複数の要素をランダムに選出して返す
function pickMultiple<T>(array: T[], num: number): T[] | null{
    if(array === undefined || array === null || array.length === 0){
        return null;
    }

    let cloned = array.concat();
    let ret: T[] = [];
    for(let i = 0; i < num; i++){
        let index = Math.floor(Math.random() * cloned.length);
        ret.push(cloned.splice(index, 1)[0]);
    }
    return ret;
}

export class Quiz {
    text: string;
    answers: QuizAnswer[] = [];
}

export class QuizAnswer {
    title: string;
    correct: boolean;
}

export type QuizDifficult = 'normal' | 'hard';

type QuizType = 'specialCost';
const QuizTypeList: QuizType[] = [
    'specialCost'
]

class QuizMakerClass {
    difficult: QuizDifficult = 'normal';

    /** 新しい設問を作成する */
    make(): Quiz{
        let quiz = new Quiz();

        // すべてのカード情報を取得
        let allCards: [string, CardDataItem][] = [];
        for(let key in CARD_DATA){
            allCards.push([key, CARD_DATA[key]]);
        }

        // ランダムに問題の種類を決定する
        let quizType = pick(QuizTypeList);

        // 問題の種類に応じた処理
        if(quizType === 'specialCost'){
            // 切札のコスト問題
            // まずは対象となる切札カードをすべて選出
            let targetCards = allCards.filter(([cardId, card]) => card.baseType === 'special' && card.cost !== undefined && /^[0-9]+$/.test(card.cost));

            return quiz;
        }
    }




}

export const QuizMaker = new QuizMakerClass();
