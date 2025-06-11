import { getPreferences, updatePreferences } from '../api/preferences.js';

export const ThemeSettings = {
    view: "form",
    scroll: true,
    css: "preference-form",
    elementsConfig: {
        labelPosition: "top",
        labelWidth: 150
    },
    elements: [
        {
            view: "colorpicker",
            name: "primary_color",
            label: "Primary Color",
            attributes: { "aria-label": "Select Primary Color" }
        },
        {
            view: "checkbox",
            name: "dark_mode",
            label: "Dark Mode",
            attributes: { "aria-label": "Enable Dark Mode" }
        },
        {
            view: "select",
            name: "font_style",
            label: "Font Style",
            options: [
                { id: "arial", value: "Arial" },
                { id: "times", value: "Times New Roman" },
                { id: "verdana", value: "Verdana" }
            ],
            attributes: { "aria-label": "Select Font Style" }
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
                    click: saveTheme
                },
                {
                    view: "button",
                    value: "Reset",
                    width: 120,
                    click: resetTheme
                },
                { gravity: 2 }
            ]
        }
    ],
    rules: {
        primary_color: webix.rules.isNotEmpty,
        font_style: webix.rules.isNotEmpty
    },
    on: {
        onViewShow: function() {
            getPreferences()
                .then(data => this.setValues(data))
                .catch(err => webix.message(err.message));
        }
    }
};

function saveTheme() {
    const form = this.getFormView();
    if (!form.validate()) return;

    updatePreferences(form.getValues())
        .then(() => {
            webix.message("Theme settings saved");
            // Apply theme changes immediately
            if (form.getValues().dark_mode) {
                document.body.classList.add("dark-theme");
            } else {
                document.body.classList.remove("dark-theme");
            }
        })
        .catch(err => webix.message(err.message));
}

function resetTheme() {
    getPreferences()
        .then(data => this.getFormView().setValues(data))
        .catch(err => webix.message(err.message));
}