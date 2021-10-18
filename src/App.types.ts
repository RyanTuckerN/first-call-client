import * as React from 'react';
import { User } from "./types/API.types";

export declare type UserSetter = (user: User) => Promise<boolean>;
export declare type StateSetter = (user: User) => void
export declare type TokenSetter = (token: string) => void;
export declare type ColorSetter = (e: React.ChangeEvent<HTMLInputElement>) => void;
export declare type EmailSetter = () => Promise<void>;
// export type ColorMode = 'dark' | 'light'