export default {
    /** ズーム倍率を変更する */
    setZoom: (p: number) => {
        return {zoom: p};
    },

    toggleHelpVisible: () => (state: state.State) => {
        return {helpVisible: !state.helpVisible};
    },

    toggleBgmPlaying: () => (state: state.State) => {
        return {bgmPlaying: !state.bgmPlaying};
    }
}