import * as sakuraba from './sakuraba';

declare var params: {
    boardId: string;
    side: "p1" | "p2" | "watch";
}


$(function(){
    // socket.ioに接続
    const socket = io();
    
    socket.on('info', (message) => {
        console.log('[SOCKET.IO INFO] ', message);
    });
    
    
    
    class Layouter {
        // 横に並んだカードやトークンをレイアウトする
        static exec(selector: string, frameWidth: number, spacing: number = 8, padding: number = 4){
            let $elems = $(selector);
            let itemWidth = $elems.outerWidth();
    
            $elems.each(function(i, elem){
                $(elem).css('left', `${padding + (itemWidth + spacing) * i}px`).css('top', `${padding}px`);
            });
        }
    }
    
    abstract class Component {
    
        region: sakuraba.RegionName;
        indexOfRegion: number;
        draggable: boolean = true;
        rotated: number = 0;
    
        oldRegion: sakuraba.RegionName;
        oldIndexOfRegion: number;
        oldDraggable: boolean;
        oldRotated: number;
    
        left: number = 0;
        top: number = 0;
    
        drawn: boolean = false;
    
        htmlElementId: string;
    
        abstract toHtml(): string;
    
        /**
         * 位置が変更されていればtrue
         */
        isLocationChanged(): boolean{
            return this.region !== this.oldRegion
            || this.indexOfRegion !== this.oldIndexOfRegion
            || this.draggable !== this.oldDraggable
            || this.rotated !== this.oldRotated
        }
    
        updateLocation(): void{
            this.oldRegion = this.region;
            this.oldIndexOfRegion = this.indexOfRegion;
            this.oldDraggable = this.draggable;
            this.oldRotated = this.rotated;
        }
    
        get zIndexOffset(): number {
            return 0;
        }
    }
    
    class CardComponent extends Component {
        card: sakuraba.Card;
        opened: boolean = false;
        oldOpened: boolean;
    
        toHtml(): string{
            return(`<div class="fbs-card" draggable="true" id="${this.htmlElementId}" data-card-id="${this.card.id}" data-html="${this.getDescriptionHtml()}"></div>`);
        }
    
        isLocationChanged(): boolean{
            return super.isLocationChanged() || this.opened !== this.oldOpened;
        }
    
        updateLocation(): void{
            super.updateLocation();
            this.oldOpened = this.opened;
        }
    
        getDescriptionHtml(): string{
            let cardTitleHtml = `<ruby><rb>${this.card.data.name}</rb><rp>(</rp><rt>${this.card.data.ruby}</rt><rp>)</rp></ruby>`
            let html = `<div class='ui header' style='margin-right: 2em;'>${cardTitleHtml}`
    
            html += `</div><div class='ui content'>`
    
            let typeCaptions = [];
            if(this.card.data.types.indexOf('attack') >= 0) typeCaptions.push("<span style='color: red; font-weight: bold;'>攻撃</span>");
            if(this.card.data.types.indexOf('action') >= 0) typeCaptions.push("<span style='color: blue; font-weight: bold;'>行動</span>");
            if(this.card.data.types.indexOf('enhance') >= 0) typeCaptions.push("<span style='color: green; font-weight: bold;'>付与</span>");
            if(this.card.data.types.indexOf('reaction') >= 0) typeCaptions.push("<span style='color: purple; font-weight: bold;'>対応</span>");
            if(this.card.data.types.indexOf('fullpower') >= 0) typeCaptions.push("<span style='color: gold; font-weight: bold;'>全力</span>");
            html += `${typeCaptions.join('/')}`;
            if(this.card.data.range !== undefined){
                html += `<span style='margin-left: 1em;'>適正距離${this.card.data.range}</span>`
            }
            html += `<br>`;
            if(this.card.data.baseType === 'special'){
                html += `<div class='ui top right attached label'>消費: ${this.card.data.cost}</div>`;
            }
            if(this.card.data.types.indexOf('enhance') >= 0){
                html += `納: ${this.card.data.capacity}<br>`;
            }
            if(this.card.data.damage !== undefined){
                html += `${this.card.data.damage}<br>`;
            }
            html += `${this.card.data.text.replace('\n', '<br>')}`;
            html += `</div>`;
            return html;
        }
    }
    
    class SakuraTokenComponent extends Component {
        cardId: string = null; 
        toHtml(): string{
            return(`<div class="sakura-token" draggable="true" id="${this.htmlElementId}"></div>`);
        }
    
        get zIndexOffset(): number {
            return 100;
        }
    }
    
    class VigorComponent extends Component {
        toHtml(): string{
            return(`<div class="fbs-vigor-card" id="${this.htmlElementId}">
            <div class="vigor0"></div>
            <div class="vigor1"></div>
            <div class="vigor2"></div>
            </div>`);
        }
    
        // 表示状態を決定
        setVigor(value: number){
            if(value === 0){
                this.rotated = 1;
            }
            if(value === 1){
                this.rotated = 0;
            }
            if(value === 2){
                this.rotated = -1;
            }
                    
        }
    }
    
    // 盤を定義
    let board = new sakuraba.Board();
    let myBoardSide = board.getMySide(params.side);
    
    // コンポーネント一覧
    const components: Component[] = [];
    
    // 変数を定義
    let draggingFrom: Component = null;
    let contextMenuShowingAfterDrop: boolean = false;
    
    /** アクションログを追加する */
    function appendActionLog(text: string){
        // ログエリアに表示
        $('#ACTION-LOG-AREA').append(text).append('<br>');
    
        // socket.ioでサーバーに送信
        let log = new sakuraba.LogRecord();
        log.body = text;
        let param: sakuraba.SocketParam.appendActionLog = {boardId: params.boardId, log: log};
        socket.emit('append_action_log', param);
    }
    
    /** チャットログを追加する (発言する) */
    function appendChatLog(text: string){
        // ログエリアに表示
        $('#CHAT-LOG-AREA').append(text).append('<br>');
    
        // socket.ioでサーバーに送信
        let log = new sakuraba.LogRecord();
        log.body = text;
        log.speaker = myBoardSide.playerName;
        let param: sakuraba.SocketParam.appendChatLog = {boardId: params.boardId, log: log};
        socket.emit('append_chat_log', param);
    }
    // 関数
    function shuffle(array) {
        var n = array.length, t, i;
    
        while (n) {
            i = Math.floor(Math.random() * n--);
            t = array[n];
            array[n] = array[i];
            array[i] = t;
        }
    
        return array;
    }
    
    function createCardComponent(card: sakuraba.Card, region: sakuraba.RegionName, indexOfRegion: number){
        let newCard = new CardComponent;
        newCard.card = card;
        newCard.htmlElementId = "fbs-card-" + card.id;
        newCard.region = region;
        newCard.indexOfRegion = indexOfRegion;
        newCard.opened = false;
        components.push(newCard);
    
        return newCard;
    }
    
    function createVigorComponent(){
        let comp = new VigorComponent;
        comp.region = 'vigor';
        comp.htmlElementId = "fbs-vigor-card";
        components.push(comp);
    }
    
    var sakuraTokenTotalCount = 0;
    function createSakuraTokenComponent(region: sakuraba.SakuraTokenArea, count: number){
        for(let i = 0; i < count; i++){
            let newComp = new SakuraTokenComponent;
            newComp.region = region;
            newComp.indexOfRegion = i;
            newComp.htmlElementId = `sakura-token-${sakuraTokenTotalCount}`;
            sakuraTokenTotalCount++;
            components.push(newComp);
        }
    }
    
    // 盤上のコンポーネント表示を更新
    function updateComponents(){
        // 山札の再配置
        let libraryOffset = $('.area.library.background').position();
        components.filter(x => x.region === 'library').forEach((comp, i) => {
            comp.left = libraryOffset.left + 4 + comp.indexOfRegion * 8;
            comp.top = libraryOffset.top + 4 + comp.indexOfRegion * 3;
        });
    
        // 手札の再配置
        let handOffset = $('.area.hand.background').position();
        components.filter(x => x.region === 'hand').forEach((comp, i) => {
            comp.left = handOffset.left + 4 + comp.indexOfRegion * 108;
            comp.top = handOffset.top + 4;
        });
    
        // 切り札の再配置
        let specialOffset = $('.area.special.background').position();
        components.filter(x => x.region === 'special').forEach((comp, i) => {
            comp.left = specialOffset.left + 4 + comp.indexOfRegion * 108;
            comp.top = specialOffset.top + 4;
        });
    
        // 使用済札の再配置
        let usedOffset = $('.area.used.background').position();
        components.filter(x => x.region === 'used').forEach((comp, i) => {
            comp.left = usedOffset.left + 4 + comp.indexOfRegion * 108;
            comp.top = usedOffset.top + 4;
        });
    
        // 伏せ札の再配置
        let hiddenUsedOffset = $('.area.hidden-used.background').position();
        components.filter(x => x.region === 'hidden-used').forEach((comp, i) => {
            comp.left = 20 + hiddenUsedOffset.left + 4 + comp.indexOfRegion * 8;
            comp.top = -20 + hiddenUsedOffset.top + 4 + comp.indexOfRegion * 3;
        });
    
        // 集中力の再配置
        let vigorOffset = $('.area.vigor').position();
        components.filter(x => x instanceof VigorComponent).forEach((comp, i) => {
            if(comp.rotated === 0){
                comp.left = vigorOffset.left;
                comp.top = vigorOffset.top + 40;
            } else {
                comp.left = vigorOffset.left;
                comp.top = vigorOffset.top + 20;
            }
        });
    
        // 桜花結晶の再配置
        let distanceOffset = $('.area.sakura-token-region.distance').position();
        components.filter(x => x.region === 'distance').forEach((comp, i) => {
            comp.left = distanceOffset.left + 60 + ((28 + 4) * i);
            comp.top = distanceOffset.top + 2;
        });
    
        let dustOffset = $('.area.sakura-token-region.dust').position();
        components.filter(x => x.region === 'dust').forEach((comp, i) => {
            comp.left = dustOffset.left + 60 + ((28 + 4) * i);
            comp.top = dustOffset.top + 2;
        });
    
        let auraOffset = $('.area.sakura-token-region.aura').position();
        components.filter(x => x.region === 'aura').forEach((comp, i) => {
            comp.left = auraOffset.left + 60 + ((28 + 4) * i);
            comp.top = auraOffset.top + 2;
        });
    
        let lifeOffset = $('.area.sakura-token-region.life').position();
        components.filter(x => x.region === 'life').forEach((comp, i) => {
            comp.left = lifeOffset.left + 60 + ((28 + 4) * i);
            comp.top = lifeOffset.top + 2;
        });
    
        let flairOffset = $('.area.sakura-token-region.flair').position();
        components.filter(x => x.region === 'flair').forEach((comp, i) => {
            comp.left = flairOffset.left + 60 + ((28 + 4) * i);
            comp.top = flairOffset.top + 2;
        });
    
    
        components.filter(x => x.region === 'on-card').forEach((comp: SakuraTokenComponent, i) => {
            let offset = $(`[data-card-id=${comp.cardId}]`).position();
            
            comp.left = offset.left + 2 + comp.indexOfRegion * 20;
            comp.top = offset.top + 140 - 2 - 32;
        });
    
        // コンポーネントごとに描画/移動処理
        let boardOffset = $('#BOARD').offset();
        components.forEach((component, index) => {
            let $elem: JQuery = null;
            if(!component.drawn){
                $('#BOARD').append(component.toHtml());
                $elem = $(`#${component.htmlElementId}`);
            }
            
            if(!component.drawn || component.isLocationChanged()){
                if($elem === null){
                    $elem = $(`#${component.htmlElementId}`);
                }
    
                updateComponentAttributes(component, $elem);
    
                // 古い位置情報を捨てる
                component.updateLocation();
            }
    
            // 描画済フラグを立てる
            if(!component.drawn){
                component.drawn = true;
            }
        });
    
        // ライブラリカウント増減
        $('#LIBRARY-COUNT').text(myBoardSide.library.length).css({right: parseInt($('.area.library.background').css('right')) + 8, bottom: parseInt($('.area.library.background').css('bottom')) + 8});
    }
    
    function updateComponentAttributes(component: Component, $elem: JQuery){
        // ドラッグ可能の判定
        if(component.draggable){
            $elem.attr('draggable', '');
        } else {
            $elem.removeAttr('draggable');
        }
    
        // 回転
        $elem.removeClass(['rotated', 'reverse-rotated']);
        if(component.rotated === 1){
            $elem.addClass('rotated');
        } else if(component.rotated === -1){
            $elem.addClass('reverse-rotated');
        }
    
        // カード用の処理
        if(component instanceof CardComponent){
            // 裏表の更新
            $elem.removeClass(['open-normal', 'back-normal', 'open-special', 'back-special']);
            if(component.card.data.baseType === 'normal'){
                if(component.opened){
                    $elem.addClass('open-normal');
                } else {
                    $elem.addClass('back-normal');
                }
            }
            if(component.card.data.baseType === 'special'){
                if(component.opened){
                    $elem.addClass('open-special');
                } else {
                    $elem.addClass('back-special');
                }
            }
    
            // 名称表示の更新
            $elem.text(component.opened ? component.card.data.name : '');
    
        }
    
        // 集中力用の処理
        if (component instanceof VigorComponent) {
            if(myBoardSide.vigor === 0){
                $elem.find('.vigor1').addClass('clickable');
                $elem.find(':not(.vigor1)').removeClass('clickable');
            }
            if(myBoardSide.vigor === 1){
                $elem.find('.vigor0, .vigor2').addClass('clickable');
                $elem.find('.vigor1').removeClass('clickable');
            }
            if(myBoardSide.vigor === 2){
                $elem.find('.vigor1').addClass('clickable');
                $elem.find(':not(.vigor1)').removeClass('clickable');
            }
        }
        // 位置を移動 (向きを変えた後に実行する必要がある）
        $elem.css({left: component.left, top: component.top});
        $elem.css({zIndex: component.zIndexOffset + component.indexOfRegion});
        
        // リージョン属性付加
        $elem.attr('data-region', component.region);
    }
      
    
    function drawLibrary(){
        myBoardSide.library.forEach((card, i) => {
            createCardComponent(card, 'library', i);
        });
    }
    
    function drawHands(){
        myBoardSide.hands.forEach((card, i) => {
            createCardComponent(card, 'hand', i);
        });
    }
    
    function drawSpecials(){
        myBoardSide.specials.forEach((card, i) => {
            createCardComponent(card, 'special', i);
        });
    }
    
    
    function drawUsed(){
        myBoardSide.used.forEach((card, i) => {
            createCardComponent(card, 'used', innerWidth);
        });
    }
    
    
    function drawHiddenUsed(){
        myBoardSide.hiddenUsed.forEach((card, i) => {
            createCardComponent(card, 'hidden-used', i);
        });
    }
    
    function drawVigor(){
        createVigorComponent();
    }
    
    function drawSakuraTokens(){
        createSakuraTokenComponent('distance', 10);
        createSakuraTokenComponent('aura', 3);
        createSakuraTokenComponent('life', 10);
    }
    
    // カードを移動
    function moveCard(from: sakuraba.CardArea, fromIndex: number, to: sakuraba.CardArea, addToBottom: boolean = false):boolean{
        console.log('move card (%s[%d] -> %s)', from, fromIndex, to);
    
        // 移動可能かどうかをチェック
    
        // 移動
        let card: sakuraba.Card;
        if(from === 'library'){
            card = myBoardSide.library.splice(fromIndex, 1)[0];
    
        }
        if(from === 'hand'){
            card = myBoardSide.hands.splice(fromIndex, 1)[0];
        }
        if(from === 'used'){
            card = myBoardSide.used.splice(fromIndex, 1)[0];
        }
        if(from === 'hidden-used'){
            card = myBoardSide.hiddenUsed.splice(fromIndex, 1)[0];
        }
    
        let toTarget: sakuraba.Card[];
        if(to === 'library'){
            toTarget = myBoardSide.library;
        }
        if(to === 'hand'){
            toTarget = myBoardSide.hands;
        }
        if(to === 'used'){
            toTarget = myBoardSide.used;
        }
        if(to === 'hidden-used'){
            toTarget = myBoardSide.hiddenUsed;
        }
        if(addToBottom){
            toTarget.unshift(card);
        } else {
            toTarget.push(card);
        }
    
        // ログを追加
        if(from === 'library' && to === 'hand'){
            appendActionLog(`カードを1枚引く ⇒ ${card.data.name}`);
        } else if(from === 'hand' && to === 'used'){
            appendActionLog(`「${card.data.name}」を場に出す`);
        } else if(from === 'hand' && to === 'hidden-used'){
            appendActionLog(`「${card.data.name}」を伏せ札`);
        } else {
            let regionCaptions = {
                'library': '山札',
                'hand': '手札',
                'used': '場',
                'hidden-used': '伏せ札',
                
            };
    
            appendActionLog(`${regionCaptions[from]}の「${card.data.name}」を${regionCaptions[to]}に移動`);
        }  
    
    
        // コンポーネントのインデックス更新
        refreshCardComponentRegionInfo(from);
        refreshCardComponentRegionInfo(to);
    
        // 表示更新
        updateComponents();
    
        // 移動成功
        return true;
    }
    
    
    // コンポーネントの領域情報を更新
    function refreshCardComponentRegionInfo(region: sakuraba.RegionName){
        let cards: sakuraba.Card[];
        if(region === 'library'){
            cards = myBoardSide.library;
        }
        if(region === 'hand'){
            cards = myBoardSide.hands;
        }
        if(region === 'used'){
            cards = myBoardSide.used;
        }
        if(region === 'hidden-used'){
            cards = myBoardSide.hiddenUsed;
        }
        if(region === 'special'){
            cards = myBoardSide.specials;
        }
        // カード情報の更新
        cards.forEach((card, i) => {
            let comp = components.find(x => x instanceof CardComponent && x.card === card) as CardComponent;
            comp.region = region;
            comp.indexOfRegion = i;
            comp.draggable = (comp.region !== 'library' || comp.indexOfRegion === myBoardSide.library.length - 1);
    
            // 領域に依存する情報更新
            if(region === 'hand' || region === 'used'){
                comp.opened = true;
            }
            if(region === 'library' || region === 'hidden-used'){
                comp.opened = false;
            }
    
            if(region !== 'hidden-used'){
                comp.rotated = 0;
            }
    
            if(region === 'hidden-used'){
                comp.rotated = 1;
            }
        });
    }
    
    // コンポーネントの領域情報を更新
    function refreshSakuraTokenComponentInfo(){
        let allSakuraTokens = components.filter(x => x instanceof SakuraTokenComponent);
        let tokenIndex = 0;
    
        // 対象領域にある結晶数に応じて表示更新
        for(let i = 0; i < board.distance; i++){
            let comp = allSakuraTokens[tokenIndex] as SakuraTokenComponent;
            comp.region = 'distance';
            comp.indexOfRegion = i;
            tokenIndex++;
        }
    
        for(let i = 0; i < board.dust; i++){
            let comp = allSakuraTokens[tokenIndex] as SakuraTokenComponent;
            comp.region = 'dust';
            comp.indexOfRegion = i;
            tokenIndex++;
        }
    
        for(let i = 0; i < myBoardSide.aura; i++){
            let comp = allSakuraTokens[tokenIndex] as SakuraTokenComponent;
            comp.region = 'aura';
            comp.indexOfRegion = i;
            tokenIndex++;
        }
    
        for(let i = 0; i < myBoardSide.life; i++){
            let comp = allSakuraTokens[tokenIndex] as SakuraTokenComponent;
            comp.region = 'life';
            comp.indexOfRegion = i;
            tokenIndex++;
        }
    
        for(let i = 0; i < myBoardSide.flair; i++){
            let comp = allSakuraTokens[tokenIndex] as SakuraTokenComponent;
            comp.region = 'flair';
            comp.indexOfRegion = i;
            tokenIndex++;
        }
    
        for(let cardId in board.tokensOnCard) {
            if(board.tokensOnCard.hasOwnProperty(cardId)) {
                for(let i = 0; i < board.tokensOnCard[cardId]; i++){
                    let comp = allSakuraTokens[tokenIndex] as SakuraTokenComponent;
                    comp.region = 'on-card';
                    comp.cardId = cardId;
                    comp.indexOfRegion = i;
                    tokenIndex++;
                }
            }
        }
    }
    
    // 桜花結晶を移動
    function moveSakuraToken(from: sakuraba.SakuraTokenArea, to: sakuraba.SakuraTokenArea, cardId: string, count: number = 1):boolean{
        console.log('move sakura token (%s -> %s * %d)', from, to, count);
    
        // 移動可能かどうかをチェック
        if(from === 'distance'){
            if(board.distance < count) return false; // 桜花結晶がなければ失敗
        } else if(from === 'dust'){
            if(board.dust < count) return false; // 桜花結晶がなければ失敗
        } else if(from === 'aura'){
            if(myBoardSide.aura < count) return false; // 桜花結晶がなければ失敗
        } else if(from === 'life'){
            if(myBoardSide.life < count) return false; // 桜花結晶がなければ失敗
        } else if(from === 'flair'){
            if(myBoardSide.flair < count) return false; // 桜花結晶がなければ失敗
        }
        if(to === 'distance'){
            if((board.distance + count) > 10) return false; // 間合い最大値を超える場合は失敗
        } else if(to === 'aura'){
            if((myBoardSide.aura + count) > 5) return false; // オーラ最大値を超える場合は失敗
        }
    
        // 移動
        if(from === 'distance'){
            board.distance -= count;
        } else if(from === 'dust'){
            board.dust -= count;
        } else if(from === 'aura'){
            myBoardSide.aura -= count;
        } else if(from === 'life'){
            myBoardSide.life -= count;
        } else if(from === 'flair'){
            myBoardSide.flair -= count;
        }
    
        if(to === 'distance'){
            board.distance += count;
        } else if(to === 'dust'){
            board.dust += count;
        } else if(to === 'aura'){
            myBoardSide.aura += count;
        } else if(to === 'life'){
            myBoardSide.life += count;
        } else if(to === 'flair'){
            myBoardSide.flair += count;
        } else if(to === 'on-card'){
            if(board.tokensOnCard[cardId] === undefined) board.tokensOnCard[cardId] = 0;
            board.tokensOnCard[cardId] += count;
        }
        console.log(board);
    
        // コンポーネントのインデックス更新
        refreshSakuraTokenComponentInfo();
    
        // 表示更新
        updateComponents();
    
        // 移動成功
        return true;
    }
    
    
    function messageModal(desc: string){
        $('#MESSAGE-MODAL .description').html(desc);
        $('#MESSAGE-MODAL')
            .modal({closable: false})
            .modal('show');
    }
    
    function confirmModal(desc: string, yesCallback: (this: JQuery, $element: JQuery) => false | void){
        $('#CONFIRM-MODAL .description').html(desc);
        $('#CONFIRM-MODAL')
            .modal({closable: false, onApprove:yesCallback})
            .modal('show');
    }
    
    function userInputModal(desc: string, decideCallback: (this: JQuery, $element: JQuery) => false | void){
        $('#INPUT-MODAL .description-body').html(desc);
        $('#INPUT-MODAL')
            .modal({closable: false, onApprove:decideCallback})
            .modal('show');
    }
    
    // /**
    //  * ゲームを開始可能かどうか判定
    //  */
    // function checkGameStartable(board: sakuraba.Board){
    //     // 両方のプレイヤー名が決定済みであれば、ゲーム開始許可
    //     if(board.p1Side.playerName !== null && board.p2Side.playerName !== null){
    //         $('#GAME-START-BUTTON').removeClass('disabled');
    //     }
    // }
    
    function setPopup(){
        // ポップアップ初期化
        $('[data-html],[data-content]').popup({
            delay: {show: 500, hide: 0},
            onShow: function(): false | void{
                if(draggingFrom !== null) return false;
            },
        });
    }
    
    function updatePhaseState(first: boolean = false){
        // メガミが決定済みであれば、デッキ構築ボタンを有効化し、メガミ選択ボタンのラベルを変更
        if(myBoardSide.megamis.length >= 1){
            $('#MEGAMI-SELECT-BUTTON').text('メガミ変更');
            $('#DECK-BUILD-BUTTON').removeClass('disabled');
        }
    
        // デッキが構築済みであれば、場のカードを表示し、初期手札ボタンを有効化し、デッキ構築ボタンのラベルを変更
        if(myBoardSide.library.length >= 1){
    
            if(first){
                drawLibrary();
                refreshCardComponentRegionInfo('library');
                drawSpecials();
                refreshCardComponentRegionInfo('special');
                drawHands();
                refreshCardComponentRegionInfo('hand');
                updateComponents();
    
                // ポップアップをセット
                setPopup();
            }
    
            $('#DECK-BUILD-BUTTON').text('デッキ変更');
            $('#HAND-SET-BUTTON').removeClass('disabled');
        }
    }

    // ボード情報をリクエスト
    console.log('request_first_board_to_server');
    socket.emit('request_first_board_to_server', {boardId: params.boardId, side: params.side});
    //socket.emit('send_board_to_server', {boardId: params.boardId, side: params.side, board: board});

    // ボード情報を受信した場合、メイン処理をスタート
    socket.on('send_first_board_to_client', (receivingBoardData) => {
        $('#P1-NAME').text(receivingBoardData.p1Side.playerName);
        $('#P2-NAME').text(receivingBoardData.p2Side.playerName);

        console.log('receive board: ', receivingBoardData);
        board = new sakuraba.Board();
        board.deserialize(receivingBoardData);
        console.log('recovered board: ', board);
        myBoardSide = board.getMySide(params.side);
        let opponentSide = board.getOpponentSide(params.side);

        // ログ表示
        $('#ACTION-LOG-AREA').append(board.actionLog.map(log => `${log.body}<br>`).join(''));
        $('#CHAT-LOG-AREA').append(board.chatLog.map(log => `${log.body}<br>`).join(''));

        // まだ名前が決定していなければ、名前の決定処理
        if(myBoardSide.playerName === null){
            let playerCommonName = (params.side === 'p1' ? 'プレイヤー1' : 'プレイヤー2');
            let opponentPlayerCommonName = (params.side === 'p1' ? 'プレイヤー2' : 'プレイヤー1');
            userInputModal(`<p>ふるよにボードシミュレーターへようこそ。<br>あなたは${playerCommonName}として卓に参加します。</p><p>プレイヤー名：</p>`, ($elem) => {
                let playerName = $('#INPUT-MODAL input').val() as string;
                if(playerName === ''){
                    playerName = playerCommonName;
                }
                socket.emit('player_name_input', {boardId: params.boardId, side: params.side, name: playerName});
                myBoardSide.playerName = playerName;
                $((params.side === 'p1' ? '#P1-NAME' : '#P2-NAME')).text(playerName);

                messageModal(`<p>ゲームを始める準備ができたら、まずは「メガミ選択」ボタンをクリックしてください。</p>`);
            });
        }

        updatePhaseState(true);

    });

    // ログが追加された
    socket.on('bc_append_action_log', (socketParam: sakuraba.SocketParam.bcAppendActionLog) => {
        // ログエリアに表示
        $('#ACTION-LOG-AREA').append(socketParam.log.body).append('<br>');
    })

    // チャットログが追加された
    socket.on('bc_append_chat_log', (socketParam: sakuraba.SocketParam.bcAppendActionLog) => {
        // ログエリアに表示
        $('#CHAT-LOG-AREA').append(socketParam.log.body).append('<br>');
    })


    // 他のプレイヤーがプレイヤー名を入力した
    socket.on('on_player_name_input', (receivingBoard: sakuraba.Board) => {
        let board = new sakuraba.Board();
        board.deserialize(receivingBoard);
        $('#P1-NAME').text(board.p1Side.playerName);
        $('#P2-NAME').text(board.p2Side.playerName);
    });

    // // ドロップダウン初期化
    // let values: {name: string, value: string}[] = [];
    // for(let key in sakuraba.MEGAMI_DATA){
    //     let data = sakuraba.MEGAMI_DATA[key];
    //     values.push({name: `${data.name} (${data.symbol})`, value: key});
    // }
    
    // $('#MEGAMI1-SELECTION').dropdown({
    //     placeholder: '1柱目を選択...',
    //     values: values
    // });
    // $('#MEGAMI2-SELECTION').dropdown({
    //     placeholder: '2柱目を選択...',
    //     values: values
    // });
    for(let key in sakuraba.MEGAMI_DATA){
        let data = sakuraba.MEGAMI_DATA[key];
        $('#MEGAMI1-SELECTION').append(`<option value='${key}'>${data.name} (${data.symbol})</option>`);
        $('#MEGAMI2-SELECTION').append(`<option value='${key}'>${data.name} (${data.symbol})</option>`);
    }

    // メガミ選択ダイアログでのボタン表示更新
    function updateMegamiSelectModalView(){
        let megami1 = $('#MEGAMI1-SELECTION').val() as string;
        let megami2 = $('#MEGAMI2-SELECTION').val() as string;

        if(megami1 !== '' && megami2 !== ''){
            $('#MEGAMI-SELECT-MODAL .positive.button').removeClass('disabled');
        } else {
            $('#MEGAMI-SELECT-MODAL .positive.button').addClass('disabled');
        }
    }

    // チャットログ送信ボタン
    $('#CHAT-SEND-BUTTON').click((e) => {
        let $input = $('#CHAT-SEND-BUTTON').closest('form').find('input[type=text]');
        appendChatLog($input.val() as string);
        $input.val('');
        return false;
    });

    // メガミ選択ボタン
    $('#MEGAMI-SELECT-BUTTON').click((e) => {
        let megami2Rule: SemanticUI.Form.Field = {identifier: 'megami2', rules: [{type: 'different[megami1]', prompt: '同じメガミを選択することはできません。'}]};
        $('#MEGAMI-SELECT-MODAL .ui.form').form({
            fields: {
                megami2: megami2Rule
            }
        });
        $('#MEGAMI-SELECT-MODAL').modal({closable: false, autofocus: false, onShow: function(){
            // メガミが選択済みであれば、あらかじめドロップダウンに設定しておく
            if(myBoardSide.megamis.length >= 1){
                $('#MEGAMI1-SELECTION').val(myBoardSide.megamis[0]);
                $('#MEGAMI2-SELECTION').val(myBoardSide.megamis[1]);
            }

            // 表示の更新
            updateMegamiSelectModalView();

        }, onApprove:function(){
            if(!$('#MEGAMI-SELECT-MODAL .ui.form').form('validate form')){
                return false;
            }
            

            // 選択したメガミを設定
            let megamis = [$('#MEGAMI1-SELECTION').val() as sakuraba.Megami, $('#MEGAMI2-SELECTION').val() as sakuraba.Megami];
            let mySide = board.getMySide(params.side);
            mySide.megamis = megamis;
    
            // 表示更新
            updatePhaseState(true);

            // socket.ioでイベント送信
            socket.emit('megami_select', {boardId: params.boardId, side: params.side, megamis: megamis});
            return undefined;
        }}).modal('show');
    });

    $('#MEGAMI1-SELECTION, #MEGAMI2-SELECTION').on('change', function(e){
        updateMegamiSelectModalView();
    });

    // 選択カード数、ボタン等の表示更新
    function updateDeckCounts(){
        let normalCardCount = $('#DECK-BUILD-MODAL .fbs-card.open-normal.selected').length;
        let specialCardCount = $('#DECK-BUILD-MODAL .fbs-card.open-special.selected').length;

        let normalColor = (normalCardCount > 7 ? 'red' : (normalCardCount < 7 ? 'blue' : 'black'));
        $('#DECK-NORMAL-CARD-COUNT').text(normalCardCount).css({color: normalColor, fontWeight: (normalColor === 'black' ? 'normal' : 'bold')});
        let specialColor = (specialCardCount > 3 ? 'red' : (specialCardCount < 3 ? 'blue' : 'black'));
        $('#DECK-SPECIAL-CARD-COUNT').text(specialCardCount).css({color: specialColor, fontWeight: (specialColor === 'black' ? 'normal' : 'bold')});

        if(normalCardCount === 7 && specialCardCount === 3){
            $('#DECK-BUILD-MODAL .positive.button').removeClass('disabled');
        } else {
            $('#DECK-BUILD-MODAL .positive.button').addClass('disabled');
        }
    }

    // デッキ構築モーダル内のカードをクリック
    $('body').on('click', '#DECK-BUILD-MODAL .fbs-card', function(e){
        // 選択切り替え
        $(this).toggleClass('selected');

        // 選択数の表示を更新
        updateDeckCounts();
    });

    // デッキ構築ボタン
    $('#DECK-BUILD-BUTTON').click((e) => {
        let cardIds: string[][] = [[], [], []];

        // 1柱目の通常札 → 2柱目の通常札 → すべての切札 順にソート
        for(let key in sakuraba.CARD_DATA){
            let data = sakuraba.CARD_DATA[key];
            if(data.megami === myBoardSide.megamis[0] && data.baseType === 'normal'){
                cardIds[0].push(key);
            }
            if(data.megami === myBoardSide.megamis[1] && data.baseType === 'normal'){
                cardIds[1].push(key);
            }
            if(myBoardSide.megamis.indexOf(data.megami) >= 0 && data.baseType === 'special'){
                cardIds[2].push(key);
            }
        }
        
        cardIds.forEach((cardIdsInRow, r) => {
            cardIdsInRow.forEach((cardId, c) => {
                
                let card = new sakuraba.Card(cardId);
                let comp = new CardComponent();
                comp.card = card;
                comp.htmlElementId = `deck-${card.id}`;
                comp.opened = true;
                comp.top = 4 + r * (160 + 8);
                comp.left = 4 + c * (100 + 8);
                
                $('#DECK-BUILD-CARD-AREA').append(comp.toHtml());
                
                updateComponentAttributes(comp, $(`#${comp.htmlElementId}`));
            });
        });

        // すでに選択しているカードは選択済みとする
        let selectedIds: string[] = [];
        selectedIds = selectedIds.concat(myBoardSide.library.map(c => c.id));
        selectedIds = selectedIds.concat(myBoardSide.specials.map(c => c.id));
        console.log(selectedIds);
        if(selectedIds.length >= 1){
            let selector = selectedIds.map(id => `#DECK-BUILD-CARD-AREA [data-card-id=${id}]`).join(',');
            $(selector).addClass('selected');
        }

        let settings: SemanticUI.ModalSettings = {
            closable: false, autofocus: false, onShow: function () {
                // 選択数の表示を更新
                updateDeckCounts();

                // ポップアップの表示をセット
                setPopup();
            },
            onApprove: function () {
                // 選択したカードを自分の山札、切札にセット
                let normalCards: any = $('#DECK-BUILD-MODAL .fbs-card.open-normal.selected').map((i, elem) => new sakuraba.Card($(elem).attr('data-card-id'))).get();
                myBoardSide.library = normalCards as sakuraba.Card[];
                let specialCards: any = $('#DECK-BUILD-MODAL .fbs-card.open-special.selected').map((i, elem) => new sakuraba.Card($(elem).attr('data-card-id'))).get();
                myBoardSide.specials = specialCards as sakuraba.Card[];
                console.log(myBoardSide);

                // カードの初期化、配置、ポップアップ設定などを行う
                updatePhaseState(true);

                // socket.ioでイベント送信
                socket.emit('deck_build', {boardId: params.boardId, side: params.side, library: myBoardSide.library, specials: myBoardSide.specials});
                
            },
            onHide: function () {
                // カード表示をクリア
                $('#DECK-BUILD-CARD-AREA').empty();
            }
        }
        $('#DECK-BUILD-MODAL').modal(settings).modal('show');
    });

    // 初期手札セットボタン
    $('#HAND-SET-BUTTON').on('click', function(){
        confirmModal('手札を引くと、それ以降メガミやデッキの変更は行えなくなります。<br>よろしいですか？', () => {
            moveCard('library', 0, 'hand');
            moveCard('library', 0, 'hand');
            moveCard('library', 0, 'hand');

            refreshCardComponentRegionInfo('library');
            refreshCardComponentRegionInfo('hand');
            updateComponents();

            // socket.ioでイベント送信
            socket.emit('hand_set', {boardId: params.boardId, side: params.side, library: myBoardSide.library, hands: myBoardSide.hands});

        });
    });

    // ドラッグ開始
    $('#BOARD').on('dragstart', '.fbs-card,.sakura-token', function(e){
        this.style.opacity = '0.4';  // this / e.target is the source node.
        //(e.originalEvent as DragEvent).dataTransfer.setDragImage($(this.closest('.draw-region'))[0], 0, 0);
        let id = $(this).attr('id');
        let comp = components.find(c => c.htmlElementId === id);

        // 現在のエリアに応じて、選択可能なエリアを前面に移動し、選択したカードを記憶
        if(comp.region === 'hand'){
            // 手札
            $('.area.droppable:not(.hand)').css('z-index', 9999);
            draggingFrom = comp;
        }

        if(comp.region === 'library'){
            // 山札
            $('.area.droppable:not(.library)').css('z-index', 9999);
            draggingFrom = comp;
        }

        if(comp.region === 'used'){
            // 使用済札
            $('.area.droppable:not(.used)').css('z-index', 9999);
            draggingFrom = comp;
        }

        if(comp.region === 'hidden-used'){
            // 伏せ札
            $('.area.droppable:not(.hidden-used)').css('z-index', 9999);
            draggingFrom = comp;
        }

        if(comp.region === 'distance'){
            // 間合
            $('.area.sakura-token-region.droppable:not(.distance)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if(comp.region === 'dust'){
            // ダスト
            $('.area.sakura-token-region.droppable:not(.dust)').css('z-index', 9999);
            draggingFrom = comp;
        }
        if(comp.region === 'aura'){
            // オーラ
            $('.area.sakura-token-region.droppable:not(.aura)').css('z-index', 9999);
            draggingFrom = comp;

            // 場に出ている付与札があれば、それも移動対象
            $('[data-region=used]').addClass('droppable');
        }

        if(comp.region === 'life'){
            // ライフ
            $('.area.sakura-token-region.droppable:not(.life)').css('z-index', 9999);
            draggingFrom = comp;
        }

        if(comp.region === 'flair'){
            // フレア
            $('.area.sakura-token-region.droppable:not(.flair)').css('z-index', 9999);
            draggingFrom = comp;
        }

        console.log('draggingFrom: ', draggingFrom);

        $('.fbs-card').popup('hide all');

    });

    function processOnDragEnd(){
        // コンテキストメニューを表示している場合、一部属性の解除を行わない
        if(!contextMenuShowingAfterDrop){
            $('[draggable]').css('opacity', '1.0');
            $('.area,.fbs-card').removeClass('over');
        }
        
        $('.area.droppable').css('z-index', -9999);
        draggingFrom = null;
    }

    $('#BOARD').on('dragend', '.fbs-card,.sakura-token', function(e){
        console.log('dragend', this);
        processOnDragEnd();

    });
    $('#BOARD').on('dragover', '.droppable', function(e){
        if (e.preventDefault) {
            e.preventDefault(); // Necessary. Allows us to drop.
        }
        //e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        return false;
    });

    // ドラッグで要素に進入した
    $('.area.droppable').on('dragenter', function(e){
        console.log('dragenter', this);
        $($(this).attr('data-background-selector')).addClass('over');
    });

    $('.area.droppable').on('dragleave', function(e){
        console.log('dragleave', this);
        $($(this).attr('data-background-selector')).removeClass('over');  // this / e.target is previous target element.
    });
    $('#BOARD').on('dragenter', '.fbs-card.droppable', function(e){
        $($(this)).addClass('over');
    });
    $('#BOARD').on('dragleave', '.fbs-card.droppable', function(e){
        $($(this)).removeClass('over');  // this / e.target is previous target element.
    });


    let lastDraggingFrom: Component; 
    $('#BOARD').on('drop', '.area,.fbs-card.droppable', function(e){
        // this / e.target is current target element.
        console.log('drop', this);
        let $this = $(this);

        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }
    
        // ドロップ領域を特定
        let to: sakuraba.RegionName;
        if($this.is('.area.hand')) to = 'hand';
        if($this.is('.area.used')) to = 'used';
        if($this.is('.area.hidden-used')) to = 'hidden-used';
        if($this.is('.area.library')) to = 'library';
        if($this.is('.area.distance')) to = 'distance';
        if($this.is('.area.dust')) to = 'dust';
        if($this.is('.area.aura')) to = 'aura';
        if($this.is('.area.life')) to = 'life';
        if($this.is('.area.flair')) to = 'flair';
        if($this.is('.fbs-card')) to = 'on-card';

        if(draggingFrom !== null){
            // 山札に移動した場合は特殊処理
            if(to === 'library'){
                lastDraggingFrom = draggingFrom;
                contextMenuShowingAfterDrop = true;
                $('#CONTEXT-DRAG-TO-LIBRARY').contextMenu({x: e.pageX, y: e.pageY});
                return false;
            } else {
                // 山札以外への移動の場合
                if(draggingFrom instanceof CardComponent){
                    moveCard(draggingFrom.region as sakuraba.CardArea, draggingFrom.indexOfRegion, to as sakuraba.CardArea);
                    return false;
                }

                if(draggingFrom instanceof SakuraTokenComponent){
                    let cardId: string = null;
                    if(to === 'on-card'){
                        cardId = $(this).attr('data-card-id');
                    }
                    moveSakuraToken(draggingFrom.region as sakuraba.SakuraTokenArea, to as sakuraba.SakuraTokenArea, cardId);
                    return false;
                }
            }



        }

        return false;
    });

    // 集中力のクリック
    function vigorProcess(){
        let vigComp = components.find(x => x instanceof VigorComponent) as VigorComponent;
        vigComp.setVigor(myBoardSide.vigor);
        updateComponents();
    }
    $('#BOARD').on('click', '.fbs-vigor-card .vigor0.clickable', function(e){
        e.preventDefault();
        appendActionLog(`集中力－1　(→0)`)
        myBoardSide.vigor = 0;
        vigorProcess();

        return false;
    });
    $('#BOARD').on('click', '.fbs-vigor-card .vigor1.clickable', function(e){
        e.preventDefault();
        if(myBoardSide.vigor === 2){
            appendActionLog(`集中力－1　(→1)`);
        } else {
            appendActionLog(`集中力＋1　(→1)`);
        }
        myBoardSide.vigor = 1;
        vigorProcess();

        return false;
    });
    $('#BOARD').on('click', '.fbs-vigor-card .vigor2.clickable', function(e){
        e.preventDefault();
        appendActionLog(`集中力＋1　(→2)`)
        myBoardSide.vigor = 2;
        vigorProcess();

        return false;
    });

    // ログ表示
    $('#ACTION-LOG-DISPLAY-BUTTTON').on('click', function(e){
        $('#ACTION-LOG-WINDOW').toggle();
    });
    $('#CHAT-LOG-DISPLAY-BUTTTON').on('click', function(e){
        $('#CHAT-LOG-WINDOW').toggle();
    });


    // ターン終了
    $('#TURN-END-BUTTON').on('click', function(){
        $('.ui.modal').modal('show');
    });

    // 切札のダブルクリック
    $('#BOARD').on('dblclick', '.fbs-card[data-region=special]', function(e){
        e.preventDefault();
        let cardIndex = $('.fbs-card[data-region=special]').index(this);
        console.log('double click', cardIndex);

        let card = myBoardSide.specials[cardIndex];
        let comp = components.find(x => x instanceof CardComponent && x.card === myBoardSide.specials[cardIndex]) as CardComponent;

        if(card.used){
            card.used = false;
            comp.opened = false;
        } else {
            card.used = true;
            comp.opened = true;
        }

        updateComponents();
        

        return false;
    });

    // $('#BOARD').on('mouseenter', '.sakura-token', function(e){
    //     let $region = $(this).closest('.draw-region');

    //     // 自分のインデックスを取得
    //     let index = $region.find('.sakura-token').index(this);

    //     // 自分より後の要素を半透明にする
    //     $region.find(`.sakura-token:gt(${index})`).css({opacity: 0.4});
    // });
    // $('#BOARD').on('mouseleave', '.sakura-token', function(e){
    //     let $region = $(this).closest('.draw-region');
    //     $region.find(`.sakura-token`).css({opacity: 1});
    // });

    // 山札ドラッグメニュー
    $('#BOARD').append('<div id="CONTEXT-DRAG-TO-LIBRARY"></div>');
    $.contextMenu({
        trigger: 'hidden',
        selector: '#CONTEXT-DRAG-TO-LIBRARY',
        callback: function(key: string) {
            if(key === 'top'){
                moveCard('hand', lastDraggingFrom.indexOfRegion, 'library');
            }
            if(key === 'bottom'){
                moveCard('hand', lastDraggingFrom.indexOfRegion, 'library', true);
            }
        },
        events: {
            hide: function(options){
                contextMenuShowingAfterDrop = false;
                console.log(options);
                processOnDragEnd();
            }
        },
        items: {
            'top': {name: '上に置く'},
            'bottom': {name: '底に置く'},
            'sep': '----',
            'cancel': {name: 'キャンセル'}
        }
    });
    // 山札右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .fbs-card[data-region=library]',
        callback: function(key: string) {
            if(key === 'draw'){
                moveCard('library', 0, 'hand');
            }
            if(key === 'reshuffle' || key === 'reshuffleWithoutDamage'){
                // 山札、捨て札、伏せ札を全て加えてシャッフル
                myBoardSide.library = myBoardSide.library.concat(myBoardSide.hiddenUsed.splice(0)); 
                myBoardSide.used.forEach(function(card, i){
                    if(card.sakuraToken === undefined || card.sakuraToken === 0){
                        myBoardSide.library.push(card);
                        myBoardSide.used[i] = undefined;
                    }
                });
                myBoardSide.used = myBoardSide.used.filter((c) => c !== undefined);
                myBoardSide.library = shuffle(myBoardSide.library);

                refreshCardComponentRegionInfo('library');
                refreshCardComponentRegionInfo('used');
                refreshCardComponentRegionInfo('hidden-used');


                if(key === 'reshuffle') moveSakuraToken('life', 'dust', null);
                updateComponents();
                appendActionLog(`再構成`);
            }
        },
        items: {
            'draw': {name: '1枚引く', disabled: () => myBoardSide.library.length === 0},
            'sep1': '---------',
            'reshuffle': {name: '再構成する', disabled: () => myBoardSide.life === 0},
            'reshuffleWithoutDamage': {name: '再構成する (ライフ減少なし)'},
        }
    });

    // 集中力右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .fbs-vigor-card',
        callback: function(key: string) {
        },
        items: {
            'wither': {name: '萎縮させる'},
            'sep1': '---------',
            'cancel': {name: 'キャンセル'},
        }
    });
    // 桜花結晶右クリックメニュー
    $.contextMenu({
        selector: '#BOARD .sakura-token',
        build: function($elem: JQuery, event: JQueryEventObject){
            // 現在のトークン数を取得
            let region = $elem.attr('data-region') as sakuraba.SakuraTokenArea;
            let tokenCount = 0;
            if(region === 'distance'){
                tokenCount = board.distance;
            }
            if(region === 'dust'){
                tokenCount = board.dust;
            }
            if(region === 'aura'){
                tokenCount = myBoardSide.aura;
            }
            if(region === 'life'){
                tokenCount = myBoardSide.life;
            }
            if(region === 'flair'){
                tokenCount = myBoardSide.flair;
            }

            let items = {};
            let itemBaseData = [
                {key: 'moveToDistance', name: '間合へ移動', region: 'distance'},
                {key: 'moveToDust', name: 'ダストへ移動', region: 'dust'},
                {key: 'moveToAura', name: 'オーラへ移動', region: 'aura'},
                {key: 'moveToLife', name: 'ライフへ移動', region: 'life'},
                {key: 'moveToFlair', name: 'フレアへ移動', region: 'flair'},
            ];
            itemBaseData.forEach((data) => {
                if(region === data.region) return true;

                items[data.key] = {name: data.name, items: {}};
                for(let i = 1; i <= tokenCount; i++){
                    items[data.key].items[i.toString()] = {name: `${i}つ`};
                }
                return true;
            });
            items['sep1'] =  '---------';
            items['cancel'] =  {name: 'キャンセル'};

            
            return {
                callback: function(key: string) {
                },
                items: items,
            }
            


            // return {
            //     callback: function(key: string) {
            //     },
            //     items: {
            //         'move': {
            //             name: '動かす',
            //             items: {
            //                 'dust': {
            //                     name: 'ダストへ',
            //                     items: {
            //                         '1': {name: '1つ'},
            //                         '2': {name: '2つ'},
            //                         '3': {name: '3つ'},
            //                     }
            //                 }
            //             }
            //         },
            //         'sep1': '---------',
            //         'cancel': {name: 'キャンセル'},
            //     }
            // }
    
        },
    });


    // context.init({ above: 'auto' });
    // context.attach('.area.library .fbs-card', [
    //     { text: '1枚引く', action: (e) => moveLibraryToHands(0) }
    //     , { divider: true }
    //     , { text: '再構成する' }
    //     , { text: '再構成する (ライフ減少なし)' }
    // ]);

    // context.attach('.area.hand .fbs-card', [
    //     { text: '使用する' }
    //     , { text: '伏せ札にする' }
    //     , { divider: true }
    //     , { text: '自分の山札の一番底に置く ' }
    //     , { text: '相手の山札の一番上に置く (毒カード用)' }
    // ]);

    // context.attach('.area.distance .sakura-token', [
    //     { text: '→ オーラ (前進)', action: (e) => {e.preventDefault(); moveSakuraToken('distance', 'aura'); return true;} }
    //     , { divider: true }
    //     , { text: '→ ダスト' }
    //     , { text: '→ ライフ' }
    //     , { text: '→ フレア' }
    // ]);

    // context.attach('.area.dust .sakura-token', [
    //     { text: '→ オーラ (宿し)', action: (e) => {e.preventDefault(); moveSakuraToken('dust', 'aura'); return true;} }
    //     , { text: '→ 間合 (離脱)', action: (e) => {e.preventDefault(); moveSakuraToken('life', 'aura'); return true;} }
    //     , { divider: true }
    //     , { text: '→ オーラ', action: (e) => {e.preventDefault(); moveSakuraToken('life', 'aura'); return true;} }
    //     , { text: '→ ダスト' }
    //     , { text: '→ 間合' }
    // ]);

    // context.attach('.area.aura .sakura-token', [
    //     { text: '→ ダスト (ダメージ)'}
    //     , { text: '→ フレア (宿し)', action: (e) => {e.preventDefault(); moveSakuraToken('aura', 'flair'); return true;}}
    //     , { divider: true }
    //     , { text: '→ ライフ', action: (e) => {e.preventDefault(); moveSakuraToken('aura', 'life'); return true;} }
    //     , { text: '→ 間合' }
    //     , { divider: true }
    //     , { text: 'オーラの最大値を無限大に変更' }
    // ]);

    // context.attach('.area.life .sakura-token', [
    //     { text: '→ フレア (ダメージ)', action: (e) => {e.preventDefault(); moveSakuraToken('life', 'flair'); return true;} }
    //     , { divider: true }
    //     , { text: '→ オーラ', action: (e) => {e.preventDefault(); moveSakuraToken('life', 'aura'); return true;} }
    //     , { text: '→ ダスト' }
    //     , { text: '→ 間合' }
    // ]);

    // context.attach('.area.flair .sakura-token', [
    //     { text: '→ ダスト (消費)' }
    //     , { divider: true }
    //     , { text: '→ オーラ', action: (e) => {e.preventDefault(); moveSakuraToken('flair', 'aura'); return true;} }
    //     , { text: '→ ライフ', action: (e) => {e.preventDefault(); moveSakuraToken('flair', 'life'); return true;} }
    //     , { text: '→ 間合' }
    // ]);

  ;
});