export declare type FetchHandler = () => Promise<any> 

export interface WindowDimensions {
  height: number,
  width: number,
}
export interface HomeFunctions {
  fetchNotifications: FetchHandler,
  // fetchOffers: FetchHandler,
}
