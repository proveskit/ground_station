export type PacketSchema = {
  name: string;
  type: "int" | "float" | "string" | "enum" | "vec3";
  enumValues?: string[];
}[];
