
export as namespace store;

/** 卓情報 */
export interface Table {
    stateDataVersion: 2;

    board: state.Board;
    lastLogNo: number;

    updatedAt: string;
    updatedBy: string;
}