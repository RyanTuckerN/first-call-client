import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
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

interface Route {
  body: ReactJSXElement;
  dash: ReactJSXElement;
}

export interface Routes {
  notifications: Route;
  gigs: Route;
  offers: Route;
  gig: Route;
  callStack: Route;
}

export type BandMember = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export type BandLeader = {
  id: number;
  email: string;
  name: string;
  photo?: string;
};

export interface DetailedGig {
  gig: Gig;
  bandLeader: BandLeader;
  bandMembers: BandMember[];
}

export type RouteOption =
  | "notifications"
  | "gigs"
  | "offers"
  | "gig"
  | "callStack";
