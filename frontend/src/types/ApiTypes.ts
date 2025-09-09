export type MissionType = {
  id: number;
  name: string;
  createdAt: Date;
};

export type MissionTypeApi = {
  id: number;
  name: string;
  createdAt: string;
};

export type Packet = {
  id: number;
  mission_id: number;
  schema_id: number;
  received_at: string;
  packet_data: string;
};

export type Command = {
  id: number;
  mission_id: number;
  name: string;
  description?: string;
  args: string[];
  cmd_string: string;
};

export type CommandArgs = { [key: string]: { required: boolean } };
