import { IconChevronRight, IconExclamationMark, IconSlash } from "@tabler/icons-react";
import type { PrefixedMode } from "../lib/modePrefix";

const MODE_ICONS = {
  "running-apps": IconSlash,
  "command-menu": IconChevronRight,
  shell: IconExclamationMark,
};

interface ModeGlyphProps {
  mode: PrefixedMode;
  size: number;
}

export default function ModeGlyph({ mode, size }: ModeGlyphProps) {
  const Icon = MODE_ICONS[mode];
  return <Icon size={size} strokeWidth={2} aria-hidden />;
}
