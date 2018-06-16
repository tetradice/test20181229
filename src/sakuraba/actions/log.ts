import * as moment from "moment";

export default {
    appendActionLog: (text: string) => (state: state.State) => {
        let append: state.LogRecord[] = [{body: text, time: moment().format()}];
        return {logs: state.board.actionLog.concat(append)};
    }
}