let API_URL: string = "";

switch (window.location.hostname) {
  case "localhost" || "127.0.0.1":
    API_URL = "http://localhost:3333";
    break;
  case "tmor-pet-tinder-client.herokuapp.com":
    API_URL = "https://first-call.herokuapp.com";
}

export default API_URL;
