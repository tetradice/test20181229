export function confirmModal(desc: string, yesCallback: (this: JQuery, $element: JQuery) => (false | void)){
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');

    $('#CONFIRM-MODAL .description').html(desc);
    $('#CONFIRM-MODAL')
        .modal({closable: false, onApprove:yesCallback})
        .modal('show');
}

/** メッセージを表示する */
export function messageModal(desc: string){
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');

    $('#MESSAGE-MODAL .description').html(desc);
    $('#MESSAGE-MODAL')
        .modal({closable: false})
        .modal('show');
}

/** 任意のモーダルを表示する */
export function showModal(modalSelector: string){
    $(modalSelector)
        .modal({closable: false})
        .modal('show');
}

/** 入力ボックスを表示する */
export function userInputModal(desc: string, decideCallback: (this: JQuery, $element: JQuery) => false | void){
    // すべてのポップアップを非表示にする
    $('.fbs-card').popup('hide all');

    $('#INPUT-MODAL .description-body').html(desc);
    $('#INPUT-MODAL')
        .modal({closable: false, onApprove:decideCallback})
        .modal('show');
}
