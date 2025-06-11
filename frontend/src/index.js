import { App } from './App.js';

if (!window.webixAppInitialized) {
    if (window.webix && typeof window.webix.ready === 'function') {
        webix.ready(() => {
            if (webix.$$("appRoot")) {
                webix.$$("appRoot").destructor();
            }
            webix.ui(App);
            window.webixAppInitialized = true;
        });
    } else {
        setTimeout(() => {
            if (webix.$$("appRoot")) {
                webix.$$("appRoot").destructor();
            }
            webix.ui(App);
            window.webixAppInitialized = true;
        }, 100);
    }
}

if (import.meta.hot) {
    import.meta.hot.accept(() => {
        console.log('HMR detected, skipping UI re-initialization');
    });
}