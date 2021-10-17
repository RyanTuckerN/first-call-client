// import * as React from "react";
import { createContext } from "react";
import { AppState } from "../../App";

export const UserCtx = createContext<AppState | null>(null);
