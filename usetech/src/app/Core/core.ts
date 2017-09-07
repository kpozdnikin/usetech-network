export interface ISerializable<TStructure> {
	deserialize(data: TStructure): void;
	serialize(): TStructure;
}
