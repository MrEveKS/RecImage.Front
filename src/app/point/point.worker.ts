/// <reference lib="webworker" />

addEventListener('message', (message: MessageEvent) => {
  postMessage(message.data);
});