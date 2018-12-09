import { Quiz } from "./quiz";

export interface State {
    shown: boolean;
    cardSet: CardSet;
    currentQuiz: Quiz;
    selectedAnswerIndex: number | null;
    questionNumber: number;
    correctCount: number;
    incorrectCount: number;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(cardSet: CardSet): State{
        return {
              shown: true
            , cardSet: cardSet
            , currentQuiz: null
            , selectedAnswerIndex: null
            , questionNumber: 0
            , correctCount: 0
            , incorrectCount: 0
        };
    }
}