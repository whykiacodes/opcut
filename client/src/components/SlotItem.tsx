import type { AppConfig } from "../types";
import { IconAppWindow } from "@tabler/icons-react";

interface SlotItemProps {
  index: number;
  app: AppConfig | null;
  iconDataUri?: string;
  onClick: () => void;
}

export default function SlotItem({ index, app, iconDataUri, onClick }: SlotItemProps) {
  return (
    <button
      className={`slot-item ${app ? "assigned" : "empty"}`}
      aria-label={`Slot ${index + 1}: ${app ? app.name : "Choose an app"}`}
      onClick={onClick}
    >
      <span className="slot-number">{index + 1}</span>
      <span className="slot-media">
        {iconDataUri ? (
          <img className="slot-icon" src={iconDataUri} alt="" draggable={false} />
        ) : (
          <IconAppWindow size={14} strokeWidth={1.75} aria-hidden />
        )}
      </span>
      <span className="slot-app-name">{app ? app.name : "Choose an app"}</span>
    </button>
  );
}
