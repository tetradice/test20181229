interface DragInfo {
    draggingFrom: null | state.BoardObject;
    sakuraTokenMoveCount: number;

    lastDraggingCardBeforeContextMenu: null | state.Card;
    lastDragToSideBeforeContextMenu: null | PlayerSide;
    lastDraggingSakuraTokenBeforeContextMenu: null | state.SakuraToken;
}
const dragInfo: DragInfo = {
      draggingFrom: null
    , sakuraTokenMoveCount: 0
    , lastDraggingCardBeforeContextMenu: null
    , lastDragToSideBeforeContextMenu: null
    , lastDraggingSakuraTokenBeforeContextMenu: null
}
export default dragInfo;