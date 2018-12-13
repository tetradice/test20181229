type CardRegion = "hand" | "library" | "used" | "hidden-used" | "extra" | "special" | "on-card";
type SakuraTokenRegion = "life" | "aura" | "flair" | "distance" | "dust" | "on-card" | "machine" | "burned" | "out-of-game";

type PlayerSide = "p1" | "p2";
type SheetSide = PlayerSide | "watcher";

type LogVisibility = 'ownerOnly' | 'outerOnly' | 'shown';
type CardOpenState = 'opened' | 'ownerOnly' | 'hidden';
type PlanState = null | 'back-blue' | 'back-red' | 'blue' | 'red';
type UmbrellaState = null | 'closed' | 'opened';

type CardSet = 'na-s2' | 'na-s3';

type VigorValue = 0 | 1 | 2;

type LogValue = [string, { [key: string]: LogValueParam} | null];

type LogValueParam = string | number | LogValueCardNameParam | LogValue;
type LogValueCardNameParam = { type: 'cardName', cardSet: CardSet, cardId: string }

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
