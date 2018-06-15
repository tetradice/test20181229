export as namespace sakuraba

/** JSONにSerialize可能な値を表す型 */
export type SerializableObject = {[key: string]: SerializableValue};
export type SerializableValue = SerializablePrimitiveValue | SerializableArray | SerializableObject;
export type SerializableArray = Array<SerializablePrimitiveValue> | Array<SerializableObject>;
export type SerializablePrimitiveValue = undefined | null | boolean | string | number;