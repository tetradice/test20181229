type CardRegion = "hand" | "library" | "used" | "hidden-used" | "extra" | "special" | "on-card";
type SakuraTokenRegion = "life" | "aura" | "flair" | "distance" | "dust" | "on-card" | "machine" | "burned";

type PlayerSide = "p1" | "p2";
type SheetSide = PlayerSide | "watcher";

type LogVisibility = 'ownerOnly' | 'outerOnly' | 'shown';
type CardOpenState = 'opened' | 'ownerOnly' | 'hidden';
type PlanState = null | 'back-blue' | 'back-red' | 'blue' | 'red';
type UmbrellaState = null | 'closed' | 'opened';

type VigorValue = 0 | 1 | 2;

type LogValue = string | [string, object] | {type: 'cardName', cardSet: string, cardId: string};

/** 観戦者情報 */
interface WatcherInfo {
    name: string;
    online: boolean;
}

// for webpack css-loader
declare module "*.css" {
    const classes: {[className: string]: string} // css-moduleの結果をstring型のobjectに
    export = classes
}
