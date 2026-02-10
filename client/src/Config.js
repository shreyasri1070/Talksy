let baseUrl;
let socketUrl;

if (process.env.VITE_NODE_ENV === "production") {
  baseUrl = "your-deployed-URL";
  socketUrl = "wss://your-deployed-url";
} else {
  baseUrl = "http://localhost:7000";
  socketUrl = "ws://localhost:7000";
}

export { baseUrl, socketUrl };