import { CARD_DATA, CardDataItem, SpecialCardDataItem, MEGAMI_DATA } from "sakuraba";
import _ from "lodash";
import { h } from "hyperapp";

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
    explanation: hyperapp.Children | hyperapp.Children[];

    addAnswer(titleHtml: hyperapp.Children | hyperapp.Children[], correct: boolean = false){
        let answer = new QuizAnswer();
        answer.titleHtml = titleHtml;
        answer.correct = correct;
        this.answers.push(answer);
    }
}

export class QuizAnswer {
    titleHtml: hyperapp.Children | hyperapp.Children[];
    correct: boolean;
}

export type QuizDifficult = 'normal' | 'hard';

type QuizType = 'specialCost';
const QuizTypeList: QuizType[] = [
    'specialCost'
]

class QuizMakerClass {
    difficult: QuizDifficult = 'normal';

    getCardTitleHtml(cardData: CardDataItem){
        let megamiName = MEGAMI_DATA[cardData.megami].name;
        if(cardData.megami === 'utsuro' && cardData.baseType === 'special'){
            // ウツロの切札のみ、読み仮名を付与 (読み仮名がないと判別しにくいため)
            return <span><ruby><rb>{cardData.name}</rb><rp>(</rp><rt>{cardData.ruby}</rt><rp>)</rp></ruby> ({megamiName})</span>
        } else {
            return <span>{cardData.name} ({megamiName})</span>
        }
    }

    /** 新しい設問を作成する */
    make(): Quiz{
        let quiz = new Quiz();

        // すべてのカード情報を取得
        let allCards: {id: string, data: CardDataItem}[] = [];
        for(let key in CARD_DATA){
            allCards.push({id: key, data: CARD_DATA[key]});
        }

        // ランダムに問題の種類を決定する
        let quizType = pick(QuizTypeList);

        // 問題の種類に応じた処理
        if(quizType === 'specialCost'){
            // 切札のコスト問題
            // まずは対象となる切札カードを、コスト付きですべて選出
            let targetCards = allCards.filter((card) => card.data.baseType === 'special' && card.data.cost !== undefined && /^[0-9]+$/.test(card.data.cost))
                                      .map((card) => _.assign({}, card, {cost: parseInt((card.data as SpecialCardDataItem).cost)}));

            // 条件を指定
            let condType = pick(['lower']);
            if(condType === 'lower'){
                // コストn以下
                let border = pick([1, 2, 3, 4, 5]);
                // コストn以下のカードを1枚抽出
                let successCard = pick(targetCards.filter((card) => card.cost <= border));
                // コストがnより大きいカードを3枚抽出
                let failCards = pickMultiple(targetCards.filter((card) => card.cost > border), 3);
                // 問題を作成
                quiz.text = `次のうち、コストが${border}以下の切札はどれ？`;

                let cards = _.shuffle([].concat(successCard, failCards));
                let explanations: hyperapp.Children[] = ["各切札のコストは下記の通りです。", <br />];
            
                cards.forEach((card) => {
                    quiz.addAnswer(this.getCardTitleHtml(card.data), (card === successCard));
                    explanations.push(<br />, `${card.data.name}: ${card.cost}`);
                });
                quiz.explanation = explanations;
            }
        }

        
        return quiz;
    }




}

export const QuizMaker = new QuizMakerClass();
