import { useState, useEffect } from "react";
import type { Deviation } from "../types/deviation";

const RESOLVE_DELAY_MS = 1000;

export const useDeviations = () => {
  const [deviations, setDeviations] = useState<Deviation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvingIds, setResolvingIds] = useState<Set<number>>(new Set());
  const [resolvedBy, setResolvedBy] = useState<Map<number, string>>(new Map());

  const currentUser = "Aktuell användare";

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("/data.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Kunde inte ladda data");
        }
        return res.json();
      })
      .then((data) => {
        setDeviations(data as Deviation[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fel vid laddning av data:", err);
        setError("Kunde inte ladda avvikelser. Försök igen senare.");
        setLoading(false);
      });
  }, []);

  const markAsResolved = (id: number): void => {
    setResolvingIds((prev) => new Set(prev).add(id));
    setResolvedBy((prev) => new Map(prev).set(id, currentUser));

    setTimeout(() => {
      setDeviations((prevDeviations) =>
        prevDeviations.map((dev) =>
          dev.id === id
            ? { ...dev, status: "resolved" as const, statusName: "Åtgärdad" }
            : dev
        )
      );
      setResolvingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, RESOLVE_DELAY_MS);
  };

  return {
    deviations,
    loading,
    error,
    resolvingIds,
    resolvedBy,
    markAsResolved,
  };
};
