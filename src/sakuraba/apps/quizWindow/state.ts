import { Quiz } from "./quiz";

export interface State {
    shown: boolean;
    currentQuiz: Quiz;
    selectedAnswerIndex: number | null;
}

export namespace State {
    /** 新しいstateの生成 */
    export function create(): State{
        return {
              shown: true
            , currentQuiz: null
            , selectedAnswerIndex: null
        };
    }
}