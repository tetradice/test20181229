export function confirmModal(desc: string, yesCallback: (this: JQuery, $element: JQuery) => false | void){
    $('#CONFIRM-MODAL .description').html(desc);
    $('#CONFIRM-MODAL')
        .modal({closable: false, onApprove:yesCallback})
        .modal('show');
}
