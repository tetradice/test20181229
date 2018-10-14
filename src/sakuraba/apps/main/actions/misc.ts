export default {
    /** ズーム倍率を変更する */
    setZoom: (p: number) => {
        return {zoom: p};
    },

    /** 観戦者の場合に表示側を変更する */
    setWatcherViewingSide: (p: {value: PlayerSide, handViewable: boolean}) => {
        return {viewingSide: p.value, handViewableFromCurrentWatcher: p.handViewable} as Partial<state.State>;
    },

    toggleHelpVisible: () => (state: state.State) => {
        return {helpVisible: !state.helpVisible} as Partial<state.State>;
    },

    toggleBgmPlaying: () => (state: state.State) => {
        return {bgmPlaying: !state.bgmPlaying} as Partial<state.State>;
    }
}