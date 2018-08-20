export function confirmModal(desc: string, yesCallback: (this: JQuery, $element: JQuery) => false | void){
    $('#CONFIRM-MODAL .description').html(desc);
    $('#CONFIRM-MODAL')
        .modal({closable: false, onApprove:yesCallback})
        .modal('show');
}

/** メッセージを表示する */
export function messageModal(desc: string){
    $('#MESSAGE-MODAL .description').html(desc);
    $('#MESSAGE-MODAL')
        .modal({closable: false})
        .modal('show');
}
