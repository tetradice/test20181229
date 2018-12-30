import { h, Children } from "hyperapp";
import moment from "moment";
import * as utils from "sakuraba/utils";
import { ActionsType } from "../actions";
import { ZIndex } from "sakuraba/const";
import { t } from "i18next";
import { isJsxClosingFragment } from "typescript";
import i18next = require("i18next");

// ウインドウの表示状態をローカルストレージに保存
function saveWindowState(elem: HTMLElement){
    let current = {display: $(elem).css('display'), left: $(elem).css('left'), top: $(elem).css('top')};
    localStorage.setItem(`${elem.id}-WindowState`, JSON.stringify(current));
}

/** 設定ウインドウ */
export const SettingWindow = (p: {shown: boolean}) => (state: state.State, actions: ActionsType) => {
    if(p.shown){
        const oncreate = (e) => {
            // ウインドウを移動可能にする
            $(e).draggable({
                cursor: "move", 
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

            $(e).find('.ui.checkbox').checkbox();
            $(e).find('.ui.checkbox[data-key=MEGAMI-FACE-VIEW-MODE]').checkbox({
                onChange: function(){
                    let checked = $(this).closest('.ui.checkbox').checkbox('is checked');
                    
                    actions.setMegamiFaceSetting(checked ? 'background1' : 'none');
                    localStorage.setItem('Setting', JSON.stringify(actions.getState().setting));
                }
            });
        };

        const imageEnabledChange = (e: Event) => {
            actions.setCardImageEnabled($(e.target).val() === 'en');

            // ローカルストレージに保存
            localStorage.setItem('Setting', JSON.stringify(actions.getState().setting));
        };

        const languageChange = (e: Event) => {
            let newLanguage = $(e.target).val() as Language;

            // 処理前にローダーを表示して言語をロード
            $('#LOADER').addClass('active');
            i18next.loadLanguages(newLanguage, () => {
                // i18nextの言語を変更
                i18next.changeLanguage(newLanguage);

                // 言語設定の変更
                actions.setLanguage(newLanguage);

                // ローカルストレージに保存
                localStorage.setItem('Setting', JSON.stringify(actions.getState().setting));

                $('#LOADER').removeClass('active');
            });

        };
        
        let cardImageSelectArea: hyperapp.Children = null;
        // if(state.setting.language.ui === 'en'){
        //     cardImageSelectArea = (
        //         <div class="inline field">
        //             <label>{t('カード画像の表示')}</label>
        //             <select class="ui dropdown" onchange={imageEnabledChange}>
        //                 <option value="">{t('カード画像-なし')}</option>
        //                 <option value="en" selected={state.setting.cardImageEnabledTestEn}>{t('カード画像-英語')}</option>
        //             </select>
        //         </div>
        //     );
        // }

        return (
            <div id="SETTING-WINDOW"
             style={{position: 'absolute', width: "35rem", paddingBottom: '3rem', backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: ZIndex.FLOAT_WINDOW}}
              class="ui segment draggable ui-widget-content resizable"
              oncreate={oncreate}>
                <div class="ui top attached label">{t('設定')}<a style={{display: 'block', float: 'right', padding: '2px'}} onclick={() => actions.toggleSettingVisible()}><i class="times icon"></i></a></div>
                <form class="ui form">
                    <div class="inline field">
                        <div class={`ui checkbox`} data-key="MEGAMI-FACE-VIEW-MODE">
                            <input type="checkbox" class="hidden" checked={(state.setting.megamiFaceViewMode === 'background1' ? true : undefined)} />
                            <label>{t('メガミのフェイスアップ画像表示')}</label>
                        </div>
                    </div>
                    <div class="inline field">
                        <label>{t('表示言語')}</label>
                        <select class="ui dropdown" onchange={languageChange}>
                            <option value="ja" selected={state.setting.language.ui === 'ja'}>日本語</option>
                            <option value="en" selected={state.setting.language.ui === 'en'}>English</option>
                            <option value="zh-Hans" selected={state.setting.language.ui === 'zh-Hans'}>简体中文</option>
                        </select>
                    </div>
                    {cardImageSelectArea}

                </form>
            </div>
        )
    } else {
        return null;
    }
}