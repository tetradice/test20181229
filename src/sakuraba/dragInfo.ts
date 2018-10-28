interface DragInfo {
    draggingFrom: null | state.BoardObject;
    sakuraTokenMoveCount: number;

    lastDraggingCardBeforeContextMenu: null | state.Card;
    lastDraggingSakuraTokenBeforeContextMenu: null | state.SakuraToken;
}
const dragInfo: DragInfo = {
      draggingFrom: null
    , sakuraTokenMoveCount: 0
    , lastDraggingCardBeforeContextMenu: null
    , lastDraggingSakuraTokenBeforeContextMenu: null
}
export default dragInfo;