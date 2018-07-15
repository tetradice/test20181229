import * as  _ from "lodash";

export default {
    /**
     * 指定したオブジェクトを、別の領域に移動させる
     */
    moveObject: (p: {
        /** 対象のオブジェクトID */
        objectId: string;
        /** 移動先の領域 */
        toRegion: CardRegion;
    }) => (state: state.State) => {
        let newBoard = _.merge({}, state.board);

        let index = newBoard.objects.findIndex(v => v.type === 'card' && v.id === p.objectId);
        (newBoard.objects[index] as state.Card).region = p.toRegion;

        // 新しい盤を返す
        return {board: newBoard};
    }
}




