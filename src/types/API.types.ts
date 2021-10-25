import {DetailedGig} from '../components/Home/MainView/Gig/Gig.types'

export interface User {
  id: number;
  email: string;
  name: string;
  role?: string;
  description?: string;
  location?: string;
  paymentPreference?: { platform?: string; handle?: string } | null;
  specialties?: string[];
  createdAt?: string;
  updatedAt?: string;
  emails?: boolean;
  gigs?: Gig[];
  posts?: Post[];
  notifications?: Notification[];
  photo?: string;
}
export interface Gig {
  id: number;
  ownerId: number;
  description: string;
  location: string;
  date: string; //date format
  payment: number;
  token: string; //uuid
  openCalls: string[];
  photo?: string;
  optionalInfo?: { [key: string]: string };
  createdAt?: string;
  updatedAt?: string;
  posts?: Post[];
  callStack?: CallStack
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
  createdAt?: string;
  updatedAt?: string;
}
export interface UserAuth {
  auth: boolean;
  user: User;
  err?: any;
}
interface NotificationDetails {
  to: string;
  code: number;
  role: string;
  gigId: number;
  sender: string;
  dateTime: string;
  recieverExists: boolean;
  nextUser?: string;
}

export interface DetailsHash{
  [key: string|number]: DetailedGig
}
