import { h } from "hyperapp";
import { t } from "i18next";

interface Param {
    variation?: 'fullscreen' | 'mini' | 'tiny' | 'small' | 'large';
    onShow?: SemanticUI.ModalSettings['onShow']
    onApprove?: SemanticUI.ModalSettings['onApprove']
    onDeny?: SemanticUI.ModalSettings['onDeny']
    onHidden?: SemanticUI.ModalSettings['onHidden']
    closable?: SemanticUI.ModalSettings['closable']
}

/** モーダル */
export const Modal = (p: Param, children: hyperapp.Children) => {
    const onModalCreate = (elem: HTMLElement) => {
        $(elem).modal({
            onShow: p.onShow,
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