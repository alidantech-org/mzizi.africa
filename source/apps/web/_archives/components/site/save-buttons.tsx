"use client";

import { useState } from "react";

import { Icon } from "#/_archives/components/brand/icon";
import { useLanguage } from "#/_archives/lib/site/i18n";
import {
  type SavedLeader,
  type SavedPlace,
  type SavedProject,
  useSaved,
} from "#/_archives/lib/site/saved";

function Heart({
  on,
  label,
  onClick,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
}) {
  const [pops, setPops] = useState(0);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={() => {
        setPops((n) => n + 1);
        onClick();
      }}
      className={`grid h-9 w-9 place-items-center rounded-full border transition ${
        on
          ? "border-clay bg-clay/15 text-clay"
          : "border-border-default text-content-muted hover:border-clay hover:text-clay"
      }`}
    >
      <span key={pops} className={pops > 0 ? "heart-pop" : ""} aria-hidden>
        <Icon name="heart" size={18} className={on ? "fill-current" : ""} />
      </span>
    </button>
  );
}

export function LikeLeader({ leader }: { leader: SavedLeader }) {
  const { t } = useLanguage();
  const saved = useSaved();
  return (
    <Heart
      on={saved.has("leader", leader.id)}
      label={t("likeLeader")}
      onClick={() => saved.toggleLeader(leader)}
    />
  );
}

export function LikeProject({ project }: { project: SavedProject }) {
  const { t } = useLanguage();
  const saved = useSaved();
  return (
    <Heart
      on={saved.has("project", project.id)}
      label={t("likeProject")}
      onClick={() => saved.toggleProject(project)}
    />
  );
}

export function SavePlace({ place }: { place: SavedPlace }) {
  const { t } = useLanguage();
  const saved = useSaved();
  const on = saved.has("place", place.id);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => saved.togglePlace(place)}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        on
          ? "border-clay bg-clay text-cream"
          : "border-border-default hover:border-clay"
      }`}
    >
      <span aria-hidden>{on ? "★" : "☆"}</span>
      {on ? t("savedPlace") : t("savePlace")}
    </button>
  );
}

export function SaveSpot({
  latitude,
  longitude,
  label,
  featureId,
}: {
  latitude: number;
  longitude: number;
  label: string;
  featureId: string | null;
}) {
  const { t } = useLanguage();
  const saved = useSaved();
  const id = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  const on = saved.spots.some((spot) => spot.id === id);
  return (
    <button
      type="button"
      onClick={() =>
        on
          ? saved.removeSpot(id)
          : saved.addSpot({ latitude, longitude, label, featureId })
      }
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        on
          ? "border-raffia bg-raffia/15 text-raffia"
          : "border-border-default hover:border-raffia"
      }`}
    >
      <span aria-hidden>◎</span>
      {on ? t("spotSaved") : t("saveSpot")}
    </button>
  );
}
