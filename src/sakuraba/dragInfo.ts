interface DragInfo {
    draggingFrom: null | state.BoardObject;
    sakuraTokenMoveCount: number;

    lastDraggingCardBeforeContextMenu: null | state.Card;
}
const dragInfo: DragInfo = {
      draggingFrom: null
    , sakuraTokenMoveCount: 0
    , lastDraggingCardBeforeContextMenu: null
}
export default dragInfo;