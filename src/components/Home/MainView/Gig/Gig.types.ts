import { Gig, Notification } from "../../../../types/API.types";

export interface NotificationsHash {
  "100"?: Notification[];
  "200"?: Notification[];
  "201"?: Notification[];
  "300"?: Notification[];
  "301"?: Notification[];
  "400"?: Notification[];
}

export type HashCode = "100" | "200" | "201" | "300" | "301" | "400";

export type BandMember = {
  id: number,
  email: string,
  name: string,
  role: string
}
export interface DetailedGig {
  gig: Gig,
  bandLeader: {
    id: number,
    email: string,
    name: string,
    photo: string
  },
  bandMembers: BandMember
}
