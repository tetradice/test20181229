import { WiredActions } from 'hyperapp-types';
import { State } from './state';
import { QuizMaker } from './quiz';

export const actions = {
    hide: () => {
        return {shown: false};
    },
    setNewQuiz: () => (state: State) => {
        let newQuiz = QuizMaker.make();
        
        return {currentQuiz: newQuiz, selectedAnswerIndex: null} as Partial<State>;
    },
    selectAnswer: (index: number) => (state: State) => {
        return {selectedAnswerIndex: index} as Partial<State>;
    }
};

export type ActionsType = WiredActions<State, typeof actions>;
