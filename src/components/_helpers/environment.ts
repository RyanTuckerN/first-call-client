let API_URL: string = "";

switch (window.location.hostname) {
  case "localhost" || "127.0.0.1":
    API_URL = "http://localhost:3333";
    break;
  case "firstcallapp.herokuapp.com":
    API_URL = "https://api-firstcall.herokuapp.com";
}

export default API_URL;
