import { EventEmitter } from "events";

interface ServerToClientEventProps {
    onFirstTableDataReceived: {board: state.Board, actionLogs: state.ActionLogRecord[], chatLogs: state.ChatLogRecord[], watchers: {[sessionId: string]: WatcherInfo}};
    onBoardReceived: {board: state.Board, appendedActionLogs: state.ActionLogRecord[] | null};
    onChatLogAppended: {appendedChatLogs: state.ChatLogRecord[]};

    onNotifyReceived: {senderSide: PlayerSide, message: string};

    onWatcherLoginSuccess: {watchers: {[sessionId: string]: WatcherInfo}};
    onWatcherChanged: {watchers: {[sessionId: string]: WatcherInfo}};
    requestWatcherName: {};
}
type ServerToClientEventName = keyof ServerToClientEventProps;

interface ClientToServerEventProps {
    requestFirstTableData: {tableId: string}; 
    updateBoard: {tableId: string, side: SheetSide, board: state.Board, appendedActionLogs: state.ActionLogRecord[] | null};
    appendChatLog: {tableId: string, appendedChatLog: state.ChatLogRecord};

    notify: {tableId: string, senderSide: PlayerSide, message: string};

    watcherLogin: {tableId: string, sessionId: string};
    watcherNameInput: {tableId: string, sessionId: string, name: string};
}
type ClientToServerEventName = keyof ClientToServerEventProps;

export class ServerSocket {
    ioSocket: SocketIO.Socket;

    constructor(ioSocket: SocketIO.Socket){
        this.ioSocket = ioSocket;
    }

    // クライアントに送信
    emit<E extends ServerToClientEventName>(event: E, props?: ServerToClientEventProps[E]){
        console.log(`[socket] emit ${event} server -> client`, props);
        this.ioSocket.emit(event, props);
    }

    // 他ユーザーに送信
    broadcastEmit<E extends ServerToClientEventName>(tableId: string, event: E, props?: ServerToClientEventProps[E]){
        console.log(`[socket] broadcastEmit ${event} server -> client`, props);
        this.ioSocket.broadcast.to(tableId).emit(event, props);
    }

    on<E extends ClientToServerEventName>(event: E, fn: (props: ClientToServerEventProps[E]) => any){
        this.ioSocket.on(event, (props) => {
            console.log(`[socket] on ${event} server <- client`, props);
            fn(props);
        });
    }
}

export class ClientSocket {
    ioSocket: SocketIOClient.Socket;

    constructor(ioSocket: SocketIOClient.Socket){
        this.ioSocket = ioSocket;
    }

    emit<E extends ClientToServerEventName>(event: E, props?: ClientToServerEventProps[E]){
        console.log(`[socket] emit ${event} client -> server`, props);
        this.ioSocket.emit(event, props);
    }

    on<E extends ServerToClientEventName>(event: E, fn: (props: ServerToClientEventProps[E]) => any){
        this.ioSocket.on(event, (props) => {
            console.log(`[socket] on ${event} client <- server`, props);
            fn(props);
        });
    }
}