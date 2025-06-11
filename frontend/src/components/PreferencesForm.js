import { AccountSettings } from './AccountSettings.js';
import { NotificationSettings } from './NotificationSettings.js';
import { ThemeSettings } from './ThemeSettings.js';
import { PrivacySettings } from './PrivacySettings.js';

export const PreferencesForm = {
    id: "preferences",
    view: "tabview",
    responsive: true,
    //height: '100%',
    tabbar: { id: "preferencesTabbar" },
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
    attributes: { "aria-label": "User Preferences Tabs" }
};