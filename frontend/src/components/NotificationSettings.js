import { getPreferences, updatePreferences } from '../api/preferences.js';

export const NotificationSettings = {
    id: "notificationSettings",
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
            id: "email_notifications",
            name: "email_notifications",
            label: "Email Notifications",
            inputName: "email_notifications",
            attributes: { "aria-label": "Enable Email Notifications" }
        },
        {
            view: "checkbox",
            id: "push_notifications",
            name: "push_notifications",
            label: "Push Notifications",
            inputName: "push_notifications",
            attributes: { "aria-label": "Enable Push Notifications" }
        },
        {
            view: "select",
            id: "notification_frequency",
            name: "notification_frequency",
            label: "Notification Frequency",
            options: [
                { id: "daily", value: "Daily" },
                { id: "weekly", value: "Weekly" },
                { id: "monthly", value: "Monthly" }
            ],
            attributes: { "aria-label": "Notification Frequency" }
        },
        {
            margin: 20,
            cols: [
                { gravity: 2 },
                {
                    view: "button",
                    value: "Save",
                    css: "webix_primary",
                    width: 120,
                    click: saveNotification
                },
                {
                    view: "button",
                    value: "Reset",
                    width: 120,
                    click: resetNotification
                },
                { gravity: 2 }
            ]
        }
    ],
    rules: {
        notification_frequency: webix.rules.isNotEmpty
    },
    on: {
        onViewShow: function() {
            getPreferences()
                .then(data => this.setValues(data))
                .catch(err => webix.message(err.message));
        }
    }
};

function saveNotification() {
    const form = this.getFormView();
    if (!form.validate()) return;

    updatePreferences(form.getValues())
        .then(() => webix.message("Notification settings saved"))
        .catch(err => webix.message(err.message));
}

function resetNotification() {
    getPreferences()
        .then(data => this.getFormView().setValues(data))
        .catch(err => webix.message(err.message));
}