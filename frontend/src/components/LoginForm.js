import { login } from '../api/auth.js';

function navigateForm(currentElementId, keyCode) {
    const focusOrder = ["usernameInput", "passwordInput", "loginBtn", "clearBtn"];
    const currentIndex = focusOrder.indexOf(currentElementId);
    let nextIndex;

    if (keyCode === 38) { // Up arrow
        nextIndex = (currentIndex - 1 + focusOrder.length) % focusOrder.length;
    } else if (keyCode === 40) { // Down arrow
        nextIndex = (currentIndex + 1) % focusOrder.length;
    } else {
        return;
    }

    const nextElement = webix.$$(focusOrder[nextIndex]);
    if (nextElement) {
        nextElement.focus();
    }
}

export const LoginForm = {
    id: "login",
    view: "form",
    maxWidth: 400,
    margin: 20,
    elementsConfig: { labelWidth: 100, labelAlign: "left" },
    elements: [
        {
            cols: [
                { view: "spacer" },
                {
                    view: "text",
                    id: "usernameInput",
                    label: "Username",
                    name: "username",
                    required: true,
                    width: 300,
                    on: {
                        onKeyPress: function(code) {
                            if (code === 38 || code === 40) {
                                navigateForm("usernameInput", code);
                            }
                        }
                    }
                },
                { view: "spacer" }
            ]
        },
        {
            cols: [
                { view: "spacer" },
                {
                    view: "text",
                    id: "passwordInput",
                    label: "Password",
                    name: "password",
                    type: "password",
                    required: true,
                    width: 300,
                    on: {
                        onKeyPress: function(code) {
                            if (code === 38 || code === 40) {
                                navigateForm("passwordInput", code);
                            }
                        }
                    }
                },
                { view: "spacer" }
            ]
        },
        {
            cols: [
                { view: "spacer" },
                {
                    view: "button",
                    id: "loginBtn",
                    value: "Login",
                    width: 80,
                    click: function() {
                        const form = this.getFormView();
                        if (!form.validate()) return;
                        this.disable();
                        webix.message({ type: "info", text: "Logging in..." });
                        const values = form.getValues();
                        login(values.username, values.password)
                            .then(() => {
                                webix.message({ type: "success", text: "Login successful!" });
                                if (webix.$$("mainView")) {
                                    webix.$$("mainView").setValue("preferencesView");
                                    webix.$$("logoutBtn").show();
                                } else {
                                    console.error("mainView not found during login");
                                    webix.message({ type: "error", text: "Navigation failed" });
                                }
                            })
                            .catch(err => {
                                webix.message({ type: "error", text: err.detail || "Invalid username or password" });
                            })
                            .finally(() => {
                                this.enable();
                                webix.message.hide();
                            });
                    },
                    on: {
                        onKeyPress: function(code) {
                            if (code === 38 || code === 40) {
                                navigateForm("loginBtn", code);
                            }
                        }
                    }
                },
                { width: 10 },
                {
                    view: "button",
                    id: "clearBtn",
                    value: "Clear",
                    width: 80,
                    click: function() {
                        this.getFormView().clear();
                    },
                    on: {
                        onKeyPress: function(code) {
                            if (code === 38 || code === 40) {
                                navigateForm("clearBtn", code);
                            } else if (code === 13) {
                                webix.$$("loginBtn").callEvent("onItemClick");
                            }
                        }
                    }
                },
                { view: "spacer" }
            ]
        }
    ],
    rules: {
        username: webix.rules.isNotEmpty,
        password: webix.rules.isNotEmpty
    }
};
