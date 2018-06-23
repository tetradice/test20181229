type CardRegion = "hand" | "library" | "used" | "hidden-used" | "special";
type SakuraTokenRegion = "life" | "aura" | "flair" | "distance" | "dust" | "on-card";

type PlayerSide = "p1" | "p2" | "watcher";

// for webpack css-loader
declare module "*.css" {
    const classes: {[className: string]: string} // css-moduleの結果をstring型のobjectに
    export = classes
    // import style from "./foo.css"で読み込みたいなら下記（後述）
    // export default classes
  }