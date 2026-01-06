import { Descriptions, Tag, Typography } from "antd";
import type { Deviation } from "../types/deviation";
import { getPriorityColor, getPriorityText } from "./priority";
import styles from "./DeviationList.module.css";

const { Text } = Typography;

interface DeviationDetailsProps {
  deviation: Deviation;
  resolvedBy?: string;
  isMobile?: boolean;
}

export const DeviationDetails = ({
  deviation,
  resolvedBy,
  isMobile = false,
}: DeviationDetailsProps) => {
  if (isMobile) {
    return (
      <div className={styles.mobileDetails}>
        {/* Rad 1: Avvikelse - Skapad */}
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Avvikelse
          </Text>
          <Text strong>{deviation.name}</Text>
        </div>
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Skapad
          </Text>
          <Text>
            {new Date(deviation.createdAtUtc).toLocaleString("sv-SE")}
          </Text>
        </div>

        {/* Rad 2: Prioritet - Objekt */}
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Prioritet
          </Text>
          <Tag color={getPriorityColor(deviation.priority)}>
            {getPriorityText(deviation.priority)}
          </Tag>
        </div>
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Objekt
          </Text>
          <Text>{deviation.objectName}</Text>
        </div>

        {/* Rad 3: Byggnad - Fastighet */}
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Byggnad
          </Text>
          <Text>{deviation.buildingName}</Text>
        </div>
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Fastighet
          </Text>
          <Text>{deviation.propertyName}</Text>
        </div>

        {/* Rad 4: Rum - Våningsplan */}
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Rum
          </Text>
          <Text>{deviation.roomName}</Text>
        </div>
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Våningsplan
          </Text>
          <Text>{deviation.levelName}</Text>
        </div>

        {/* Rad 5: Ansvarig - Uppdaterad av */}
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Ansvarig
          </Text>
          <Text>{deviation.responsibleUser || "Ej tilldelad"}</Text>
        </div>
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Uppdaterad av
          </Text>
          <Text>{deviation.updatedByUser}</Text>
        </div>

        {/* Rad 6: Objekttyp - Åtgärdad av / Uppdaterad */}
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Objekttyp
          </Text>
          <Text>{deviation.objectType}</Text>
        </div>
        {deviation.status === "resolved" && resolvedBy ? (
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Åtgärdad av
            </Text>
            <Text>{resolvedBy}</Text>
          </div>
        ) : (
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Uppdaterad
            </Text>
            <Text>
              {new Date(deviation.updatedAtUtc).toLocaleString("sv-SE")}
            </Text>
          </div>
        )}

        {/* Rad 7: Inspektionstyp - Status */}
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Inspektionstyp
          </Text>
          <Text>{deviation.inspectionType}</Text>
        </div>
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Status
          </Text>
          <Tag color={deviation.status === "resolved" ? "green" : "red"}>
            {deviation.statusName}
          </Tag>
        </div>

        {/* Rad 8: Borttagen */}
        <div className={styles.detailItem}>
          <Text type="secondary" className={styles.detailLabel}>
            Borttagen
          </Text>
          <Text>{deviation.isDeleted ? "Ja" : "Nej"}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.expandedContent}>
      <Descriptions
        column={{ xs: 1, sm: 2, md: 3 }}
        size="small"
        bordered
        title="Alla detaljer"
      >
        {/* Rad 1: Avvikelse - Skapad */}
        <Descriptions.Item label="Avvikelse">
          <Text strong>{deviation.name}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Skapad">
          {new Date(deviation.createdAtUtc).toLocaleString("sv-SE")}
        </Descriptions.Item>

        {/* Rad 2: Prioritet - Objekt */}
        <Descriptions.Item label="Prioritet">
          <Tag color={getPriorityColor(deviation.priority)}>
            {getPriorityText(deviation.priority)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Objekt">
          {deviation.objectName}
        </Descriptions.Item>

        {/* Rad 3: Fastighet - Uppdaterad av */}
        <Descriptions.Item label="Fastighet">
          {deviation.propertyName}
        </Descriptions.Item>
        <Descriptions.Item label="Uppdaterad av">
          {deviation.updatedByUser}
        </Descriptions.Item>

        {/* Rad 4: Objekttyp - Våningsplan */}
        <Descriptions.Item label="Objekttyp">
          {deviation.objectType}
        </Descriptions.Item>
        <Descriptions.Item label="Våningsplan">
          {deviation.levelName}
        </Descriptions.Item>

        {/* Rad 5: Uppdaterad - Byggnad */}
        {deviation.status === "resolved" && resolvedBy ? (
          <Descriptions.Item label="Åtgärdad av">
            {resolvedBy}
          </Descriptions.Item>
        ) : (
          <Descriptions.Item label="Uppdaterad">
            {new Date(deviation.updatedAtUtc).toLocaleString("sv-SE")}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Byggnad">
          {deviation.buildingName}
        </Descriptions.Item>

        {/* Rad 6: Rum - Ansvarig */}
        <Descriptions.Item label="Rum">{deviation.roomName}</Descriptions.Item>
        <Descriptions.Item label="Ansvarig">
          {deviation.responsibleUser || "Ej tilldelad"}
        </Descriptions.Item>

        {/* Rad 7: Status - Inspektionstyp */}
        <Descriptions.Item label="Status">
          <Tag color={deviation.status === "resolved" ? "green" : "red"}>
            {deviation.statusName}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Inspektionstyp">
          {deviation.inspectionType}
        </Descriptions.Item>

        {/* Rad 8: Borttagen */}
        <Descriptions.Item label="Borttagen">
          {deviation.isDeleted ? "Ja" : "Nej"}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
