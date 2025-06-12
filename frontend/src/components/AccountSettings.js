import { getPreferences, updatePreferences } from '../api/preferences.js';

export const AccountSettings = {
    view: "form",
    id: "accountSettings",
    scroll: true,
    css: "preference-form",
    elementsConfig: {
        labelPosition: "top",
        labelWidth: 150
    },
    elements: [
        {
            view: "text",
            id: "accountUsername",
            label: "Username",
            name: "username",
            required: true,
            readonly: true,
            attributes: { "aria-required": true }
        },
        {
            view: "text",
            id: "accountEmail",
            label: "Email",
            name: "email",
            required: true,
            attributes: { "aria-required": true },
            on: {
                onChange: function(newValue) {
                    const inputNode = this.getInputNode();
                    if (!inputNode) return;
                    if (newValue === "") {
                        inputNode.style.border = "";
                        webix.message.hide("emailValidationMessage");
                        return;
                    }
                    if (webix.rules.isEmail(newValue)) {
                        inputNode.style.border = "1px solid green";
                        webix.message({
                            type: "success",
                            text: "Valid email format",
                            id: "emailValidationMessage",
                            expire: 1000
                        });
                    } else {
                        inputNode.style.border = "1px solid red";
                        webix.message({
                            type: "error",
                            text: "Invalid email format",
                            id: "emailValidationMessage",
                            expire: 1000
                        });
                    }
                }
            }
        },
        {
            view: "button",
            id: "changePasswordBtn",
            value: "Change Password",
            width: 150,
            click: function() {
                const passwordLayout = webix.$$("passwordFieldsLayout");
                if (passwordLayout) {
                    passwordLayout.show();
                    this.hide();
                    webix.$$("passwordRequirements").setHTML(getPasswordRequirementsHTML({}));
                }
            },
            attributes: {
                "aria-label": "Change Password",
                "data-cy": "change-password-btn"
            },
        },
        {
            id: "passwordFieldsLayout",
            hidden: true,
            rows: [
                {
                    view: "text",
                    id: "newPassword",
                    label: "New Password",
                    name: "newPassword",
                    type: "password",
                    required: true,
                    attributes: { "aria-required": true, "aria-label": "New Password" },
                    on: {
                        onChange: function(newValue) {
                            const inputNode = this.getInputNode();
                            const confirmInput = webix.$$("confirmPassword");
                            if (!inputNode || !confirmInput) return;

                            // Validate password requirements
                            const requirements = {
                                minLength: newValue.length >= 8,
                                uppercase: /[A-Z]/.test(newValue),
                                lowercase: /[a-z]/.test(newValue),
                                number: /\d/.test(newValue)
                            };
                            webix.$$("passwordRequirements").setHTML(getPasswordRequirementsHTML(requirements));

                            // Check password matching
                            const confirmPassword = confirmInput.getValue() || "";
                            if (newValue && confirmPassword && newValue !== confirmPassword) {
                                inputNode.style.border = "1px solid red";
                                webix.message({
                                    type: "error",
                                    text: "Passwords do not match",
                                    id: "passwordMatchMessage",
                                    expire: 1000
                                });
                            } else if (newValue && confirmPassword) {
                                inputNode.style.border = "1px solid green";
                                const confirmNode = confirmInput.getInputNode();
                                if (confirmNode) confirmNode.style.border = "1px solid green";
                                webix.message.hide("passwordMatchMessage");
                            } else {
                                inputNode.style.border = "";
                                const confirmNode = confirmInput.getInputNode();
                                if (confirmNode) confirmNode.style.border = "";
                            }
                        }
                    }
                },
                {
                    view: "template",
                    id: "passwordRequirements",
                    template: getPasswordRequirementsHTML({}),
                    height: 130,
                    css: "password-requirements"
                },
                {
                    view: "text",
                    id: "confirmPassword",
                    label: "Confirm Password",
                    name: "confirmPassword",
                    type: "password",
                    required: true,
                    attributes: { "aria-required": true, "aria-label": "Confirm Password" },
                    on: {
                        onChange: function(newValue) {
                            const inputNode = this.getInputNode();
                            const newPasswordInput = webix.$$("newPassword");
                            if (!inputNode || !newPasswordInput) return;
                            const newPassword = newPasswordInput.getValue() || "";
                            if (newValue && newPassword && newValue !== newPassword) {
                                inputNode.style.border = "1px solid red";
                                webix.message({
                                    type: "error",
                                    text: "Passwords do not match",
                                    id: "passwordMatchMessage",
                                    expire: 1000
                                });
                            } else if (newValue && newPassword) {
                                inputNode.style.border = "1px solid green";
                                const newPasswordNode = newPasswordInput.getInputNode();
                                if (newPasswordNode) newPasswordNode.style.border = "1px solid green";
                                webix.message.hide("passwordMatchMessage");
                            } else {
                                inputNode.style.border = "";
                                const newPasswordNode = newPasswordInput.getInputNode();
                                if (newPasswordNode) newPasswordNode.style.border = "";
                            }
                        }
                    }
                },
                {
                    view: "button",
                    id: "cancelPasswordBtn",
                    value: "Cancel",
                    width: 120,
                    click: function() {
                        const form = this.getFormView();
                        form.setValues({ newPassword: "", confirmPassword: "" }, true);
                        webix.$$("passwordFieldsLayout").hide();
                        webix.$$("changePasswordBtn").show();
                        const newPasswordNode = webix.$$("newPassword")?.getInputNode();
                        const confirmPasswordNode = webix.$$("confirmPassword")?.getInputNode();
                        if (newPasswordNode) newPasswordNode.style.border = "";
                        if (confirmPasswordNode) confirmPasswordNode.style.border = "";
                        webix.message.hide("passwordMatchMessage");
                    },
                    attributes: { "aria-label": "Cancel Password Change" }
                }
            ]
        },
        {
            margin: 20,
            id: "accountSettingsButtons",
            cols: [
                { gravity: 2 },
                {
                    view: "button",
                    id: "accountSaveBtn",
                    value: "Save",
                    css: "webix_primary",
                    width: 120,
                    click: function() {
                        const form = this.getFormView();
                        if (!form.validate()) {
                            webix.message({ type: "error", text: "Please fix form errors" });
                            return;
                        }

                        const values = form.getValues();
                        const updateData = { username: values.username, email: values.email };

                        if (webix.$$("passwordFieldsLayout").isVisible()) {
                            if (!values.newPassword || !values.confirmPassword) {
                                webix.message({ type: "error", text: "Both password fields are required" });
                                return;
                            }
                            if (values.newPassword !== values.confirmPassword) {
                                webix.message({ type: "error", text: "Passwords do not match" });
                                return;
                            }
                            if (values.newPassword.length < 8 || !/\d/.test(values.newPassword)) {
                                webix.message({ type: "error", text: "Password must be at least 8 characters and contain a digit" });
                                return;
                            }
                            updateData.password = values.newPassword;
                        }

                        updatePreferences(updateData).then(() => {
                            webix.message({ type: "success", text: "Account settings saved" });
                            if (webix.$$("passwordFieldsLayout").isVisible()) {
                                form.setValues({ newPassword: "", confirmPassword: "" }, true);
                                webix.$$("passwordFieldsLayout").hide();
                                webix.$$("changePasswordBtn").show();
                                const newPasswordNode = webix.$$("newPassword")?.getInputNode();
                                const confirmPasswordNode = webix.$$("confirmPassword")?.getInputNode();
                                if (newPasswordNode) newPasswordNode.style.border = "";
                                if (confirmPasswordNode) confirmPasswordNode.style.border = "";
                                webix.message.hide("passwordMatchMessage");
                            }
                        }).catch(err => {
                            const errorMsg = err.response?.data?.errors?.detail || err.message || "Failed to save settings";
                            webix.message({ type: "error", text: errorMsg });
                        });
                    },
                    attributes: { "aria-label": "Save Account Settings" }
                },
                {
                    view: "button",
                    id: "accountResetBtn",
                    value: "Reset",
                    width: 120,
                    click: function() {
                        getPreferences().then(data => {
                            const form = this.getFormView();
                            form.setValues({ ...data, newPassword: "", confirmPassword: "" }, true);
                            console.log('Form reset with data:', data);
                            const emailNode = webix.$$("accountEmail")?.getInputNode();
                            if (emailNode) emailNode.style.border = "";
                            webix.$$("passwordFieldsLayout").hide();
                            webix.$$("changePasswordBtn").show();
                            const newPasswordNode = webix.$$("newPassword")?.getInputNode();
                            const confirmPasswordNode = webix.$$("confirmPassword")?.getInputNode();
                            if (newPasswordNode) newPasswordNode.style.border = "";
                            if (confirmPasswordNode) confirmPasswordNode.style.border = "";
                            webix.message.hide("emailValidationMessage");
                            webix.message.hide("passwordMatchMessage");
                        }).catch(err => {
                            webix.message({ type: "error", text: err.message || "Failed to reset settings" });
                        });
                    },
                    attributes: { "aria-label": "Reset Account Settings" }
                },
                { gravity: 2 }
            ]
        }
    ],
    rules: {
        username: webix.rules.isNotEmpty,
        email: webix.rules.isEmail,
        $obj: function(data) {
            if (!webix.$$("passwordFieldsLayout") || !webix.$$("passwordFieldsLayout").isVisible()) {
                return true;
            }
            if (!data.newPassword || !data.confirmPassword) {
                return false;
            }
            if (data.newPassword !== data.confirmPassword) {
                return false;
            }
            return validatePassword(data.newPassword);
        }
    },
    on: {
        onViewShow: function() {
            getPreferences().then(data => {
                console.log('Populating AccountSettings with data:', data);
                this.setValues({ ...data, newPassword: "", confirmPassword: "" }, true);
                const emailNode = webix.$$("accountEmail")?.getInputNode();
                if (emailNode) emailNode.style.border = "";
                if (webix.$$("passwordFieldsLayout")) webix.$$("passwordFieldsLayout").hide();
                if (webix.$$("changePasswordBtn")) webix.$$("changePasswordBtn").show();
                const newPasswordNode = webix.$$("newPassword")?.getInputNode();
                const confirmPasswordNode = webix.$$("confirmPassword")?.getInputNode();
                if (newPasswordNode) newPasswordNode.style.border = "";
                if (confirmPasswordNode) confirmPasswordNode.style.border = "";
                webix.message.hide("emailValidationMessage");
                webix.message.hide("passwordMatchMessage");
            }).catch(err => {
                webix.message({ type: "error", text: err.message || "Failed to load account settings" });
            });
        },
        onAfterRender: function() {
            this.setValues({ newPassword: "", confirmPassword: "" }, true);
            if (webix.$$("passwordFieldsLayout")) webix.$$("passwordFieldsLayout").hide();
            if (webix.$$("changePasswordBtn")) webix.$$("changePasswordBtn").show();
        }
    }
};


// Helper function to validate password requirements
function validatePassword(password) {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password)
    );
}

// Helper function to generate password requirements HTML
function getPasswordRequirementsHTML(requirements) {
    const { minLength, uppercase, lowercase, number } = requirements;
    return `
        <div style="font-size: 12px; color: #666; margin-top: 5px;">
            <p>Password must include:</p>
            <ul style="list-style: none; padding-left: 0;">
                <li class="${minLength ? 'valid' : 'invalid'}">
                    ${minLength ? '✓' : '✗'} At least 8 characters
                </li>
                <li class="${uppercase ? 'valid' : 'invalid'}">
                    ${uppercase ? '✓' : '✗'} At least one uppercase letter
                </li>
                <li class="${lowercase ? 'valid' : 'invalid'}">
                    ${lowercase ? '✓' : '✗'} At least one lowercase letter
                </li>
                <li class="${number ? 'valid' : 'invalid'}">
                    ${number ? '✓' : '✗'} At least one number
                </li>
            </ul>
        </div>
        <style>
            .valid { color: green; }
            .invalid { color: red; }
        </style>
    `;
}

