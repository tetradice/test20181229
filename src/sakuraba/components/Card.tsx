import { h } from "hyperapp";

/** カード */
interface Props {card: state.Card};
export const Card = ({card}: Props) => (state: state.State, actions) => {
    let styles: Partial<CSSStyleDeclaration> = {
          left: `${40}px`
        , top: `${20}px`
    };
    return <div class="fbs-card" id={card.id} style={styles}></div>;
}