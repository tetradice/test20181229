type CardRegion = "hand" | "library" | "used" | "hidden-used" | "extra" | "special" | "on-card";
type SakuraTokenRegion = "life" | "aura" | "flair" | "distance" | "dust" | "on-card";

type PlayerSide = "p1" | "p2";
type SheetSide = PlayerSide | "watcher";

type LogVisibility = 'ownerOnly' | 'outerOnly' | 'shown';
type CardOpenState = 'opened' | 'ownerOnly' | 'hidden';
type PlanState = null | 'back-blue' | 'back-red' | 'blue' | 'red';

type VigorValue = 0 | 1 | 2;

// for webpack css-loader
declare module "*.css" {
    const classes: {[className: string]: string} // css-moduleの結果をstring型のobjectに
    export = classes
}