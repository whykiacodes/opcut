import { forwardRef } from "react";
import { IconDots, IconSearch } from "@tabler/icons-react";
import type { PrefixedMode } from "../lib/modePrefix";
import ModeGlyph from "./ModeGlyph";

const MODE_TOKEN_GLYPH_SIZE = 18;

const MODE_PLACEHOLDERS: Record<PrefixedMode, string> = {
  "running-apps": "Search open apps",
  "command-menu": "Search commands",
  shell: "Enter a shell command",
};

const MODE_TITLES: Record<PrefixedMode, string> = {
  "running-apps": "Open apps",
  "command-menu": "Commands",
  shell: "Shell",
};

function placeholderFor(mode: PrefixedMode | null, cyclingRunningApps: boolean) {
  if (cyclingRunningApps) return "to search open apps";
  if (mode) return MODE_PLACEHOLDERS[mode];
  return "Search apps or enter a command";
}

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  mode: PrefixedMode | null;
  cyclingRunningApps: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, onKeyDown, mode, cyclingRunningApps, menuOpen, onToggleMenu }, ref) => {
    const shellActive = mode === "shell";
    return (
      <div className="search-bar" data-shell={shellActive ? "true" : "false"}>
        <span className="search-glyph" aria-hidden={!mode}>
          {mode ? (
            <kbd
              className="mode-token"
              data-hint={cyclingRunningApps}
              title={cyclingRunningApps ? "Press / to search" : MODE_TITLES[mode]}
            >
              <ModeGlyph mode={mode} size={MODE_TOKEN_GLYPH_SIZE} />
            </kbd>
          ) : (
            <IconSearch size={18} strokeWidth={1.75} aria-hidden />
          )}
        </span>
        <input
          ref={ref}
          className="search-input"
          type="text"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label={shellActive ? "Shell command" : "Search apps or commands"}
          placeholder={placeholderFor(mode, cyclingRunningApps)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          className="settings-btn"
          title="Modes"
          aria-label="Choose a mode"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          data-open={menuOpen}
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggleMenu}
        >
          <IconDots size={16} strokeWidth={2} aria-hidden />
        </button>
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
export default SearchBar;
