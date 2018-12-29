import i18next, { t } from 'i18next';
//import LocizeBackend from 'i18next-locize-backend';
import FetchBackend from 'i18next-fetch-backend';
import BackendAdapter from 'i18next-multiload-backend-adapter';
import moment = require('moment');

declare var params: {
    environment: 'production' | 'development';
    lang: Language;
}

$(function () {
    try {
        // 言語設定の初期化。初期化完了後にメイン処理に入る
        i18next
            .use(BackendAdapter)
            .init({
                defaultNS: 'common'
                , lng: params.lang // 言語設定はexpressが判別したものを引き継ぐ
                , ns: ['common', 'toppage']
                , parseMissingKeyHandler: (k: string) => `[${k}]`
                , fallbackLng: false
                , backend: {
                    backend: FetchBackend
                    , backendOption: {
                        allowMultiLoading: true
                        , loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}'
                    }
                }
            }, function () {
                var tableHistory = JSON.parse(localStorage.getItem('tableHistory'));
                if (tableHistory === null) tableHistory = [];
                ($('.ui.accordion') as any).accordion({ duration: 100 });

                if (tableHistory.length >= 1) {
                    tableHistory.forEach(function (data) {
                        var dt = new Date(data.time);
                        $('.ui.accordion').append('<div class="title"><i class="dropdown icon"></i>' + t('toppage:TIMEに作成した卓', { time: moment(dt).format('YYYY/M/D HH:mm:ss') }) + '</div>');
                        $('.ui.accordion').append(`<div class="content">${t('toppage:プレイヤー1の参加用URL')}: <a target="_blank" href="` + data.p1Url + '">' + data.p1Url + `</a><br />${t('toppage:プレイヤー2の参加用URL')}: <a target="_blank" href="` + data.p2Url + '">' + data.p2Url + `</a><br />${t('toppage:観戦用URL')}: <a target="_blank" href="` + data.watchUrl + '">' + data.watchUrl + '</a><br /></div>');
                    });
                    $('.ui.accordion').show();
                } else {
                    $('#HISTORY-NO-DATA-DESC').show();
                }


                $('#NEW-BOARD-BUTTON').click(function (e) {
                    $('.ui.loader').addClass('active');

                    $.post('tables.create', function (data, textStatus) {
                        $('#P1-URL').text(data.p1Url).attr('href', data.p1Url);
                        $('#P2-URL').text(data.p2Url).attr('href', data.p2Url);
                        $('#WATCH-URL').text(data.watchUrl).attr('href', data.watchUrl);
                        $('#RESULT-AREA').show();

                        // 作った卓のURLをローカルストレージに記憶
                        var pushedData = $.extend({}, data, { time: Date.now() });
                        tableHistory.unshift(pushedData);
                        localStorage.setItem("tableHistory", JSON.stringify(tableHistory));

                        $('.ui.accordion').prepend(`<div class="content">${t('toppage:プレイヤー1の参加用URL')}: <a target="_blank" href="` + pushedData.p1Url + '">' + pushedData.p1Url + `</a><br />${t('toppage:プレイヤー2の参加用URL')}: <a target="_blank" href="` + pushedData.p2Url + '">' + pushedData.p2Url + `</a><br />${t('toppage:観戦用URL')}: <a target="_blank" href="` + pushedData.watchUrl + '">' + pushedData.watchUrl + '</a><br /></div>');
                        $('.ui.accordion').prepend('<div class="title"><i class="dropdown icon"></i>' + t('toppage:TIMEに作成した卓', { time: moment(pushedData.time).format('YYYY/M/D HH:mm:ss')}) + '</div>');

                        $('.ui.loader').removeClass('active');

                    });
                });
            });


    } catch (ex) {
        console.error(ex);
        alert(t("システムエラーが発生しました。"));
        $.ajax({
            url: '/.error-send'
            , type: 'post'
            , contentType: 'application/json'
            , data: JSON.stringify({ error: ex.message, stack: ex.stack })
        });
    }
});