import { Tag } from "antd";
import type { Deviation } from "../types/deviation";
import { getPriorityColor, getPriorityText } from "./priority";

interface PriorityTagProps {
  priority: Deviation["priority"];
  showText?: boolean;
  size?: "small" | "default";
}

export const PriorityTag = ({
  priority,
  showText = false,
  size = "default",
}: PriorityTagProps) => {
  const text = showText
    ? `${getPriorityText(priority)} prioritet`
    : getPriorityText(priority);

  return (
    <Tag
      color={getPriorityColor(priority)}
      style={{
        fontSize: size === "small" ? "12px" : "13px",
        padding: size === "small" ? "2px 8px" : "4px 12px",
        lineHeight: "1.5",
        minWidth: showText ? "100px" : "60px",
        textAlign: "center",
        display: "inline-block",
      }}
    >
      {text}
    </Tag>
  );
};
