import { AccountSettings } from './AccountSettings.js';
import { NotificationSettings } from './NotificationSettings.js';
import { ThemeSettings } from './ThemeSettings.js';
import { PrivacySettings } from './PrivacySettings.js';
import { getPreferences } from '../api/preferences.js';

export const PreferencesForm = {
    id: "preferences",
    view: "tabview",
    responsive: true,
    tabbar: {id: "preferencesTabbar",},
    cells: [
        {
            id: "accountTab",
            header: "Account Settings",
            body: AccountSettings
        },
        {
            id: "notificationTab",
            header: "Notification Settings",
            body: NotificationSettings
        },
        {
            id: "themeTab",
            header: "Theme Settings",
            body: ThemeSettings
        },
        {
            id: "privacyTab",
            header: "Privacy Settings",
            body: PrivacySettings
        }
    ],
    attributes: { "aria-label": "User Preferences Tabs" },
    on: {
        onAfterRender: function() {
            getPreferences()
                .then(data => {
                    webix.$$("accountSettings")?.setValues(data, true);
                    webix.$$("notificationSettings")?.setValues(data, true);
                    webix.$$("themeSettings")?.setValues(data, true);
                    webix.$$("privacySettings")?.setValues(data, true);
                })
                .catch(err => webix.message({ type: "error", text: err.message || "Failed to load preferences" }));
        }
    }
};