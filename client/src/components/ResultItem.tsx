import type { ResultRow } from "../types";
import {
  IconAppWindow,
  IconCheck,
  IconChevronRight,
  IconTerminal2,
  IconX,
} from "@tabler/icons-react";
import { EnterGlyph, ShiftBackspaceGlyphs } from "./KeyGlyphs";

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

function QuitAction({ title, selected, onKill }: { title: string; selected: boolean; onKill: () => void }) {
  return (
    <button
      className="row-action row-action-quit"
      aria-label={`Quit ${title}`}
      aria-hidden={!selected}
      tabIndex={selected ? 0 : -1}
      disabled={!selected}
      title="Ask the app to quit, like Command-Q"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.stopPropagation();
        onKill();
      }}
    >
      <ShiftBackspaceGlyphs />
      Quit
    </button>
  );
}

function SelectedRowActions({ row }: { row: ResultRow }) {
  if (!row.actionLabel) return null;
  return (
    <>
      <span className="row-action">
        <EnterGlyph />
        {row.actionLabel}
      </span>
    </>
  );
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
    <div
      className={`result-item ${selected ? "selected" : ""}`}
      data-kind={row.kind}
      data-status={row.status ?? ""}
      onMouseMove={onHover}
    >
      <button className="result-main" onClick={onActivate}>
        <Media row={row} iconDataUri={iconDataUri} />
        <span className="result-text">
          <span className="result-title" aria-live={row.status ? "polite" : undefined}>
            {highlightMatchedChars(row.title, row.matchIndicesInTitle)}
          </span>
          {row.subtitle && <span className="result-subtitle">{row.subtitle}</span>}
        </span>
        <span className="result-actions">
          {row.status ? (
            <span className="kill-orb" data-status={row.status} aria-hidden>
              <KillStatusGlyph status={row.status} />
            </span>
          ) : selected ? (
            <SelectedRowActions row={row} />
          ) : null}
        </span>
      </button>
      {row.onKill && <QuitAction title={row.title} selected={selected} onKill={row.onKill} />}
    </div>
  );
}
