import { useEffect } from "react";
import type { AppConfig, AppInfo } from "../types";
import { setSlotConfig } from "../lib/tauri";
import AppPicker from "./AppPicker";
import { OptionGlyph } from "./KeyGlyphs";
import SlotGrid from "./SlotGrid";

interface SettingsViewProps {
  apps: AppInfo[];
  slots: (AppConfig | null)[];
  onSlotsChange: (slots: (AppConfig | null)[]) => void;
  pickerSlot: number | null;
  onPickerSlotChange: (slot: number | null) => void;
  iconsByBundlePath: Record<string, string>;
  requestIcons: (paths: string[]) => void;
  onClose: () => void;
}

export default function SettingsView({
  apps,
  slots,
  onSlotsChange,
  pickerSlot,
  onPickerSlotChange,
  iconsByBundlePath,
  requestIcons,
  onClose,
}: SettingsViewProps) {
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      const appPickerOwnsTheKeyboard = pickerSlot !== null;
      if (appPickerOwnsTheKeyboard) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [pickerSlot, onClose]);

  const assignSelectedApp = async (app: AppInfo | null) => {
    if (pickerSlot === null) return;
    const config: AppConfig | null = app ? { name: app.name, path: app.path } : null;
    const updated = await setSlotConfig(pickerSlot, config);
    onSlotsChange(updated.slots);
    onPickerSlotChange(null);
  };

  return (
    <div className="settings-view">
      <div className="settings-header">
        <div className="settings-heading">
          <h1 className="settings-title">Quick slots</h1>
          <span className="settings-hint">
            Choose a slot to assign an app. Launch with <OptionGlyph /> and its number.
          </span>
        </div>
        <button
          className="settings-done"
          onClick={onClose}
          aria-label="Close settings"
          title="Close (esc)"
        >
          Done
        </button>
      </div>
      <SlotGrid
        slots={slots}
        iconsByBundlePath={iconsByBundlePath}
        onSlotClick={onPickerSlotChange}
      />
      {pickerSlot !== null && (
        <AppPicker
          key={pickerSlot}
          apps={apps}
          slotIndex={pickerSlot}
          iconsByBundlePath={iconsByBundlePath}
          requestIcons={requestIcons}
          onSelect={assignSelectedApp}
          onClose={() => onPickerSlotChange(null)}
        />
      )}
    </div>
  );
}
