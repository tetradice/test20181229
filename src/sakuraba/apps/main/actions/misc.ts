export default {
    /** ズーム倍率を変更する */
    setZoom: (p: number) => {
        return {zoom: p};
    },

    toggleBgmPlaying: () => (state: state.State) => {
        return {bgmPlaying: !state.bgmPlaying};
    }
}