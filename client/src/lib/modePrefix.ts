import type { ParsedQuery } from "../types";

export type PrefixedMode = Extract<ParsedQuery["kind"], "running-apps" | "command-menu" | "shell">;

export const MODE_QUERIES: Record<PrefixedMode, string> = {
  "running-apps": "/ ",
  "command-menu": "> ",
  shell: "! ",
};

const MODE_PREFIX_PATTERN = /^\s*[/>!] ?/;

export function prefixedMode(kind: ParsedQuery["kind"]): PrefixedMode | null {
  return kind in MODE_QUERIES ? (kind as PrefixedMode) : null;
}

export function stripModePrefix(query: string) {
  return query.replace(MODE_PREFIX_PATTERN, "");
}
