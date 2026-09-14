import type { ResultRow } from "../types";
import {
  IconAppWindow,
  IconCheck,
  IconChevronRight,
  IconCornerDownLeft,
  IconTerminal2,
  IconX,
} from "@tabler/icons-react";

interface ResultItemProps {
  row: ResultRow;
  selected: boolean;
  iconDataUri?: string;
  onHover: (e: React.MouseEvent) => void;
  onActivate: () => void;
}

function highlightMatchedChars(title: string, matchedIndices?: number[]) {
  if (!matchedIndices || matchedIndices.length === 0) return title;
  const matched = new Set(matchedIndices);
  return [...title].map((ch, i) =>
    matched.has(i) ? (
      <mark key={i} className="hl">
        {ch}
      </mark>
    ) : (
      <span key={i}>{ch}</span>
    ),
  );
}

function KillStatusGlyph({ status }: { status: NonNullable<ResultRow["status"]> }) {
  if (status === "terminated") return <IconCheck size={10} strokeWidth={3} />;
  if (status === "failed") return <IconX size={10} strokeWidth={3} />;
  return null;
}

function Media({ row, iconDataUri }: { row: ResultRow; iconDataUri?: string }) {
  if (iconDataUri) {
    return (
      <span className="result-media" data-media="icon">
        <img className="result-icon" src={iconDataUri} alt="" draggable={false} />
      </span>
    );
  }
  if (row.badge) {
    return (
      <span className="result-media" data-media="badge">
        {row.badge}
      </span>
    );
  }
  if (row.kind === "command") {
    return (
      <span className="result-media" data-media="glyph">
        <IconChevronRight size={16} strokeWidth={1.75} aria-hidden />
      </span>
    );
  }
  if (row.kind === "shell") {
    return (
      <span className="result-media" data-media="glyph">
        <IconTerminal2 size={16} strokeWidth={1.75} aria-hidden />
      </span>
    );
  }
  const monogram = [...row.title.trim()][0];
  return (
    <span className="result-media" data-media={monogram ? "monogram" : "glyph"}>
      {monogram ? (
        monogram.toUpperCase()
      ) : (
        <IconAppWindow size={16} strokeWidth={1.75} aria-hidden />
      )}
    </span>
  );
}

export default function ResultItem({
  row,
  selected,
  iconDataUri,
  onHover,
  onActivate,
}: ResultItemProps) {
  return (
    <button
      className={`result-item ${selected ? "selected" : ""}`}
      data-kind={row.kind}
      data-status={row.status ?? ""}
      onMouseMove={onHover}
      onClick={onActivate}
    >
      <Media row={row} iconDataUri={iconDataUri} />
      <span className="result-text">
        <span className="result-title">
          {highlightMatchedChars(row.title, row.matchIndicesInTitle)}
        </span>
        {row.subtitle && <span className="result-subtitle">{row.subtitle}</span>}
      </span>
      <span className="result-enter">
        {row.status ? (
          <span className="kill-orb" data-status={row.status} aria-hidden>
            <KillStatusGlyph status={row.status} />
          </span>
        ) : selected && row.onKill ? (
          <span className="kill-hint">
            <kbd>⇧⌫</kbd>
          </span>
        ) : selected ? (
          <IconCornerDownLeft size={15} strokeWidth={1.75} aria-hidden />
        ) : null}
      </span>
    </button>
  );
}
