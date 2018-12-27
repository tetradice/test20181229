'use strict';

import express = require('express');
import socketIO = require('socket.io');
import * as path from 'path';
import * as redis from 'redis';
import * as randomstring from 'randomstring';
import * as sakuraba from 'sakuraba';
import * as utils from 'sakuraba/utils';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import { VERSION, StoreName } from 'sakuraba/const';
import i18next = require('i18next');
import LocizeBackend = require('i18next-node-locize-backend');
import FilesystemBackend = require('i18next-node-fs-backend');
import i18nextMiddleware = require('i18next-express-middleware');
import webpackNodeExternals = require('webpack-node-externals');
import { Base64 } from 'js-base64';
import _ from 'lodash';
import moment = require('moment');
import { firestore } from 'firebase';
import { promisify } from 'util';
import { exists } from 'fs';
const admin = require('firebase-admin');

const RedisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../index.html');
const MAIN_JS = path.join(__dirname, 'main.js');
const MAIN_JS_MAP = path.join(__dirname, 'main.js.map');
const TOPPAGE_JS = path.join(__dirname, 'toppage.js');
const TOPPAGE_JS_MAP = path.join(__dirname, 'toppage.js.map');
const browserSyncConfigurations = { "files": ["**/*.js", "views/*.ejs"] };


let app = express();
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.GOOGLE_CLOUD_KEYFILE_JSON))
});
var db: firebase.firestore.Firestore = admin.firestore();

if(process.env.ENVIRONMENT === 'development'){
  const browserSync = require('browser-sync');
  const connectBrowserSync = require('connect-browser-sync');
  app.use(connectBrowserSync(browserSync(browserSyncConfigurations)));
}

i18next
  .use(FilesystemBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    defaultNS: 'common'
    , ns: ['common', 'log', 'cardset', 'help-window', 'dialog', 'about-window', 'toppage']
    , lng: 'ja'
    , load: 'currentOnly' // 対象となった言語のみ読み込む
    , debug: false
    , fallbackLng: false
    , parseMissingKeyHandler: (k: string) => `[${k}]`
    , backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    }
  });

const firebaseAuthInfo = Base64.encode(
  `${process.env.FIREBASE_API_KEY} ${process.env.FIREBASE_AUTH_DOMAIN} ${process.env.FIREBASE_DATABASE_URL} ${process.env.FIREBASE_PROJECT_ID} ${process.env.FIREBASE_STORAGE_BUCKET} ${process.env.FIREBASE_MESSAGING_SENDER_ID}`
);

app
  .set('views', __dirname + '/../views/')
  .set('view engine', 'ejs')
  .use(bodyParser.json())
  .use(express.static('public'))
  .use(express.static('node_modules'))
  .use(i18nextMiddleware.handle(i18next, {ignoreRoutes: ['/dist']}))
  
  .get('/locales/resources.json', i18nextMiddleware.getResourcesHandler(i18next, {})) // serves resources for consumers (browser)

  .get('/dist/main.js', (req, res) => res.sendFile(MAIN_JS) )
  .get('/dist/main.js.map', (req, res) => res.sendFile(MAIN_JS_MAP))
  .get('/dist/toppage.js', (req, res) => res.sendFile(TOPPAGE_JS))
  .get('/dist/toppage.js.map', (req, res) => res.sendFile(TOPPAGE_JS_MAP));

  // プレイヤーとして卓URLにアクセスしたときの処理
  const playerRoute = (req: express.Request, res: express.Response, lang: Language) => {
    // キーに対応する情報の取得を試みる
    db.collection(StoreName.PLAYER_KEY_MAP).doc(req.params.key).get().then((doc) => {
      if(doc.exists){
        // 描画スタート
        res.render('board', {
          tableId: doc.data().tableNo
          , side: doc.data().side
          , environment: process.env.ENVIRONMENT
          , version: VERSION
          , lang: lang

          , firebaseAuthInfo: firebaseAuthInfo
        })
      } else {
        res.status(404);
        res.end('NotFound : ' + req.path);
      }
    });

    // RedisClient.HGET(`sakuraba:player-key-map`, req.params.key, (err, dataJson) => {

    // });
  };

// 卓作成処理
const tableCreateRoute = (req: express.Request, res: express.Response, langCode?: string) => {
  // 現在の卓番号を取得
  let metaRef = db.collection(StoreName.METADATA).doc('0');
  db.runTransaction((tran) => {
    return tran.get(metaRef).then((metaDataDoc) => {
      // 新しい卓番号を採番して記録
      let lastTableNo = 0;
      if (metaDataDoc.exists) {
        lastTableNo = metaDataDoc.data().lastTableNo;
      }
      let newTableNo = lastTableNo + 1;
      tran.set(metaRef, { lastTableNo: newTableNo });

      // 新しい卓を生成して記録
      let state = utils.createInitialState();
      let newTable: store.Table = {
          board: state.board
        , stateDataVersion: 2
        , lastLogNo: 0

        , updatedAt: null
        , updatedBy: null
      };
      tran.set(db.collection(StoreName.TABLES).doc(newTableNo.toString()), newTable);

      // 卓へアクセスするための、プレイヤー1用アクセスキー、プレイヤー2用アクセスキーを生成
      let p1Key = randomstring.generate({
        length: 12
        , readable: true
      });
      let p2Key = randomstring.generate({
        length: 12
        , readable: true
      });

      // プレイヤーキーと卓の紐づけを記録
      let keyMapRef = db.collection(StoreName.PLAYER_KEY_MAP);
      let p1Ref = keyMapRef.doc(p1Key);
      tran.set(p1Ref, { tableNo: newTableNo, side: 'p1' });
      let p2Ref = keyMapRef.doc(p2Key);
      tran.set(p2Ref, { tableNo: newTableNo, side: 'p2' });

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

      // 生成したURL情報を返す
      res.json({ p1Url: p1Url, p2Url: p2Url, watchUrl: watchUrl });
    });
  });

}

app
  // 卓URL (プレイヤー)
  .get('/zh/play/:key', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('zh-Hans-CN');
    playerRoute(req, res, 'zh-Hans-CN');
  })
  .get('/en/play/:key', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('en');
    playerRoute(req, res, 'en');
  })
  .get('/play/:key', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('ja');
    playerRoute(req, res, 'ja');
  })
  // 卓URL (観戦者用)
  .get('/zh/watch/:tableId', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('zh-Hans-CN');
    res.render('board', { tableId: req.params.tableId, side: 'watcher', environment: process.env.ENVIRONMENT, version: VERSION, lang: 'zh-Hans-CN', firebaseAuthInfo: firebaseAuthInfo})
  })
  .get('/en/watch/:tableId', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('en');
    res.render('board', { tableId: req.params.tableId, side: 'watcher', environment: process.env.ENVIRONMENT, version: VERSION, lang: 'en', firebaseAuthInfo: firebaseAuthInfo })
  })
  .get('/watch/:tableId', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('ja');
    res.render('board', { tableId: req.params.tableId, side: 'watcher', environment: process.env.ENVIRONMENT, version: VERSION, lang: 'ja', firebaseAuthInfo: firebaseAuthInfo})
  })
  // トップページ
  .get('/zh', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('zh-Hans-CN');
    res.render('index', { environment: process.env.ENVIRONMENT, version: VERSION, lang: 'zh-Hans-CN', i18next: i18next });
  })
  .get('/en', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('en');
    res.render('index', { environment: process.env.ENVIRONMENT, version: VERSION, lang: 'en', i18next: i18next });
  })
  .get('/', (req, res) => {
    ((req as any).i18n as i18next.i18n).changeLanguage('ja');
    res.render('index', { environment: process.env.ENVIRONMENT, version: VERSION, lang: 'ja', i18next: i18next });
  })
  // 新しい卓の作成
  .post('/zh/tables.create', (req, res) => tableCreateRoute(req, res, 'zh'))
  .post('/en/tables.create', (req, res) => tableCreateRoute(req, res, 'en'))
  .post('/tables.create', (req, res) => tableCreateRoute(req, res))

  // Redisからコンバート
  .get('/.convert/:tableIdStart-:tableIdEnd', (req, res) => {
    for (let i = parseInt(req.params.tableIdStart); i <= parseInt(req.params.tableIdEnd); i++){
      convertRedisTable(i.toString());
    }
    res.status(200).send('Complete.');
  })
  .get('/.convertSum/:tableIdStart-:tableIdEnd', (req, res) => {
    // 現在の卓番号を取得
    const getAsync = promisify(RedisClient.get).bind(RedisClient) as (key: string) => Promise<string>;
    const llenAsync = promisify(RedisClient.llen).bind(RedisClient) as (key: string) => Promise<number>;
    const existsAsync = promisify(RedisClient.exists).bind(RedisClient) as (key: string) => Promise<boolean>;

    getAsync('sakuraba:currentTableNo').then(function(v){
      console.log("currentTableNo: %s", v);
      let currentTableNo = parseInt(v);

      // アクションログの数をすべての卓について取得し、結果を出力する関数
      async function getActionLogTotalCount(start: number, end: number){
        let total = 0;
        for (let i = start; i <= end && i <= currentTableNo; i++) {
          if (await existsAsync(`sakuraba:tables:${i}:board`)){
            total += 1;
          } else {
            console.log(`!! table ${i} board not found!`);
          }

          let c = await llenAsync(`sakuraba:tables:${i}:actionLogs`);
          total += c;
          console.log(`table ${i} actionLogs x${c}`);

          c = await llenAsync(`sakuraba:tables:${i}:chatLogs`);
          total += c;
          console.log(`table ${i} chatLogs x${c}`);

        }
        console.log(`total: ${total}`);
      }

      getActionLogTotalCount(parseInt(req.params.tableIdStart), parseInt(req.params.tableIdEnd));
    });
    
    res.status(200).send('Complete.');
  })
  .get('/.convertAll', (req, res) => {
    let tableId: string = req.params.tableId;
    RedisClient.HGETALL(`sakuraba:player-key-map`, (err, data) => {
      if (data !== null) {
        let batch: firestore.WriteBatch;
        let op = 0;

        batch = db.batch();
        for(let key in data){
          let rec = JSON.parse(data[key]);
          batch.set(db.collection(StoreName.PLAYER_KEY_MAP).doc(key), { side: rec.side, tableNo: rec.tableId});
          console.log(rec);
          op++;

          if(op >= 400){
            batch.commit().then(function () {
              console.log("wrote.");
            }).catch(function (reason) {
              res.status(400).send(reason);
            });
            batch = db.batch();
          }
        }
        batch.commit().then(function(){
          res.status(200).send('OK.');
        }).catch(function(reason){
          res.status(400).send(reason);
        });

        

      }
    });
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


function convertRedisTable(tableId: string){
  getStoredBoard(tableId, (board) => {
    getStoredActionLogs(tableId, (actionLogs) => {
      getStoredChatLogs(tableId, (chatLogs) => {
        console.log("convert table %s", tableId);
        if(board){
          let tableRef = db.collection(StoreName.TABLES).doc(tableId);
          let newActionLogs = utils.convertV1ActionLogs(actionLogs, 1, board.watchers);
          let newChatLogs = utils.convertV1ChatLogs(chatLogs, newActionLogs.length + 1, board.watchers);

          // オペレーションのリストを作る
          let operations: ['set' | 'delete', firestore.DocumentReference, any][] = [];

          operations.push(['delete', tableRef, null]);
          let newTable: store.Table = {
            board: board
            , lastLogNo: newActionLogs.length + newChatLogs.length
            , stateDataVersion: 2
            , updatedAt: moment().format()
            , updatedBy: 'convertBatch'
          };
          operations.push(['set', tableRef, newTable]);

          let logsRef = tableRef.collection(StoreName.LOGS);
          let newLogs = (newActionLogs as state.LogRecord[]).concat(newChatLogs);
          for (let log of newLogs) {
            operations.push(['set', logsRef.doc(log.no.toString()), log]);
          }

          //console.log("%d operations", operations.length);

          for(let i = 0; i < Math.ceil(operations.length / 100); i++){
            //console.log(i);
            //console.log("  - seq %d", i);
            let batch = db.batch();
            for (let j = 0; (i * 100 + j) < operations.length && j < 100; j++){
              let [op, ref, data] = operations[i * 100 + j];
              if(op === 'set'){
                batch.set(ref, data);
              }
              if(op === 'delete'){
                batch.delete(ref);
              }
            }
            //batch.commit();
          }
          //console.log("completed.")
        }
      });
    });
  });
}
/** Redis上に保存されたボードデータを取得 */
function getStoredBoard(tableId: string, callback: (board: state_v1.Board) => void) {
  // ボード情報を取得
  RedisClient.GET(`sakuraba:tables:${tableId}:board`, (err, json) => {
    let boardData = JSON.parse(json) as state_v1.Board;

    // カードセット情報がなければ初期値をセット
    if (boardData && boardData.cardSet === undefined) {
      boardData.cardSet = 'na-s2';
    }

    // コールバックを実行
    callback(boardData);
  });
}

/** Redis上に保存されたアクションログを取得 */
function getStoredActionLogs(tableId: string, callback: (logs: state_v1.LogRecord[]) => void) {
  // ログを取得
  RedisClient.LRANGE(`sakuraba:tables:${tableId}:actionLogs`, 0, -1, (err, jsons) => {

    let logs = jsons.map((json) => JSON.parse(json) as state_v1.LogRecord);

    // コールバックを実行
    callback(logs);
  });
}

/** Redis上に保存されたチャットログを取得 */
function getStoredChatLogs(tableId: string, callback: (logs: state_v1.LogRecord[]) => void) {
  // ログを取得
  RedisClient.LRANGE(`sakuraba:tables:${tableId}:chatLogs`, 0, -1, (err, jsons) => {

    let logs = jsons.map((json) => JSON.parse(json) as state_v1.LogRecord);

    // コールバックを実行
    callback(logs);
  });
}
