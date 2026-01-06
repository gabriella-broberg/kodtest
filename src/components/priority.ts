import type { Deviation } from "../types/deviation";

export const getPriorityColor = (priority: Deviation["priority"]): string => {
  switch (priority) {
    case "high":
      return "red";
    case "medium":
      return "orange";
    case "low":
      return "blue";
    default:
      return "default";
  }
};

export const getPriorityText = (priority: Deviation["priority"]): string => {
  switch (priority) {
    case "high":
      return "Hög";
    case "medium":
      return "Medel";
    case "low":
      return "Låg";
    default:
      return priority;
  }
};
