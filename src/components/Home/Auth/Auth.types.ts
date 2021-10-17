import { User } from '../../../types/API.types'

export declare type ChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement>
) => void;

export declare type FormHandler = (
  e: React.FormEvent<HTMLInputElement>
) => void;

export declare type StateHandler = () => void;

export interface LoginSignupProps {
  handleEmail: ChangeHandler;
  handlePassword: ChangeHandler;
  handleFirst: ChangeHandler;
  handleLast: ChangeHandler;
  handleLogin: FormHandler;
  handleSignup: FormHandler;
  clearState: StateHandler;
}

export interface UserResponse {
  message: string;
  sessionToken?: string;
  user?: User;
}
