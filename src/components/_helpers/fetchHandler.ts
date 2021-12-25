type Method =
  | "post"
  | "POST"
  | "get"
  | "GET"
  | "put"
  | "PUT"
  | "delete"
  | "DELETE";

interface FetchOptions {
  url: string;
  method?: Method;
  auth?: string;
  body?: { [key: string]: any };
}

/**
 *
 * @param options
 * @param options.url  string
 * @param options.method ?: 'get' | 'post' | 'put' | 'delete'
 * @param options.auth ?: string (sessionToken)
 * @param options.body ?: {key: value}
 * @returns Promise: json response
 */

export async function fetchHandler({ url, method, body, auth }: FetchOptions): Promise<any> {

  const results =
    method?.toUpperCase() === "GET" || !method
      ? await fetch(url, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: auth || "",
          }),
        })
      : await fetch(url, {
          method: method && method.toUpperCase(),
          body: JSON.stringify(body || {}),
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: auth || "",
          }),
        });
  const json = await results.json();
  return json;
}
