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

type LogValue = [string, { [key: string]: LogParamValue} | null];

type LogParamValue = string | number | state.ActionLogCardNameItem | state.ActionLogCardSetNameItem | state.ActionLogCardSetNameItem | LogValue;

/** 言語 (この値はi18nextに設定される) */
type Language = 'ja' | 'zh' | 'en';

/** 言語タイプ (自動判別 / 全体指定 / 個別指定) */
type LanguageType = 'auto' | 'allEqual' | 'individual';

/** 言語設定オブジェクト */
type LanguageSetting = {type: LanguageType, ui: Language, uniqueName: Language, cardText: Language};


// for webpack css-loader
declare module "*.css" {
    const classes: {[className: string]: string} // css-moduleの結果をstring型のobjectに
    export = classes
}
