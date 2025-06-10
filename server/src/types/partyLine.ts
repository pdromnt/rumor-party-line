export type PartyLine = {
    clients: Client[];
    lastActivity: number;
    lastEvent: string;
}

export type Client = {
    clientId: string;
    response: any;
    ipAddress: string;
}
