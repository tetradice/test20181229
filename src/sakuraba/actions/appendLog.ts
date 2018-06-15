import { State, LogRecord } from "../typings/state";
import * as moment from "moment";

export default {
    appendActionLog: (text: string) => (state: State) => {
        let append: LogRecord[] = [{body: text, time: moment().format()}];
        return {logs: state.board.actionLog.concat(append)};
    }
}