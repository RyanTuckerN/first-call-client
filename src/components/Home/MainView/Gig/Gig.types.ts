import { Notification } from "../../../../types/API.types";

export interface NotificationsHash {
  "100"?: Notification[];
  "200"?: Notification[];
  "201"?: Notification[];
  "300"?: Notification[];
  "301"?: Notification[];
  "400"?: Notification[];
}

export type HashCode = "100" | "200" | "201" | "300" | "301" | "400";
