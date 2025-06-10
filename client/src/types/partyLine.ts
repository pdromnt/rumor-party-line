export type PartyLine = {
  name: string;
  clients: Client[];
  lastActivity: number;
  lastEvent: string;
}

export type Client = {
  clientId: string;
  ipAddress: string;
}
