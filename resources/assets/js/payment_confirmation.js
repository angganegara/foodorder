const axios = (window.axios = require("axios"));
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

import App from "./payment/App.svelte";

const app = new App({
	target: document.body
});

window.app = app;

export default app;