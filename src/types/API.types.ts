import { DetailedGig } from "../components/Home/MainView/Gig/Gig.types";

export interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  location?: string;
  paymentPreference?: { [key: string]: string } | null;
  followers: number[];
  following: number[];
  createdAt?: string;
  updatedAt?: string;
  emails?: boolean;
  gigs?: Gig[];
  posts?: Post[];
  notifications?: Notification[];
  stories: Story[];
  photo?: string;
}
export interface Gig {
  id: number;
  ownerId: number;
  description: string;
  gigLocation: string;
  date: string;
  payment: number;
  token: string;
  openCalls: string[];
  photo?: string;
  optionalInfo?: { [key: string]: string };
  createdAt?: string;
  updatedAt?: string;
  posts?: Post[];
  callStack?: CallStack;
}
export interface CallStack {
  gigId: number;
  filled: boolean;
  stackTable: { [key: string]: any };
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id: number;
  author: number;
  text: string;
  childOf: number | null;
  gigId: number;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  voters: number[];
  user?: User;
  details: PostDetails;
  children?: Post[];
}
interface PostDetails {
  edited?: boolean;
  deleted?: boolean;
  editedAt?: string;
  deletedAt?: string;
  originalText?: string;
  editHistory?: PostHistoryObject[];
}
interface PostHistoryObject {
  editedAt: "string";
  originalText: "string";
}
export interface Notification {
  id: number;
  userId: number;
  text: string;
  details: NotificationDetails;
  createdAt: string;
  updatedAt?: string;
}
interface NotificationDetails {
  to: string;
  code: number;
  role: string;
  gigId: number;
  sender: string;
  dateTime: string;
  recieverExists: boolean;
  body?: string;
  subject?: string;
  nextUser?: string;
}
export interface UserAuth {
  auth: boolean;
  user: User;
  err?: any;
}
export interface Story {
  id: number;
  text: string;
  imageUrl: string;
  likers: number[];
  createdAt: string;
  updatedAt?: string;
  userId: number;
  user: { name: string; photo: string; id: number };
  posts: Post[];
}
export interface DetailsHash {
  [key: string | number]: DetailedGig;
}
