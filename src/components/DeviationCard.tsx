import { Card, Collapse, Typography } from "antd";
import { BuildOutlined, HomeFilled } from "@ant-design/icons";
import type { Deviation } from "../types/deviation";
import { PriorityTag } from "./PriorityTag";
import { StatusButton } from "./StatusButton";
import { DeviationDetails } from "./DeviationDetails";
import { getPriorityColor } from "./priority";
import styles from "./DeviationList.module.css";

const { Text } = Typography;
const { Panel } = Collapse;

interface DeviationCardProps {
  deviation: Deviation;
  isResolving: boolean;
  resolvedBy?: string;
  onResolve: (id: number) => void;
}

export const DeviationCard = ({
  deviation,
  isResolving,
  resolvedBy,
  onResolve,
}: DeviationCardProps) => {
  const priorityColor = getPriorityColor(deviation.priority);
  const borderColor =
    priorityColor === "red"
      ? "#ff4d4f"
      : priorityColor === "orange"
      ? "#fa8c16"
      : priorityColor === "blue"
      ? "#1890ff"
      : "#d9d9d9";

  return (
    <Card
      className={`${styles.deviationCard} ${
        isResolving ? styles.resolvingCard : ""
      }`}
      style={
        isResolving
          ? {
              backgroundColor: "#f6ffed",
              borderColor: "#52c41a",
              borderWidth: "3px",
              boxShadow: "0 0 0 2px rgba(82, 196, 26, 0.2)",
            }
          : {
              borderLeftWidth: "4px",
              borderLeftColor: borderColor,
            }
      }
      title={
        <Text
          strong
          style={{ fontSize: "18px" }}
          className={styles.cardTitleText}
        >
          {deviation.name}
        </Text>
      }
      extra={
        <PriorityTag priority={deviation.priority} showText size="small" />
      }
    >
      <div className={styles.cardContent}>
        {/* Endast viktig information - name, buildingName, roomName */}
        <div className={styles.primaryInfo}>
          <div className={styles.infoRow}>
            <BuildOutlined className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <Text type="secondary" className={styles.infoLabel}>
                Byggnad
              </Text>
              <Text strong className={styles.infoValue}>
                {deviation.buildingName}
              </Text>
            </div>
          </div>
          <div className={styles.infoRow}>
            <HomeFilled className={styles.infoIcon} />
            <div className={styles.infoContent}>
              <Text type="secondary" className={styles.infoLabel}>
                Rum
              </Text>
              <Text strong className={styles.infoValue}>
                {deviation.roomName}
              </Text>
            </div>
          </div>
        </div>

        {/* Åtgärda-knapp och Visa alla detaljer på samma rad */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "8px",
          }}
        >
          <Collapse ghost style={{ flex: 1, margin: 0 }}>
            <Panel header="Visa alla detaljer" key="details">
              <DeviationDetails
                deviation={deviation}
                resolvedBy={resolvedBy}
                isMobile={true}
              />
            </Panel>
          </Collapse>
          <div style={{ marginLeft: "12px", flexShrink: 0 }}>
            <StatusButton
              deviation={deviation}
              isResolving={isResolving}
              onResolve={onResolve}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
