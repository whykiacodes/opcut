import {
  IconArrowBigUp,
  IconBackspace,
  IconCommand,
  IconCornerDownLeft,
  IconOption,
} from "@tabler/icons-react";

const KEY_GLYPH_SIZE = 12;
const KEY_GLYPH_STROKE = 2;

interface GlyphProps {
  size?: number;
}

function glyphProps(size = KEY_GLYPH_SIZE) {
  return { size, strokeWidth: KEY_GLYPH_STROKE, "aria-hidden": true } as const;
}

export function ShiftBackspaceGlyphs({ size }: GlyphProps) {
  return (
    <span className="key-glyphs">
      <IconArrowBigUp {...glyphProps(size)} />
      <IconBackspace {...glyphProps(size)} />
    </span>
  );
}

export function CommandBackspaceGlyphs({ size }: GlyphProps) {
  return (
    <span className="key-glyphs">
      <IconCommand {...glyphProps(size)} />
      <IconBackspace {...glyphProps(size)} />
    </span>
  );
}

export function EnterGlyph({ size }: GlyphProps) {
  return <IconCornerDownLeft {...glyphProps(size)} />;
}

export function OptionGlyph({ size }: GlyphProps) {
  return <IconOption {...glyphProps(size)} />;
}
