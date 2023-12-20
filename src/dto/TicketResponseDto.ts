import TicketStatuses from "../enums/Statuses";
import { IProfile } from "./IProfileResponse";

export interface TicketResponseDto {
    uuid: string,
    name: string,
    description: string,
    customerEmail: string,
    agentProfile: IProfile
    status: TicketStatuses,
    images?: {
        url: string,
        mimetype: string,
      }[]
}