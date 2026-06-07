import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

export default class AxioraPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings('com.axiora.shell');

        const page = new Adw.PreferencesPage({
            title: _('Axiora OS Settings'),
            icon_name: 'preferences-system-symbolic',
        });

        // ── Accent Color ──────────────────────────────────────────
        const appearanceGroup = new Adw.PreferencesGroup({ title: _('Appearance') });

        const colorRow = new Adw.ComboRow({
            title: _('Accent Color'),
            subtitle: _('Choose the accent color used across the Axiora desktop'),
        });

        const colorModel = new Gtk.StringList();
        const COLORS = [
            { key: 'axiora-blue',   label: 'Axiora Blue (Default)' },
            { key: 'axiora-purple', label: 'Axiora Purple' },
            { key: 'emerald-green', label: 'Emerald Green' },
            { key: 'sunset-orange', label: 'Sunset Orange' },
            { key: 'crimson-red',   label: 'Crimson Red' },
        ];
        COLORS.forEach(c => colorModel.append(c.label));
        colorRow.set_model(colorModel);

        // Sync initial value
        const currentKey = settings.get_string('accent-color');
        const currentIndex = COLORS.findIndex(c => c.key === currentKey);
        colorRow.set_selected(currentIndex >= 0 ? currentIndex : 0);

        colorRow.connect('notify::selected', () => {
            const selected = colorRow.get_selected();
            settings.set_string('accent-color', COLORS[selected].key);
        });
        appearanceGroup.add(colorRow);

        // ── Focus Mode ────────────────────────────────────────────
        const focusGroup = new Adw.PreferencesGroup({ title: _('Focus Mode') });

        const focusRow = new Adw.SwitchRow({
            title: _('Enable Focus Mode on Startup'),
            subtitle: _('Automatically suppress notifications when you log in'),
        });
        settings.bind('focus-mode-on-startup', focusRow, 'active', 0);
        focusGroup.add(focusRow);

        page.add(appearanceGroup);
        page.add(focusGroup);
        window.add(page);
    }
}
