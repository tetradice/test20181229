import { h } from "hyperapp";
import { ActionsType } from "../actions";
import _ from "lodash";

/** 風雷ゲージ */
export const WindAndThunderGuage = (p: {side: PlayerSide, wind: number, thunder: number, left: number, top: number}) => (state: state.State, actions: ActionsType) => {
    // DOMを返す
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${p.left * state.zoom}px`
        , top: `${p.top * state.zoom}px`
        , height: `${50 * state.zoom}px`
        , position: 'absolute'
    };
    let captionStyles: Partial<CSSStyleDeclaration> = {
          fontSize: `${16 * state.zoom}px`
        , position: 'absolute'
    };
    let numberStyles: Partial<CSSStyleDeclaration> = {
          fontSize: `${20 * state.zoom}px`
        , fontWeight: 'bold'
        , color: 'silver'
        , textAlign: 'right'
        , position: 'absolute'
        , left: `${18 * state.zoom}px`
        , width: `${24 * state.zoom}px`
    };
    let buttonSectionStyles: Partial<CSSStyleDeclaration> = {
          position: 'absolute'
        , left: `${45 * state.zoom}px`
        , width: `${150 * state.zoom}px`
    };
    let buttonStyles: Partial<CSSStyleDeclaration> = {
          padding: `${2 * state.zoom}px ${8 * state.zoom}px`
        , height: '100%'
    };
    let leftButtonStyles: Partial<CSSStyleDeclaration> = _.assign({}, buttonStyles, {
        marginLeft: `${6 * state.zoom}px`
    });

    const incrementWind = () => {
        actions.operate({
            log: `風神ゲージを1上げました`,
            proc: () => {
                actions.incrementWindGuage({side: p.side});
            }
        });
    };
    const incrementThunder = () => {
        actions.operate({
            log: `雷神ゲージを1上げました`,
            proc: () => {
                actions.incrementThunderGuage({side: p.side});
            }
        });
    };
    const doubleThunder = () => {
        actions.operate({
            log: `雷神ゲージを2倍にしました`,
            proc: () => {
                actions.doubleThunderGuage({side: p.side});
            }
        });
    };
    const resetWind = () => {
        actions.operate({
            log: `風神ゲージを0に戻しました`,
            proc: () => {
                actions.resetWindGauge({side: p.side});
            }
        });
    };
    const resetThunder = () => {
        actions.operate({
            log: `雷神ゲージを0に戻しました`,
            proc: () => {
                actions.resetThunderGauge({side: p.side});
            }
        });
    };

    // ボタン類は、自分側の風雷ゲージである場合のみ表示
    let windButtons = (
        p.side === state.side ?
            (
                <div style={buttonSectionStyles}>
                    <button class={`mini ui basic button${p.wind >= 20 ? ' disabled' : ''}`} style={leftButtonStyles} onclick={incrementWind}>+1</button>
                    <button class={`mini ui basic button${p.wind === 0 ? ' disabled' : ''}`} style={buttonStyles} onclick={resetWind}>0に戻す</button>
                </div>
            )
            : null
    );
    let thunderButtons = (
        p.side === state.side ?
            (
                <div style={buttonSectionStyles}>
                    <button class={`mini ui basic button${p.thunder >= 20 ? ' disabled' : ''}`} style={leftButtonStyles} onclick={incrementThunder}>+1</button>
                    <button class={`mini ui basic button${p.thunder >= 20 ? ' disabled' : ''}`} style={buttonStyles} onclick={doubleThunder}>2倍</button>
                    <button class={`mini ui basic button${p.thunder === 0 ? ' disabled' : ''}`} style={buttonStyles} onclick={resetThunder}>0に戻す</button>
                </div>
            )
            : null
    );
    

    return (
        <div style={styles}>
            <div style={{height: `${23 * state.zoom}px`}}>
                <div style={captionStyles}>風</div>
                <div style={numberStyles}>{p.wind}</div>
                {windButtons}
            </div>
            <div style={{height: `${23 * state.zoom}px`}}>
                <div style={captionStyles}>雷</div>
                <div style={numberStyles}>{p.thunder}</div>
                {thunderButtons}
            </div>
        </div>
    );
}