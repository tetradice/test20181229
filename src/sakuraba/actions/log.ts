import * as moment from "moment";

export default {
    appendActionLog: (p: {text: string}) => (state: state.State) => {
        let append: state.LogRecord[] = [{body: p.text, time: moment().format()}];
        return {logs: state.board.actionLog.concat(append)};
    }
}