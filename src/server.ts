'use strict';

import express = require('express');
import socketIO = require('socket.io');
import * as path from 'path';
import * as redis from 'redis';
import * as randomstring from 'randomstring';
import * as sakuraba from 'sakuraba';
import { ServerSocket } from 'sakuraba/socket';
import * as utils from 'sakuraba/utils';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import { VERSION } from 'sakuraba/const';
import i18next = require('i18next');
import LocizeBackend = require('i18next-node-locize-backend');
import FilesystemBackend = require('i18next-node-fs-backend');
import i18nextMiddleware = require('i18next-express-middleware');
import webpackNodeExternals = require('webpack-node-externals');

const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../index.html');
const MAIN_JS = path.join(__dirname, 'main.js');
const MAIN_JS_MAP = path.join(__dirname, 'main.js.map');
const browserSyncConfigurations = { "files": ["**/*.js", "views/*.ejs"] };


let app = express();

if(process.env.ENVIRONMENT === 'development'){
  const browserSync = require('browser-sync');
  const connectBrowserSync = require('connect-browser-sync');
  app.use(connectBrowserSync(browserSync(browserSyncConfigurations)));
}

i18next
  .use(LocizeBackend)
  .init({
    defaultNS: 'common'
    , lng: 'ja'
    , ns: ['common', 'log', 'cardset', 'help-window', 'dialog']
    , load: 'currentOnly' // 対象となった言語のみ読み込む
    , debug: true
    , fallbackLng: false
    , parseMissingKeyHandler: (k: string) => `[${k}]`
    , backend: {
      projectId: '5dfcd5bf-69f5-4e2c-b607-66b6ad4836ec'
      , referenceLng: 'ja'
    }
  });

app
  .set('views', __dirname + '/../views/')
  .set('view engine', 'ejs')
  .use(bodyParser.json())
  .use(express.static('public'))
  .use(express.static('node_modules'))
  .use(i18nextMiddleware.handle(i18next, {ignoreRoutes: ['/dist']}))
  
  .get('/locales/resources.json', i18nextMiddleware.getResourcesHandler(i18next, {})) // serves resources for consumers (browser)

  .get('/dist/main.js', (req, res) => res.sendFile(MAIN_JS) )
  .get('/dist/main.js.map', (req, res) => res.sendFile(MAIN_JS_MAP) );

  // プレイヤーとして卓URLにアクセスしたときの処理
  const playerRoute = (req: express.Request, res: express.Response, lang: Language) => {
    // キーに対応する情報の取得を試みる
    RedisClient.HGET(`sakuraba:player-key-map`, req.params.key, (err, dataJson) => {
      if(dataJson !== null){
        let data = JSON.parse(dataJson);
        res.render('board', {tableId: data.tableId, side: data.side, environment: process.env.ENVIRONMENT, version: VERSION, lang: lang})
      } else {
        res.status(404);
        res.end('NotFound : ' + req.path);
      }
    });
  };

// 卓作成処理
const tableCreateRoute = (req: express.Request, res: express.Response, langCode?: string) => {
  // 新しい卓番号を採番
  RedisClient.INCR(`sakuraba:currentTableNo`, (err, newTableNo) => {
    // トランザクションを張る
    var multiClient = RedisClient.multi();

    // 卓を追加
    let state = utils.createInitialState();
    multiClient.SET(`sakuraba:tables:${newTableNo}:board`, JSON.stringify(state.board));
    multiClient.SET(`sakuraba:tables:${newTableNo}:watchers`, JSON.stringify({}));


    // 卓へアクセスするための、プレイヤー1用アクセスキー、プレイヤー2用アクセスキーを生成
    let p1Key = randomstring.generate({
      length: 12
      , readable: true
    });
    let p2Key = randomstring.generate({
      length: 12
      , readable: true
    });

    multiClient.HSET(`sakuraba:player-key-map`, p1Key, JSON.stringify({ tableId: newTableNo, side: 'p1' }));
    multiClient.HSET(`sakuraba:player-key-map`, p2Key, JSON.stringify({ tableId: newTableNo, side: 'p2' }));

    multiClient.EXEC((err, replies) => {
      console.log(JSON.stringify(err));
      console.log(JSON.stringify(replies));

      // 卓にアクセスするためのURLを生成
      let urlBase: string;
      if (process.env.BASE_URL) {
        urlBase = process.env.BASE_URL;
      } else {
        // for development
        urlBase = req.protocol + '://' + req.hostname + ':' + PORT;
      }

      let p1Url = `${urlBase}/${langCode ? langCode + '/' : ''}play/${p1Key}`;
      let p2Url = `${urlBase}/${langCode ? langCode + '/' : ''}play/${p2Key}`;
      let watchUrl = `${urlBase}/${langCode ? langCode + '/' : ''}watch/${newTableNo}`;

      res.json({ p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl });
    });
  });
}

app
  // 卓URL (プレイヤー)
  .get('/zh/play/:key', (req, res) => {
    playerRoute(req, res, 'zh-Hans-CN');
  })
  .get('/en/play/:key', (req, res) => {
    playerRoute(req, res, 'en');
  })
  .get('/play/:key', (req, res) => {
    playerRoute(req, res, 'ja');
  })
  // 卓URL (観戦者用)
  .get('/zh/watch/:tableId', (req, res) => {
    res.render('board', {tableId: req.params.tableId, side: 'watcher', environment: process.env.ENVIRONMENT, version: VERSION, lang: 'zh-Hans-CN'})
  })
  .get('/en/watch/:tableId', (req, res) => {
    res.render('board', { tableId: req.params.tableId, side: 'watcher', environment: process.env.ENVIRONMENT, version: VERSION, lang: 'en' })
  })
  .get('/watch/:tableId', (req, res) => {
    res.render('board', {tableId: req.params.tableId, side: 'watcher', environment: process.env.ENVIRONMENT, version: VERSION, lang: 'ja'})
  })
  // トップページ
  .get('/zh', (req, res) => res.render('index', { environment: process.env.ENVIRONMENT, version: VERSION, lang: 'zh-Hans-CN'}) )
  .get('/en', (req, res) => res.render('index', { environment: process.env.ENVIRONMENT, version: VERSION, lang: 'en' }))
  .get('/', (req, res) => res.render('index', {environment: process.env.ENVIRONMENT, version: VERSION, lang: 'ja'}) )

  // 新しい卓の作成
  .post('/zh/tables.create', (req, res) => tableCreateRoute(req, res, 'zh'))
  .post('/en/tables.create', (req, res) => tableCreateRoute(req, res, 'en'))
  .post('/tables.create', (req, res) => tableCreateRoute(req, res))


  .post('/tables.create', (req, res) => {

  })
  .post('/.error-send', (req, res) => {
    let sendgrid_username   = process.env.SENDGRID_USERNAME;
    let sendgrid_password   = process.env.SENDGRID_PASSWORD;
    let sendgrid_to         = process.env.SENDGRID_TO;
    let setting = {
      host: 'smtp.sendgrid.net',
      port: 587,
      requiresAuth: true,
      auth: {
        user: sendgrid_username,
        pass: sendgrid_password
      }
    };
    let mailer = nodemailer.createTransport(setting);

    mailer.sendMail({
        from: 'noreply@morphball.net'
      , to: sendgrid_to
      , subject: '[ふるよにボードシミュレーター]'
      , text: JSON.stringify(req.body)
    });
  });

const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

/** Redis上に保存されたボードデータを取得 */
function getStoredBoard(tableId: string, callback: (board: state.VersionUnspecifiedBoard) => void){
  // ボード情報を取得
  RedisClient.GET(`sakuraba:tables:${tableId}:board`, (err, json) => {
    let boardData = JSON.parse(json) as state.VersionUnspecifiedBoard;

    // カードセット情報がなければ初期値をセット
    if(boardData.cardSet === undefined){
      boardData.cardSet = 'na-s2';
    }

    // コールバックを実行
    callback(boardData);
  });
}

/** Redisへボードデータを保存 */
function saveBoard(tableId: string, board: state.VersionUnspecifiedBoard, callback: () => void){
  // ボード情報を保存
  RedisClient.SET(`sakuraba:tables:${tableId}:board`, JSON.stringify(board), (err, success) => {
    // コールバックを実行
    callback();
  });
}

/** Redis上に保存されたアクションログを取得 */
function getStoredActionLogs(tableId: string, callback: (logs: state.ActionLogRecord[]) => void){
  // ログを取得
  RedisClient.LRANGE(`sakuraba:tables:${tableId}:actionLogs`, 0, -1, (err, jsons) => {

    let logs = jsons.map((json) => JSON.parse(json) as state.ActionLogRecord); 

    // コールバックを実行
    callback(logs);
  });
}

/** Redis上に保存されたチャットログを取得 */
function getStoredChatLogs(tableId: string, callback: (logs: state.ChatLogRecord[]) => void){
  // ログを取得
  RedisClient.LRANGE(`sakuraba:tables:${tableId}:chatLogs`, 0, -1, (err, jsons) => {

    let logs = jsons.map((json) => JSON.parse(json) as state.ChatLogRecord); 

    // コールバックを実行
    callback(logs);
  });
}

/** Redisへアクションログデータを追加 */
function appendActionLogs(tableId: string, logs: state.ActionLogRecord[], callback: (logs: state.ActionLogRecord[]) => void){
  // ログをトランザクションで追加
  let commands: string[][] = [];
  logs.forEach((log) => {
    commands.push(['RPUSH', `sakuraba:tables:${tableId}:actionLogs`, JSON.stringify(log)]);
  });
  RedisClient.multi(commands).exec((err, success) => {
    // コールバックを実行
    console.log('appendActionLogs response: ', success);
    callback(logs);
  });
}

/** Redisへチャットログデータを追加 */
function appendChatLogs(tableId: string, logs: state.ChatLogRecord[], callback: (logs: state.ChatLogRecord[]) => void){
  // ログをトランザクションで追加
  let commands: string[][] = [];
  logs.forEach((log) => {
    commands.push(['RPUSH', `sakuraba:tables:${tableId}:chatLogs`, JSON.stringify(log)]);
  });
  RedisClient.multi(commands).exec((err, success) => {
    // コールバックを実行
    console.log('appendChatLogs response: ', success);
    callback(logs);
  });
}

io.on('connection', (ioSocket) => {
  let connectedTableId = null;
  let connectedWatcherSessionId = null;
  const socket = new ServerSocket(ioSocket);

  console.log(`Client connected - ${ioSocket.id}`);
  ioSocket.on('disconnect', () => {
    console.log(`Client disconnect - ${ioSocket.id}, ${connectedTableId}, ${connectedWatcherSessionId}`)

    // もし観戦者が切断したなら、観戦者情報を削除
    if(connectedWatcherSessionId !== null){
      RedisClient.GET(`sakuraba:tables:${connectedTableId}:watchers`, (err, json) => {
        let watchers = JSON.parse(json) as { [sessionId: string]: WatcherInfo };

        // 観戦者情報を更新して、ログイン応答を返す
        if(watchers[connectedWatcherSessionId] !== undefined){
          watchers[connectedWatcherSessionId].online = false;
        }
        RedisClient.SET(`sakuraba:tables:${connectedTableId}:watchers`, JSON.stringify(watchers), (err, json) => {
          socket.emit('onWatcherLoginSuccess', { watchers: watchers });
          socket.broadcastEmit(connectedTableId, 'onWatcherChanged', { watchers: watchers });
          connectedWatcherSessionId = connectedWatcherSessionId;
        });
      });
    }
  });
  
  // 初期情報のリクエスト
  socket.on('requestFirstTableData', (p) => {
    // テーブルIDを記憶
    connectedTableId = p.tableId;

    // roomにjoin
    socket.ioSocket.join(p.tableId);

    // ボード情報を取得
    getStoredBoard(p.tableId, (board) => {
      // アクションログ情報を取得
      getStoredActionLogs(p.tableId, (actionLogs) => {
        // チャットログ情報を取得
        getStoredChatLogs(p.tableId, (chatLogs) => {
          socket.emit('onFirstTableDataReceived', {board: board, actionLogs: actionLogs, chatLogs: chatLogs, watchers: {}});
        });
      });
    });
  });

  // ボード状態の更新
  socket.on('updateBoard', (p) => {
    // ボード情報を取得
    getStoredBoard(p.tableId, (board) => {
      // 送信されたボード情報を上書き
      saveBoard(p.tableId, p.board, () => {
        // ボードが更新されたイベントを他ユーザーに配信
        socket.broadcastEmit(p.tableId, 'onBoardReceived', {board: p.board, appendedActionLogs: p.appendedActionLogs});
      });
    });
    // ログがあればサーバー側DBにログを追加
    if(p.appendedActionLogs !== null){
      appendActionLogs(p.tableId, p.appendedActionLogs, (logs) => {
        // 送信成功後は何もしない
      });
    }
  });

  // チャットログ追加
  socket.on('appendChatLog', (p) => {
    appendChatLogs(p.tableId, [p.appendedChatLog], (logs) => {
      // チャットログ追加イベントを他ユーザーに配信
      socket.broadcastEmit(p.tableId, 'onChatLogAppended', {appendedChatLogs: logs});
    });
  });

  // 通知送信
  socket.on('notify', (p) => {
      // ログが追加されたイベントを他ユーザーに配信
      socket.broadcastEmit(p.tableId, 'onNotifyReceived', {senderSide: p.senderSide, message: p.message});
  });

  // 観戦者ログイン
  socket.on('watcherLogin', (p) => {
    // 観戦者情報を取得
    RedisClient.GET(`sakuraba:tables:${p.tableId}:watchers`, (err, json) => {
      let watchers = JSON.parse(json) as { [sessionId: string]: WatcherInfo };

      // 送信されたセッションIDに対応する観戦者がいるかどうかで応答を変更
      if (watchers[p.sessionId] !== undefined) {
        // 観戦者情報を更新して、ログイン応答を返す
        watchers[p.sessionId].online = true;
        RedisClient.SET(`sakuraba:tables:${p.tableId}:watchers`, JSON.stringify(watchers), (err, json) => {
          socket.emit('onWatcherLoginSuccess', { watchers: watchers });
          socket.broadcastEmit(p.tableId, 'onWatcherChanged', { watchers: watchers });
          connectedWatcherSessionId = p.sessionId;
        });
      } else {
        socket.emit('requestWatcherName', {});
      }
    });
  });

  // 観戦者名決定
  socket.on('watcherNameInput', (p) => {
    // 観戦者情報を取得
    RedisClient.GET(`sakuraba:tables:${p.tableId}:watchers`, (err, json) => {
      let watchers = JSON.parse(json) as { [sessionId: string]: WatcherInfo };

      // 観戦者情報を更新して、ログイン応答を返す
      watchers[p.sessionId] = {name: p.name, online: true};
      RedisClient.SET(`sakuraba:tables:${p.tableId}:watchers`, JSON.stringify(watchers), (err, json) => {
        socket.emit('onWatcherLoginSuccess', { watchers: watchers });
        socket.broadcastEmit(p.tableId, 'onWatcherChanged', { watchers: watchers });
        connectedWatcherSessionId = p.sessionId;
      });
    });
  });
});