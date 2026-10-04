import { useState, useEffect, useRef } from "react";
import type { AppInfo } from "../types";
import { joinIconPaths, splitIconPaths } from "../lib/iconPaths";
import { IconAppWindow, IconX } from "@tabler/icons-react";
import { CommandBackspaceGlyphs } from "./KeyGlyphs";

interface AppPickerProps {
  apps: AppInfo[];
  slotIndex: number;
  iconsByBundlePath: Record<string, string>;
  requestIcons: (paths: string[]) => void;
  onSelect: (app: AppInfo | null) => void;
  onClose: () => void;
}

const ROWS_PRELOADED_BEYOND_VIEWPORT = 24;

export default function AppPicker({
  apps,
  slotIndex,
  iconsByBundlePath,
  requestIcons,
  onSelect,
  onClose,
}: AppPickerProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocusedControl = document.activeElement;
    inputRef.current?.focus();
    return () => {
      if (previouslyFocusedControl instanceof HTMLElement && previouslyFocusedControl.isConnected) {
        previouslyFocusedControl.focus();
      }
    };
  }, []);

  const matchingApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedIndex = Math.min(selected, Math.max(matchingApps.length - 1, 0));

  useEffect(() => {
    listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, search]);

  const iconPathsToLoad = joinIconPaths(
    matchingApps.slice(0, ROWS_PRELOADED_BEYOND_VIEWPORT).map((app) => app.path),
  );
  useEffect(() => {
    if (iconPathsToLoad) requestIcons(splitIconPaths(iconPathsToLoad));
  }, [iconPathsToLoad, requestIcons]);

  return (
    <div className="app-picker-overlay" onClick={onClose}>
      <div
        className="app-picker"
        ref={pickerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-picker-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          } else if (e.key === "Tab") {
            const controls = pickerRef.current?.querySelectorAll<HTMLElement>('button:not([tabindex="-1"]), input');
            if (!controls?.length) return;
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="app-picker-header">
          <span id="app-picker-title">Choose an app for slot {slotIndex + 1}</span>
          <button className="app-picker-close" aria-label="Close app picker" onClick={onClose}>
            <IconX size={14} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
        <input
          ref={inputRef}
          className="app-picker-search"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls="app-picker-list"
          aria-activedescendant={matchingApps.length > 0 ? `app-picker-option-${selectedIndex}` : undefined}
          aria-label="Search apps"
          placeholder="Search apps"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelected(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelected(Math.max(0, Math.min(selectedIndex + 1, matchingApps.length - 1)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelected(Math.max(selectedIndex - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (matchingApps[selectedIndex]) onSelect(matchingApps[selectedIndex]);
            } else if (e.key === "Backspace" && e.metaKey) {
              e.preventDefault();
              onSelect(null);
            }
          }}
        />
        <div className="app-picker-list" id="app-picker-list" role="listbox" aria-label="Apps" ref={listRef}>
          {matchingApps.map((app, index) => (
            <button
              key={app.path}
              id={`app-picker-option-${index}`}
              className="app-picker-item"
              role="option"
              aria-selected={index === selectedIndex}
              tabIndex={-1}
              data-selected={index === selectedIndex}
              onClick={() => onSelect(app)}
            >
              <span className="app-picker-media">
                {iconsByBundlePath[app.path] ? (
                  <img
                    className="app-picker-icon"
                    src={iconsByBundlePath[app.path]}
                    alt=""
                    draggable={false}
                  />
                ) : (
                  <IconAppWindow size={14} strokeWidth={1.75} aria-hidden />
                )}
              </span>
              <span className="app-picker-name">{app.name}</span>
            </button>
          ))}
          {matchingApps.length === 0 && (
            <div className="app-picker-empty">No apps found</div>
          )}
        </div>
        <div className="app-picker-hint app-picker-shortcut">
          <CommandBackspaceGlyphs /> Clear slot
        </div>
      </div>
    </div>
  );
}
