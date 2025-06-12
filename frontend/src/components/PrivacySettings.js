import { getPreferences, updatePreferences } from '../api/preferences.js';

export const PrivacySettings = {
    id: "privacySettings",
    view: "form",
    scroll: true,
    css: "preference-form",
    elementsConfig: {
        labelPosition: "top",
        labelWidth: 150
    },
    elements: [
        {
            view: "checkbox",
            name: "visibility",
            id: "visibility",
            label: "Profile Visibility",
            attributes: { "aria-label": "Enable Profile Visibility" }
        },
        {
            view: "checkbox",
            id: "two_factor_auth",
            name: "two_factor_auth",
            label: "Two-Factor Authentication",
            attributes: { "aria-label": "Enable Two-Factor Authentication" }
        },
        {
            view: "checkbox",
            id: "data_sharing",
            name: "data_sharing",
            label: "Data Sharing",
            attributes: { "aria-label": "Enable Data Sharing" }
        },
        {
            margin: 20,
            cols: [
                { gravity: 2 },
                {
                    view: "button",
                    value: "Save",
                    id: "save_privacy_button",
                    css: "webix_primary",
                    width: 120,
                    click: savePrivacy
                },
                {
                    view: "button",
                    value: "Reset",
                    width: 120,
                    click: resetPrivacy
                },
                { gravity: 2 }
            ]
        }
    ],
    on: {
        onViewShow: function() {
            getPreferences()
                .then(data => this.setValues(data))
                .catch(err => webix.message(err.message));
        }
    }
};

function savePrivacy() {
    const form = this.getFormView();
    if (!form.validate()) return;

    updatePreferences(form.getValues())
        .then(() => webix.message("Privacy settings saved"))
        .catch(err => webix.message(err.message));
}

function resetPrivacy() {
    getPreferences()
        .then(data => this.getFormView().setValues(data))
        .catch(err => webix.message(err.message));
}