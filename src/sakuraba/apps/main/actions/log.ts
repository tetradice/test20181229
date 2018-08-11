import moment = require('moment');
import * as models from "sakuraba/models";

export default {
    appendActionLog: (p: {text: string}) => (state: state.State) => {
        // 元の盤の状態をコピーして新しい盤を生成
        let newBoard = models.Board.clone(state.board);
        let append: state.LogRecord = {body: p.text, time: moment().format()};
        newBoard.actionLog.push(append);
        
        return {board: newBoard};
    }
}