import { LoginForm } from './components/LoginForm.js';
import { PreferencesForm } from './components/PreferencesForm.js';
import { getToken } from './api/auth.js';

export const App = {
    id: "appRoot",
    padding: { top: 10, bottom: 10, left: 100, right: 100 },

    rows: [
        {
            view: "toolbar",
            id: "mainToolbar",
            elements: [
                {
                    view: "label",
                    id: "titleLabel",
                    label: "User Preferences",
                    inputWidth: 200,
                    attributes: { "aria-label": "Application Title" }
                },
                {
                    view: "button",
                    id: "logoutBtn",
                    value: "Logout",
                    width: 100,
                    hidden: true,
                    css: "webix_danger",
                    click: () => {
                        console.log('Logout clicked, switching to loginView');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        const mainView = webix.$$("mainView");
                        if (mainView) {
                            mainView.setValue("loginView");
                            webix.$$("logoutBtn").hide();
                            webix.message("Logged out successfully");
                        } else {
                            console.error('mainView not found during logout');
                            webix.message({ type: "error", text: "Logout failed: UI not initialized" });
                        }
                    },
                    attributes: { "aria-label": "Logout Button" }
                }
            ]
        },
        {
            view: "multiview",
            id: "mainView",
            cells: [
                { id: "loginView", view: "layout", rows: [LoginForm] },
                { id: "preferencesView", view: "layout", rows: [PreferencesForm] }
            ],
            responsive: true
        }
    ],
    on: {
        onAfterRender: function() {
            console.log('mainView exists:', !!webix.$$("mainView"));
            if (getToken() && !window.Cypress) {
                if (webix.$$("mainView")) {
                    webix.$$("mainView").setValue("preferencesView");
                    webix.$$("logoutBtn").show();
                }
            } else {
                webix.$$("mainView")?.setValue("loginView");
            }
        }
    }
};