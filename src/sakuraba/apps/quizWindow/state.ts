import { Quiz } from "./quiz";

export interface State {
    shown: boolean;
    currentQuiz: Quiz;
    selectedAnswerIndex: number | null;
    questionNumber: number;
    correctCount: number;
    incorrectCount: number;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(): State{
        return {
              shown: true
            , currentQuiz: null
            , selectedAnswerIndex: null
            , questionNumber: 0
            , correctCount: 0
            , incorrectCount: 0
        };
    }
}