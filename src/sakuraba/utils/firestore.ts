import { firestore } from "firebase";
import { StoreName } from "sakuraba/const";
import moment = require("moment");

/** 指定したオブジェクトをfirestoreに保存可能な形式に変換 */
export function convertForFirestore<T>(target: T): T {
    let newValue = convertValueForFirestore(target);
    console.log('convert %o -> %o', target, newValue);
    return newValue;
}

/** 指定した値をfirestoreに保存可能な形式に変換 */
export function convertValueForFirestore(value: any) {
    // undefined, 関数は無視 (すべてundefinedに変換する)
    if (value === undefined || typeof value === 'function') {
        return undefined;
    }

    // nullはそのまま返す
    if (value === null) {
        return value;
    }

    // 配列、objectは再帰的に処理
    if (Array.isArray(value)) {
        return value.map(x => convertValueForFirestore(x));
    }
    if (typeof value === 'object') {
        let ret = {};
        for (let key of Object.keys(value)) {
            let newValue = convertValueForFirestore(value[key]);
            if (newValue !== undefined) {
                ret[key] = newValue;
            }
        };
        return ret;
    }

    // それ以外の値はそのまま
    return value;
}

/** ログをFirestoreへ送信 */
export function sendLogToFirestore(db: firestore.Firestore, tableId: string, logs: state.LogRecord[], updateBy: SheetSide){
    let tableRef = db.collection(StoreName.TABLES).doc(tableId);
    let logsRef = tableRef.collection(StoreName.LOGS);

    // トランザクション開始
    db.runTransaction(function (tran) {
        // テーブル情報を取得
        return tran.get(tableRef).then(tableSS => {
            let table = tableSS.data() as store.Table;
            let logNo = table.lastLogNo;
            // ログNOを採番しながら登録
            logs.forEach(log => {
                logNo++;
                log.no = logNo; // 付番
                let storedLog = convertForFirestore(log);
                tran.set(logsRef.doc(logNo.toString()), storedLog);
            });

            // ボード情報は更新しない
            let tableObj: Partial<store.Table> = {
                stateDataVersion: 2
                , lastLogNo: logNo

                , updatedAt: moment().format()
                , updatedBy: updateBy
            };

            tran.update(tableRef, tableObj);
        })
    }).then(function () {
        console.log("Log written to firestore");
    });
}