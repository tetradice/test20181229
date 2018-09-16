interface DragInfo {
    draggingFrom: null | state.BoardObject;
    sakuraTokenMoveCount: number;
}
const dragInfo: DragInfo = {
      draggingFrom: null
    , sakuraTokenMoveCount: 0
}
export default dragInfo;