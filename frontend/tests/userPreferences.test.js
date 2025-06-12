const { LoginForm } = require('../src/components/LoginForm');
const { AccountSettings, validatePassword, getPasswordRequirementsHTML } = require('../src/components/AccountSettings');
const { NotificationSettings } = require('../src/components/NotificationSettings');
const { ThemeSettings } = require('../src/components/ThemeSettings');
const { PrivacySettings } = require('../src/components/PrivacySettings');
const { getPreferences, updatePreferences } = require('../src/api/preferences');
const { login } = require('../src/api/auth');

jest.mock('../src/api/preferences');
jest.mock('../src/api/auth');

// Mock Webix globally
global.webix = {
    ui: jest.fn(),
    $$: jest.fn().mockImplementation((id) => ({
        id,
        setValue: jest.fn(),
        show: jest.fn(),
        hide: jest.fn(),
        getFormView: jest.fn().mockReturnValue({
            validate: jest.fn().mockReturnValue(true),
            getValues: jest.fn().mockReturnValue({}),
            setValues: jest.fn(),
            clear: jest.fn()
        }),
        getInputNode: jest.fn().mockReturnValue({ style: {} }),
        focus: jest.fn(),
        callEvent: jest.fn(),
        disable: jest.fn(),
        enable: jest.fn(),
        setHTML: jest.fn(),
        isVisible: jest.fn().mockReturnValue(false)
    })),
    rules: {
        isNotEmpty: jest.fn((value) => !!value),
        isEmail: jest.fn((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    },
    message: jest.fn().mockReturnValue({
        hide: jest.fn()
    }),
    ready: jest.fn().mockImplementation((callback) => callback())
};

describe('User Preferences App', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        global.webix.$$.mockClear();
    });

    describe('LoginForm', () => {
        test('should render LoginForm with username, password, and buttons', () => {
            expect(LoginForm.view).toBe('form');
            expect(LoginForm.id).toBe('login');
            expect(LoginForm.elements).toHaveLength(3);
            expect(LoginForm.elements[0].cols[1].id).toBe('usernameInput');
            expect(LoginForm.elements[1].cols[1].id).toBe('passwordInput');
            expect(LoginForm.elements[2].cols[1].id).toBe('loginBtn');
            expect(LoginForm.elements[2].cols[3].id).toBe('clearBtn');
        });

        test('should validate form inputs', () => {
            expect(LoginForm.rules.username).toBe(webix.rules.isNotEmpty);
            expect(LoginForm.rules.password).toBe(webix.rules.isNotEmpty);
        });

        test('should call login API on login button click', async () => {
            const mockForm = {
                validate: jest.fn().mockReturnValue(true),
                getValues: jest.fn().mockReturnValue({ username: 'testuser', password: 'testpass' })
            };
            webix.$$.mockReturnValue({
                getFormView: jest.fn().mockReturnValue(mockForm),
                disable: jest.fn(),
                enable: jest.fn(),
                callEvent: jest.fn()
            });
            login.mockResolvedValue({});

            const loginBtn = LoginForm.elements[2].cols[1];
            await loginBtn.on.onItemClick();

            expect(login).toHaveBeenCalledWith('testuser', 'testpass');
            expect(webix.message).toHaveBeenCalledWith({ type: 'success', text: 'Login successful!' });
            expect(webix.$$).toHaveBeenCalledWith('mainView');
            expect(webix.$$().setValue).toHaveBeenCalledWith('preferences');
        });

        test('should show error on invalid login', async () => {
            const mockForm = {
                validate: jest.fn().mockReturnValue(true),
                getValues: jest.fn().mockReturnValue({ username: 'testuser', password: 'wrong' })
            };
            webix.$$.mockReturnValue({
                getFormView: jest.fn().mockReturnValue(mockForm),
                disable: jest.fn(),
                enable: jest.fn()
            });
            login.mockRejectedValue({ detail: 'Invalid credentials' });

            const loginBtn = LoginForm.elements[2].cols[1];
            await loginBtn.on.onItemClick();

            expect(webix.message).toHaveBeenCalledWith({ type: 'error', text: 'Invalid credentials' });
        });
    });

    describe('AccountSettings', () => {
        test('should render AccountSettings form with fields and buttons', () => {
            expect(AccountSettings.view).toBe('form');
            expect(AccountSettings.id).toBe('accountSettings');
            expect(AccountSettings.elements).toHaveLength(5);
            expect(AccountSettings.elements[0].id).toBe('accountUsername');
            expect(AccountSettings.elements[1].id).toBe('accountEmail');
            expect(AccountSettings.elements[2].id).toBe('changePasswordBtn');
        });

        test('should validate email on change', () => {
            const emailInput = AccountSettings.elements[1];
            emailInput.on.onChange('test@example.com');
            expect(webix.rules.isEmail).toHaveBeenCalledWith('test@example.com');
            expect(webix.message).toHaveBeenCalledWith({
                type: 'success',
                text: 'Valid email format',
                id: 'emailValidationMessage',
                expire: 1000
            });

            emailInput.on.onChange('invalid-email');
            expect(webix.message).toHaveBeenCalledWith({
                type: 'error',
                text: 'Invalid email format',
                id: 'emailValidationMessage',
                expire: 1000
            });
        });

        test('should validate password requirements', () => {
            expect(validatePassword('Test123')).toBe(false); // Missing uppercase
            expect(validatePassword('Test1234')).toBe(true); // Meets all requirements
            expect(validatePassword('test1234')).toBe(false); // Missing uppercase
            expect(validatePassword('TEST1234')).toBe(false); // Missing lowercase
            expect(validatePassword('Testtest')).toBe(false); // Missing number
        });

        test('should save account settings', async () => {
            const mockForm = {
                validate: jest.fn().mockReturnValue(true),
                getValues: jest.fn().mockReturnValue({
                    username: 'testuser',
                    email: 'test@example.com',
                    newPassword: '',
                    confirmPassword: ''
                })
            };
            webix.$$.mockReturnValue({
                getFormView: jest.fn().mockReturnValue(mockForm),
                isVisible: jest.fn().mockReturnValue(false)
            });
            updatePreferences.mockResolvedValue({});

            const saveBtn = AccountSettings.elements[4].cols[1];
            await saveBtn.click();

            expect(updatePreferences).toHaveBeenCalledWith({
                username: 'testuser',
                email: 'test@example.com'
            });
            expect(webix.message).toHaveBeenCalledWith({ type: 'success', text: 'Account settings saved' });
        });
    });

    describe('NotificationSettings', () => {
        test('should render NotificationSettings form', () => {
            expect(NotificationSettings.view).toBe('form');
            expect(NotificationSettings.elements).toHaveLength(4);
            expect(NotificationSettings.elements[0].name).toBe('email_notifications');
            expect(NotificationSettings.elements[1].name).toBe('push_notifications');
            expect(NotificationSettings.elements[2].name).toBe('notification_frequency');
        });

        test('should save notification settings', async () => {
            const mockForm = {
                validate: jest.fn().mockReturnValue(true),
                getValues: jest.fn().mockReturnValue({
                    email_notifications: 1,
                    push_notifications: 0,
                    notification_frequency: 'daily'
                })
            };
            webix.$$.mockReturnValue({ getFormView: jest.fn().mockReturnValue(mockForm) });
            updatePreferences.mockResolvedValue({});

            await NotificationSettings.elements[3].cols[1].click();

            expect(updatePreferences).toHaveBeenCalledWith({
                email_notifications: 1,
                push_notifications: 0,
                notification_frequency: 'daily'
            });
            expect(webix.message).toHaveBeenCalledWith('Notification settings saved');
        });
    });

    describe('ThemeSettings', () => {
        test('should render ThemeSettings form', () => {
            expect(ThemeSettings.view).toBe('form');
            expect(ThemeSettings.elements).toHaveLength(4);
            expect(ThemeSettings.elements[0].name).toBe('primary_color');
            expect(ThemeSettings.elements[1].name).toBe('dark_mode');
            expect(ThemeSettings.elements[2].name).toBe('font_style');
        });

        test('should apply dark mode on save', async () => {
            const mockForm = {
                validate: jest.fn().mockReturnValue(true),
                getValues: jest.fn().mockReturnValue({
                    primary_color: '#0000FF',
                    dark_mode: 1,
                    font_style: 'arial'
                })
            };
            webix.$$.mockReturnValue({ getFormView: jest.fn().mockReturnValue(mockForm) });
            updatePreferences.mockResolvedValue({});

            await ThemeSettings.elements[3].cols[1].click();

            expect(document.body.classList.add).toHaveBeenCalledWith('dark-theme');
            expect(webix.message).toHaveBeenCalledWith('Theme settings saved');
        });
    });

    describe('PrivacySettings', () => {
        test('should render PrivacySettings form', () => {
            expect(PrivacySettings.view).toBe('form');
            expect(PrivacySettings.elements).toHaveLength(4);
            expect(PrivacySettings.elements[0].name).toBe('visibility');
            expect(PrivacySettings.elements[1].name).toBe('two_factor_auth');
            expect(PrivacySettings.elements[2].name).toBe('data_sharing');
        });

        test('should save privacy settings', async () => {
            const mockForm = {
                validate: jest.fn().mockReturnValue(true),
                getValues: jest.fn().mockReturnValue({
                    visibility: 1,
                    two_factor_auth: 0,
                    data_sharing: 1
                })
            };
            webix.$$.mockReturnValue({ getFormView: jest.fn().mockReturnValue(mockForm) });
            updatePreferences.mockResolvedValue({});

            await PrivacySettings.elements[3].cols[1].click();

            expect(updatePreferences).toHaveBeenCalledWith({
                visibility: 1,
                two_factor_auth: 0,
                data_sharing: 1
            });
            expect(webix.message).toHaveBeenCalledWith('Privacy settings saved');
        });
    });

    describe('getPasswordRequirementsHTML', () => {
        test('should generate password requirements HTML', () => {
            const requirements = {
                minLength: true,
                uppercase: false,
                lowercase: true,
                number: false
            };
            const html = getPasswordRequirementsHTML(requirements);
            expect(html).toContain('At least 8 characters');
            expect(html).toContain('class="valid"');
            expect(html).toContain('class="invalid"');
        });
    });
});