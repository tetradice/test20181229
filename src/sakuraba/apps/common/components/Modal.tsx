import { h, View } from "hyperapp";
import { CARD_SETS } from "sakuraba";
import * as utils from "sakuraba/utils";
import { t } from "i18next";

interface Param {
    variation?: 'fullscreen' | 'mini' | 'tiny' | 'small' | 'large';
    onApprove?(this: JQuery, $element: JQuery): false | void;
    onDeny?(this: JQuery, $element: JQuery): false | void;
    onHidden?(this: JQuery): void;
    closable?: boolean;
}

/** モーダル */
export const Modal = (p: Param, children: hyperapp.Children) => {
    const onModalCreate = (elem: HTMLElement) => {
        $(elem).modal({
            onApprove: p.onApprove,
            onDeny: p.onDeny,
            onHidden: p.onHidden,
            detachable: false,
            closable: p.closable
        }).modal('show');
    };

    return (
        <div style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">
            <div class={`ui modal ${p.variation || 'small'}`} style={{position: 'absolute', zIndex: '10001'}} oncreate={onModalCreate}>
                <div class="content">
                    {children}
                </div>
                <div class="actions">
                    <div class="ui positive labeled icon button">
                        {t('決定')} <i class="checkmark icon"></i>
                    </div>
                    <div class="ui black deny button">
                        {t('キャンセル')}
                    </div>
                </div>
            </div>
        </div>
    );
}