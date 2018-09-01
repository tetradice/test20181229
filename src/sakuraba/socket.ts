import { EventEmitter } from "events";

interface ServerToClientEventProps {
    onFirstBoardReceived: {board: state.Board};
    onFirstActionLogsReceived: {logs: state.LogRecord[]};
    onBoardReceived: {board: state.Board, appendedActionLogs: state.LogRecord[] | null};

    onNotifyReceived: {senderSide: PlayerSide, message: string};
}
type ServerToClientEventName = keyof ServerToClientEventProps;

interface ClientToServerEventProps {
    requestFirstBoard: {boardId: string}; 
    requestFirstActionLogs: {boardId: string}; 
    updateBoard: {boardId: string, side: PlayerSide, board: state.Board, appendedActionLogs: state.LogRecord[] | null};
    
    notify: {boardId: string, senderSide: PlayerSide, message: string};
}
type ClientToServerEventName = keyof ClientToServerEventProps;

export class ServerSocket {
    ioSocket: SocketIO.Socket;

    constructor(ioSocket: SocketIO.Socket){
        this.ioSocket = ioSocket;
    }

    emit<E extends ServerToClientEventName>(event: E, props?: ServerToClientEventProps[E]){
        console.log(`[socket] emit ${event} server -> client`, props);
        this.ioSocket.emit(event, props);
    }

    broadcastEmit<E extends ServerToClientEventName>(event: E, props?: ServerToClientEventProps[E]){
        console.log(`[socket] broadcastEmit ${event} server -> client`, props);
        this.ioSocket.broadcast.emit(event, props);
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