import { Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { Deviation } from "../types/deviation";

interface StatusButtonProps {
  deviation: Deviation;
  isResolving: boolean;
  onResolve: (id: number) => void;
}

export const StatusButton = ({
  deviation,
  isResolving,
  onResolve,
}: StatusButtonProps) => {
  if (deviation.status === "rejected") {
    if (isResolving) {
      return (
        <Button
          type="primary"
          size="small"
          icon={<CheckCircleOutlined />}
          disabled
        >
          Åtgärdad
        </Button>
      );
    }
    return (
      <Button
        type="primary"
        size="small"
        icon={<CheckCircleOutlined />}
        onClick={() => onResolve(deviation.id)}
        aria-label={`Markera avvikelse "${deviation.name}" som åtgärdad`}
      >
        Åtgärda
      </Button>
    );
  }

  if (deviation.status === "resolved") {
    return (
      <Button
        type="primary"
        size="small"
        icon={<CheckCircleOutlined />}
        disabled
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          borderColor: "rgba(0, 0, 0, 0.04)",
          color: "rgba(0, 0, 0, 0.25)",
        }}
        aria-label={`Avvikelse "${deviation.name}" är åtgärdad`}
      >
        Åtgärdad
      </Button>
    );
  }

  return null;
};
