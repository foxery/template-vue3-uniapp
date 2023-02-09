import { createSSRApp } from "vue";
import App from "./App.vue";
import { setupStore } from './store/index';

export function createApp() {
  const app = createSSRApp(App);
  setupStore(app);
  return {
    app,
  };
}
