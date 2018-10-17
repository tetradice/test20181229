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
    text: hyperapp.Children | hyperapp.Children[];
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

type QuizType = 'specialCost' | 'damage' | 'type';
const QuizTypeList: QuizType[] = [
    'specialCost'
    , 'damage'
    , 'damage'
    , 'type'
    , 'type'
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

        // 変数初期化
        let successCard: {id: string, data: CardDataItem};
        let failCards: {id: string, data: CardDataItem}[] = [];

        // ランダムに問題の種類を決定する
        let quizType = pick(QuizTypeList);

        // 問題の種類に応じた処理
        if(quizType === 'specialCost'){
            // 切札の消費問題
            // まずは対象となる切札カードを、消費付きですべて選出
            let targetCards = allCards.filter((card) => card.data.baseType === 'special' && card.data.cost !== undefined && /^[0-9]+$/.test(card.data.cost))
                                      .map((card) => _.assign({}, card, {cost: parseInt((card.data as SpecialCardDataItem).cost)}));

            // 条件を指定
            let condType = pick(['lower', 'higher', 'notEqual']);
            if(condType === 'lower'){
                // 消費n以下
                let border = pick([1, 2, 3, 4, 5]);
                successCard = pick(targetCards.filter((card) => card.cost <= border));
                failCards = pickMultiple(targetCards.filter((card) => card.cost > border), 3);
                quiz.text = `次のうち、消費が${border}以下の切札はどれ？`;
            }
            if(condType === 'higher'){
                // 消費n以上
                let border = pick([1, 2, 3, 4, 5, 6, 7]);
                successCard = pick(targetCards.filter((card) => card.cost >= border));
                // 消費がnより小さいカードを3枚抽出
                failCards = pickMultiple(targetCards.filter((card) => card.cost < border), 3);
                quiz.text = `次のうち、消費が${border}以上の切札はどれ？`;
            }
            if(condType === 'notEqual'){
                // 消費がnでない
                let v = pick([0, 1, 2, 3, 4, 5, 6]);
                successCard = pick(targetCards.filter((card) => card.cost !== v));
                failCards = pickMultiple(targetCards.filter((card) => card.cost === v), 3);
                quiz.text = `次のうち、消費が${v}でない切札はどれ？`;
            }
            // 回答をシャッフルして問題作成
            let cards = _.shuffle([].concat(successCard, failCards));
            let explanations: hyperapp.Children[] = ["各切札の消費は下記の通りです。", <br />];
            cards.forEach((card) => {
                quiz.addAnswer(this.getCardTitleHtml(card.data), (card === successCard));
                explanations.push(<br />, `${card.data.name}: ${card.cost}`);
            });
            quiz.explanation = explanations;
        }
        
        if(quizType === 'damage'){
            // ダメージ問題
            // まずは対象となる攻撃カードをすべて選出
            // (ユキヒのカードは除く)
            let targetCards = allCards.filter((card) => card.data.damage !== undefined && card.data.megami !== 'yukihi' && /^[0-9-]+\/[0-9-]+$/.test(card.data.damage))
                                         .map((card) => _.assign({}, card, {auraDamage: card.data.damage.split('/')[0], lifeDamage: card.data.damage.split('/')[1]}));

            // 条件を指定
            let condType = pick(['auraHigher', 'auraEqual', 'lifeEqual']);
            if(condType === 'auraHigher'){
                // オーラダメージn以上
                let border = pick([2, 2, 3, 3, 4]);
                successCard = pick(targetCards.filter((card) => card.auraDamage !== '-' && parseInt(card.auraDamage) >= border));
                failCards = pickMultiple(targetCards.filter((card) => card.auraDamage !== '-' && parseInt(card.auraDamage) <border), 3);
                quiz.text = <span>次のうち、オーラダメージが{border}以上の攻撃札はどれ？<br /><span style={{fontSize: '0.8em', color: 'gray'}}>(ダメージが "－" の札は除く)</span></span>
            }
            if(condType === 'auraEqual'){
                // オーラダメージがn
                let v = pick(['0', '1', '2', '2', '3', '3', '-']);
                successCard = pick(targetCards.filter((card) => card.auraDamage === v));
                failCards = pickMultiple(targetCards.filter((card) => card.auraDamage !== v), 3);
                quiz.text = <span>次のうち、オーラダメージが{v}の攻撃札はどれ？</span>
            }
            if(condType === 'lifeEqual'){
                // ライフダメージがn
                let v = pick(['0', '1', '1', '2', '2', '3', '3', '4', '5', '-']);
                successCard = pick(targetCards.filter((card) => card.lifeDamage === v));
                failCards = pickMultiple(targetCards.filter((card) => card.lifeDamage !== v), 3);
                quiz.text = <span>次のうち、ライフダメージが{v}の攻撃札はどれ？</span>
            }

            // 回答をシャッフルして問題作成
            let cards = _.shuffle([].concat(successCard, failCards));
            let explanations: hyperapp.Children[] = ["各カードのダメージは下記の通りです。", <br />];
            cards.forEach((card: typeof targetCards[0]) => {
                quiz.addAnswer(this.getCardTitleHtml(card.data), (card === successCard));
                explanations.push(<br />, `${card.data.name}: ${card.data.damage}`);
            });
            quiz.explanation = explanations;
        }
        if(quizType === 'type'){
            // カードタイプ問題
            // まずは対象となるカードをすべて選出
            let targetCards = allCards.map((card) => _.assign({}, card, {}));

            // 条件を指定
            let condType = pick(['fullpower', 'notFullpower', 'notAttack']);
            if(condType === 'fullpower'){
                // 全力を持つ
                successCard = pick(targetCards.filter((card) => card.data.types[1] === 'fullpower'));
                failCards = pickMultiple(targetCards.filter((card) => card.data.types[1] !== 'fullpower'), 3);
                quiz.text = <span>次のうち、「全力」カードはどれ？</span>
            }
            if(condType === 'notFullpower'){
                // 全力でない
                successCard = pick(targetCards.filter((card) => card.data.types[1] !== 'fullpower'));
                failCards = pickMultiple(targetCards.filter((card) => card.data.types[1] === 'fullpower'), 3);
                quiz.text = <span>次のうち、「全力」ではないカードはどれ？</span>
            }
            if(condType === 'notAttack'){
                // 攻撃でない
                // この問題の場合、明らかに攻撃であるカードは除外する
                // また、クルルのカードはすべて攻撃ではないため除外する
                targetCards = targetCards.filter(c => {
                    let name = c.data.name;
                    if(name === '一閃') return false;
                    if(name === '居合') return false;
                    if(/斬/.test(name)) return false;
                    if(name === '月影落') return false;
                    if(name === '天音揺波の底力') return false;
                    if(name === '八方振り') return false;
                    if(name === '氷雨細音の果ての果て') return false;
                    if(name === 'シュート') return false;
                    if(name === 'ラピッドファイア') return false;
                    if(name === 'マグナムカノン') return false;
                    if(name === 'フルバースト') return false;
                    if(name === 'レッドバレット') return false;
                    if(name === 'クリムゾンゼロ') return false;
                    if(/打ち/.test(name)) return false;
                    if(name === 'しこみばり / ふくみばり') return false;
                    if(name === 'ふりまわし / つきさし') return false;
                    if(/撃/.test(name)) return false;
                    if(name === '大地砕き') return false;
                    if(name === '大天空クラッシュ') return false;
                    if(name === '飛苦無') return false;
                    if(name === '毒針') return false;
                    if(name === '首切り') return false;
                    if(c.data.megami === 'kururu') return false;
                    if(/Edge/.test(name)) return false;
                    if(name === '雷螺風神爪') return false;
                    if(name === '刈取り') return false;

                    return true;
                });

                successCard = pick(targetCards.filter((card) => card.data.types[0] !== 'attack'));
                failCards = pickMultiple(targetCards.filter((card) => card.data.types[0] === 'attack'), 3);
                quiz.text = <span>次のうち、「攻撃」ではないカードはどれ？</span>
            }

            // 回答をシャッフルして問題作成
            let cards = _.shuffle([].concat(successCard, failCards));
            let explanations: hyperapp.Children[] = ["各カードのタイプは下記の通りです。", <br />];
            cards.forEach((card: typeof targetCards[0]) => {
                quiz.addAnswer(this.getCardTitleHtml(card.data), (card === successCard));
                let typeCaptions = [];
                if(card.data.types.indexOf('attack') >= 0) typeCaptions.push(<span class='card-type-attack'>攻撃</span>);
                if(card.data.types.indexOf('action') >= 0) typeCaptions.push(<span class='card-type-action'>行動</span>);
                if(card.data.types.indexOf('enhance') >= 0) typeCaptions.push(<span class='card-type-enhance'>付与</span>);
                if(card.data.types.indexOf('variable') >= 0) typeCaptions.push(<span class='card-type-variable'>不定</span>);
                if(card.data.types.indexOf('reaction') >= 0) typeCaptions.push(<span class='card-type-reaction'>対応</span>);
                if(card.data.types.indexOf('fullpower') >= 0) typeCaptions.push(<span class='card-type-fullpower'>全力</span>);
                explanations.push(<br />, `${card.data.name}: `, (typeCaptions.length === 2 ? [typeCaptions[0], '/', typeCaptions[1]] : typeCaptions[0]));
            });
            quiz.explanation = explanations;
        }



        
        return quiz;
    }




}

export const QuizMaker = new QuizMakerClass();
