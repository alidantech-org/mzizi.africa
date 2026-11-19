"use client";

/**
 * What a visitor keeps: places they saved, leaders and projects they like, and spots they saved from their GPS
 * position. It lives on the device (localStorage), needs no account and never leaves the browser; likes are therefore
 * personal, not public counts. Hand-written.
 */
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface SavedPlace {
  readonly id: string;
  /** Clean address of the place, kept so links never need the id. */
  readonly path?: string | null;
  readonly name: string;
  readonly kind: string;
}
export interface SavedLeader {
  readonly id: string;
  readonly name: string;
  readonly office: string;
  readonly unitId: string | null;
}
export interface SavedProject {
  readonly id: string;
  readonly title: string;
}
export interface SavedSpot {
  readonly id: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly label: string;
  readonly featureId: string | null;
}

interface Store {
  readonly places: readonly SavedPlace[];
  readonly leaders: readonly SavedLeader[];
  readonly projects: readonly SavedProject[];
  readonly spots: readonly SavedSpot[];
}

const EMPTY: Store = { places: [], leaders: [], projects: [], spots: [] };
const KEY = "mzizi.saved.v1";

interface SavedState extends Store {
  readonly count: number;
  has: (kind: "place" | "leader" | "project", id: string) => boolean;
  togglePlace: (place: SavedPlace) => void;
  toggleLeader: (leader: SavedLeader) => void;
  toggleProject: (project: SavedProject) => void;
  addSpot: (spot: Omit<SavedSpot, "id">) => void;
  removeSpot: (id: string) => void;
}

const SavedContext = createContext<SavedState | null>(null);

const flip = <T extends { readonly id: string }>(list: readonly T[], item: T): readonly T[] =>
  list.some((entry) => entry.id === item.id)
    ? list.filter((entry) => entry.id !== item.id)
    : [item, ...list];

export function SavedProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(EMPTY);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw !== null) setStore({ ...EMPTY, ...(JSON.parse(raw) as Partial<Store>) });
    } catch {
      // Storage can be blocked or hold something else; start empty.
    }
  }, []);
  const write = useCallback((update: (current: Store) => Store) => {
    setStore((current) => {
      const next = update(current);
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // The choice still holds for this visit.
      }
      return next;
    });
  }, []);
  const value = useMemo<SavedState>(
    () => ({
      ...store,
      count:
        store.places.length + store.leaders.length + store.projects.length + store.spots.length,
      has: (kind, id) =>
        (kind === "place" ? store.places : kind === "leader" ? store.leaders : store.projects).some(
          (entry) => entry.id === id,
        ),
      togglePlace: (place) => write((s) => ({ ...s, places: flip(s.places, place) })),
      toggleLeader: (leader) => write((s) => ({ ...s, leaders: flip(s.leaders, leader) })),
      toggleProject: (project) => write((s) => ({ ...s, projects: flip(s.projects, project) })),
      addSpot: (spot) =>
        write((s) => ({
          ...s,
          spots: [
            { ...spot, id: `${spot.latitude.toFixed(4)},${spot.longitude.toFixed(4)}` },
            ...s.spots.filter(
              (x) => x.id !== `${spot.latitude.toFixed(4)},${spot.longitude.toFixed(4)}`,
            ),
          ],
        })),
      removeSpot: (id) => write((s) => ({ ...s, spots: s.spots.filter((spot) => spot.id !== id) })),
    }),
    [store, write],
  );
  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedState {
  const value = useContext(SavedContext);
  if (value === null) throw new Error("useSaved needs a SavedProvider");
  return value;
}
