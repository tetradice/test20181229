import { h, app, View } from "hyperapp";
import { actions, ActionsType } from "./actions";
import { State } from "./state";

import * as css from "./view.css"
import _ from "lodash";
import { t } from "i18next";


// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}
const oncreate = (e) => {
    // ウインドウを移動可能にする
    $(e).draggable({
        cursor: "move",
        cancel: "input,textarea,button,select,option,a",
        opacity: 0.7,
        stop: function(){
            saveWindowState(e);
        },
    });

    // ウインドウの状態を復元
    let windowStateJson = localStorage.getItem(`${e.id}-WindowState`);
    if(windowStateJson){
        let windowState = JSON.parse(windowStateJson);
        $(e).css(windowState);
    } else {
        // 設定がなければ中央に配置
        $(e).css({left: window.innerWidth / 2 - $(e).outerWidth() / 2, top: window.innerHeight / 2 - $(e).outerHeight() / 2});
    }
};

// メインビューの定義
const view: View<State, ActionsType> = (state, actions) => {
    if(!state.shown) return null;

    let mainDiv: JSX.Element;
    if(state.currentQuiz === null){
        mainDiv = (
            <div style={{paddingTop: '4em', width: '100%'}}>
                <div class={`ui vertical menu`} style={{width: '70%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <a class="item" onclick={() => actions.setNewQuiz()}>
                        {t('miniquiz:開始')}
                    </a>
                    <a class="item" onclick={() => actions.hide()}>
                        {t('miniquiz:閉じる')}
                    </a>
                </div>
            </div>
        );
    } else {
        let answerItems: JSX.Element[] = [];
        state.currentQuiz.answers.forEach((answer, i) => {
            let answerClick = () => {
                actions.selectAnswer(i);
            };

            if(i === state.selectedAnswerIndex){
                // 回答した項目
                if(state.currentQuiz.answers[i].correct){
                    answerItems.push(<a class={`item ${css.correctArea}`} onclick={answerClick}>{answer.titleHtml}</a>);
                } else {
                    answerItems.push(<a class={`item ${css.incorrectArea}`} onclick={answerClick}>{answer.titleHtml}</a>);
                }
            } else {
                // 未回答項目
                if(state.selectedAnswerIndex !== null){
                    answerItems.push(<a class="item disabled">{answer.titleHtml}</a>);
                } else {
                    answerItems.push(<a class="item" onclick={answerClick}>{answer.titleHtml}</a>);
                }
            }
            
        });

        let result: JSX.Element = null;
        let nextButton: JSX.Element = null;
        if (state.selectedAnswerIndex !== null) {
            // 回答済み
            if (state.currentQuiz.answers[state.selectedAnswerIndex].correct) {
                result = (
                    <p class={css.correct}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}><i class="icon circle outline"></i></span> {t('miniquiz:正解')}
                    </p>
                );
            } else {
                result = (
                    <p class={css.incorrect}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}><i class="icon times"></i></span> {t('miniquiz:不正解')}
                    </p>
                );
            }

            nextButton = (
                <div>
                    <div class="ui vertical menu" style={{width: '100%', marginTop: '2em'}}>
                        <a class="item" onclick={() => actions.setNewQuiz()}>
                            {t('miniquiz:次の問題')}
                        </a>
                    </div>
                    <p style={{ textAlign: 'right' }}><a href="#" onclick={() => { $('#QUIZ-EXPLANATION').toggle(); return false }}>{t('miniquiz:解説を表示')}</a></p>
                    <div class="ui message" id="QUIZ-EXPLANATION" style={{display: 'none'}}>{state.currentQuiz.explanation}</div>
                </div>
            );

        }
        let summaryText: string;
        let totalCount = state.correctCount + state.incorrectCount;

        if(totalCount >= 1){
            let params = {
                totalCount: totalCount
                , correctCount: state.correctCount
                , correctPercentage: Math.round(state.correctCount * 100 / (totalCount))
            };
            t('miniquiz:N問中N問正解（正答率:N%）', params);
        } else {
            let params = {
                totalCount: totalCount
                , correctCount: 0
                , correctPercentage: 0
            };
            t('miniquiz:N問中N問正解（正答率:N%）', params);
        }

        mainDiv = (
            <div style={{paddingTop: '1em', width: '100%'}}>
                <p><strong>{t('miniquiz:問N', {number: state.questionNumber})}</strong>　{state.currentQuiz.text}</p>
                <div class="ui vertical menu" style={{width: '100%'}}>
                    {answerItems}
                </div>
                {result}
                {nextButton}
                <div style={{ position: 'absolute', fontSize: '0.8rem', color: 'gray', right: '2em', bottom: '1em' }}>{summaryText}</div>
            </div>
        );

    }

    return(
        <div id="QUIZ-WINDOW"
          class={`ui segment draggable ui-widget-content ${css.quizWindow}`}
          oncreate={oncreate}>
            <div class="ui top attached label">{t('miniquiz:ふるよにミニクイズ')}<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.hide()}><i class="times icon"></i></a></div>
            {mainDiv}
        </div>
    );
}

export default view;