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
  optionalInfo?: { [key: string]: string };
  createdAt?: string;
  updatedAt?: string;
  posts?: Post[];
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
  childOf: number;
  upvotes: number;
  createdAt?: string;
  updatedAt?: string;
  voters: number[];
  details: PostDetails;
  children: Post[];
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
  user?: User;
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
