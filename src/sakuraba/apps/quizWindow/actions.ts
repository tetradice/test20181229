import { WiredActions } from 'hyperapp-types';
import { State } from './state';
import { QuizMaker } from './quiz';

export const actions = {
    hide: () => {
        return {shown: false};
    },
    setNewQuiz: () => (state: State) => {
        let quizMaker = new QuizMaker(state.cardSet, state.language);
        let newQuiz = quizMaker.make();
        
        return {
              currentQuiz: newQuiz
            , selectedAnswerIndex: null
            , questionNumber: state.questionNumber + 1
        } as Partial<State>;
    },
    selectAnswer: (index: number) => (state: State) => {
        let answer = state.currentQuiz.answers[index];

        return {
              selectedAnswerIndex: index
            , correctCount: (answer.correct ? state.correctCount + 1 : state.correctCount)
            , incorrectCount: (!answer.correct ? state.incorrectCount + 1 : state.incorrectCount)
        } as Partial<State>;
    }
};

export type ActionsType = WiredActions<State, typeof actions>;
