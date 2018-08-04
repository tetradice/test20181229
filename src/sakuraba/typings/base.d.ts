type CardRegion = "hand" | "library" | "used" | "hidden-used" | "special";
type SakuraTokenRegion = "life" | "aura" | "flair" | "distance" | "dust" | "on-card";

type PlayerSide = "p1" | "p2" | "watcher";
type VigorValue = 0 | 1 | 2;

// for webpack css-loader
declare module "*.css" {
    const classes: {[className: string]: string} // css-moduleの結果をstring型のobjectに
    export = classes
}