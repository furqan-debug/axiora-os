import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Accent color definitions matching the React shell
const ACCENT_COLORS = {
    'axiora-blue':   '#007AFF',
    'axiora-purple': '#AF52DE',
    'emerald-green': '#34C759',
    'sunset-orange': '#FF9500',
    'crimson-red':   '#FF3B30',
};

export default class AxioraShellExtension extends Extension {
    _settings = null;
    _accentColorChangeId = null;

    enable() {
        this._settings = this.getSettings('com.axiora.shell');

        // Watch for accent color changes from the settings schema
        this._accentColorChangeId = this._settings.connect(
            'changed::accent-color',
            this._onAccentColorChanged.bind(this)
        );

        // Apply the current accent on load
        this._applyAccentColor(this._settings.get_string('accent-color'));

        // Register a DBus service to expose settings to the Tauri shell
        this._dbusId = Gio.DBus.session.own_name(
            'com.axiora.Settings',
            Gio.BusNameOwnerFlags.NONE,
            null, null
        );

        console.log('[Axiora Shell Extension] Enabled.');
    }

    disable() {
        if (this._accentColorChangeId) {
            this._settings.disconnect(this._accentColorChangeId);
            this._accentColorChangeId = null;
        }
        if (this._dbusId) {
            Gio.DBus.session.unown_name(this._dbusId);
        }
        this._settings = null;
        console.log('[Axiora Shell Extension] Disabled.');
    }

    _onAccentColorChanged(settings, key) {
        const color = settings.get_string(key);
        this._applyAccentColor(color);
    }

    _applyAccentColor(colorKey) {
        const hex = ACCENT_COLORS[colorKey] ?? ACCENT_COLORS['axiora-blue'];
        // Write the accent color to a known file that axiora-shell (React) will read
        const statePath = GLib.build_filenamev([
            GLib.get_user_config_dir(), 'axiora', 'accent-color'
        ]);
        try {
            GLib.file_set_contents(statePath, hex);
            console.log(`[Axiora Shell Extension] Accent color set to ${hex}`);
        } catch (e) {
            console.error('[Axiora Shell Extension] Failed to write accent color:', e);
        }
    }
}
