export type TimeStr = string;
export type PlayerSide = 1 | 2;
export type SerializableObject = {[key: string]: SerializableValue};
export type SerializableArray = Array<SerializablePrimaryValue> | Array<SerializableObject>;
export type SerializableValue = SerializablePrimaryValue | SerializableArray | SerializableObject;
export type SerializablePrimaryValue = undefined | null | boolean | string | number;

export type RegionName = 'distance' | 'dust' | 'p1-hands' | 'p2-hands'