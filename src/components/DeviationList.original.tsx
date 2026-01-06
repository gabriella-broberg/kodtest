import { useState, useEffect } from "react";
import type React from "react";
import {
  Table,
  Tag,
  Button,
  Tabs,
  Typography,
  Breadcrumb,
  Descriptions,
  Card,
  Grid,
  Collapse,
  Spin,
  Alert,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  DownOutlined,
  BuildOutlined,
  HomeFilled,
} from "@ant-design/icons";
import type { Deviation } from "../types/deviation";
import type { ColumnsType } from "antd/es/table";
import styles from "./DeviationList.module.css";

const { Text } = Typography;
const { useBreakpoint } = Grid;
const { Panel } = Collapse;

type TabKey = "current" | "completed";

function DeviationList() {
  const [deviations, setDeviations] = useState<Deviation[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("current");
  const [resolvingIds, setResolvingIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedBy, setResolvedBy] = useState<Map<number, string>>(new Map());
  const screens = useBreakpoint();
  const showCards = !screens.lg; // lg breakpoint är 992px - cards visas på skärmar mindre än 992px

  // Mockad inloggad användare - i en riktig app skulle detta komma från auth context
  const currentUser = "Aktuell användare"; // eller från auth system

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

  const handleMarkAsResolved = (id: number): void => {
    // Lägg till ID i resolvingIds för att visa grön bakgrund
    setResolvingIds((prev) => new Set(prev).add(id));

    // Spara vem som åtgärdade avvikelsen
    setResolvedBy((prev) => new Map(prev).set(id, currentUser));

    // Efter 1 sekund, uppdatera statusen
    setTimeout(() => {
      setDeviations((prevDeviations) =>
        prevDeviations.map((dev) =>
          dev.id === id
            ? { ...dev, status: "resolved" as const, statusName: "Åtgärdad" }
            : dev
        )
      );
      // Ta bort ID från resolvingIds efter att statusen har ändrats
      setResolvingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 1000);
  };

  const getPriorityColor = (priority: Deviation["priority"]): string => {
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

  const getPriorityText = (priority: Deviation["priority"]): string => {
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

  const filteredDeviations = deviations.filter((dev) => {
    if (activeTab === "current") {
      return dev.status === "rejected";
    } else {
      return dev.status === "resolved";
    }
  });

  // Räkna antal avvikelser per tab
  const currentCount = deviations.filter(
    (dev) => dev.status === "rejected"
  ).length;
  const completedCount = deviations.filter(
    (dev) => dev.status === "resolved"
  ).length;

  const renderSecondaryInfo = (record: Deviation): React.JSX.Element => {
    // På mobil använder vi en enklare lista, på desktop behåller vi Descriptions
    if (showCards) {
      return (
        <div className={styles.mobileDetails}>
          {/* Intuitiv ordning: Avvikelse → Skapad → Prioritet → Objekt → Plats → Ansvarig → Status → Teknisk info */}
          {/* Rad 1: Avvikelse - Skapad */}
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Avvikelse
            </Text>
            <Text strong>{record.name}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Skapad
            </Text>
            <Text>{new Date(record.createdAtUtc).toLocaleString("sv-SE")}</Text>
          </div>

          {/* Rad 2: Prioritet - Objekt */}
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Prioritet
            </Text>
            <Tag color={getPriorityColor(record.priority)}>
              {getPriorityText(record.priority)}
            </Tag>
          </div>
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Objekt
            </Text>
            <Text>{record.objectName}</Text>
          </div>

          {/* Rad 3: Byggnad - Fastighet */}
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Byggnad
            </Text>
            <Text>{record.buildingName}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Fastighet
            </Text>
            <Text>{record.propertyName}</Text>
          </div>

          {/* Rad 4: Rum - Våningsplan */}
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Rum
            </Text>
            <Text>{record.roomName}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Våningsplan
            </Text>
            <Text>{record.levelName}</Text>
          </div>

          {/* Rad 5: Ansvarig - Uppdaterad av */}
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Ansvarig
            </Text>
            <Text>{record.responsibleUser || "Ej tilldelad"}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Uppdaterad av
            </Text>
            <Text>{record.updatedByUser}</Text>
          </div>

          {/* Rad 6: Objekttyp - Åtgärdad av */}
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Objekttyp
            </Text>
            <Text>{record.objectType}</Text>
          </div>
          {record.status === "resolved" && resolvedBy.has(record.id) ? (
            <div className={styles.detailItem}>
              <Text type="secondary" className={styles.detailLabel}>
                Åtgärdad av
              </Text>
              <Text>{resolvedBy.get(record.id)}</Text>
            </div>
          ) : (
            <div className={styles.detailItem}>
              <Text type="secondary" className={styles.detailLabel}>
                Uppdaterad
              </Text>
              <Text>
                {new Date(record.updatedAtUtc).toLocaleString("sv-SE")}
              </Text>
            </div>
          )}

          {/* Rad 7: Inspektionstyp - Status */}
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Inspektionstyp
            </Text>
            <Text>{record.inspectionType}</Text>
          </div>
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Status
            </Text>
            <Tag color={record.status === "resolved" ? "green" : "red"}>
              {record.statusName}
            </Tag>
          </div>

          {/* Rad 8: Borttagen */}
          <div className={styles.detailItem}>
            <Text type="secondary" className={styles.detailLabel}>
              Borttagen
            </Text>
            <Text>{record.isDeleted ? "Ja" : "Nej"}</Text>
          </div>
        </div>
      );
    }

    // Desktop-version med Descriptions
    return (
      <div className={styles.expandedContent}>
        <Descriptions
          column={{ xs: 1, sm: 2, md: 3 }}
          size="small"
          bordered
          title="Alla detaljer"
        >
          {/* Intuitiv ordning: Avvikelse → Skapad → Prioritet → Objekt → Plats → Ansvarig → Status → Teknisk info */}
          {/* Rad 1: Avvikelse - Skapad */}
          <Descriptions.Item label="Avvikelse">
            <Text strong>{record.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Skapad">
            {new Date(record.createdAtUtc).toLocaleString("sv-SE")}
          </Descriptions.Item>

          {/* Rad 2: Prioritet - Objekt */}
          <Descriptions.Item label="Prioritet">
            <Tag color={getPriorityColor(record.priority)}>
              {getPriorityText(record.priority)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Objekt">
            {record.objectName}
          </Descriptions.Item>

          {/* Rad 3: Byggnad - Fastighet */}
          <Descriptions.Item label="Byggnad">
            {record.buildingName}
          </Descriptions.Item>
          <Descriptions.Item label="Fastighet">
            {record.propertyName}
          </Descriptions.Item>

          {/* Rad 4: Rum - Våningsplan */}
          <Descriptions.Item label="Rum">{record.roomName}</Descriptions.Item>
          <Descriptions.Item label="Våningsplan">
            {record.levelName}
          </Descriptions.Item>

          {/* Rad 5: Ansvarig - Uppdaterad av */}
          <Descriptions.Item label="Ansvarig">
            {record.responsibleUser || "Ej tilldelad"}
          </Descriptions.Item>
          <Descriptions.Item label="Uppdaterad av">
            {record.updatedByUser}
          </Descriptions.Item>

          {/* Rad 6: Objekttyp - Åtgärdad av / Uppdaterad */}
          <Descriptions.Item label="Objekttyp">
            {record.objectType}
          </Descriptions.Item>
          {record.status === "resolved" && resolvedBy.has(record.id) ? (
            <Descriptions.Item label="Åtgärdad av">
              {resolvedBy.get(record.id)}
            </Descriptions.Item>
          ) : (
            <Descriptions.Item label="Uppdaterad">
              {new Date(record.updatedAtUtc).toLocaleString("sv-SE")}
            </Descriptions.Item>
          )}

          {/* Rad 7: Inspektionstyp - Status */}
          <Descriptions.Item label="Inspektionstyp">
            {record.inspectionType}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={record.status === "resolved" ? "green" : "red"}>
              {record.statusName}
            </Tag>
          </Descriptions.Item>

          {/* Rad 8: Borttagen */}
          <Descriptions.Item label="Borttagen">
            {record.isDeleted ? "Ja" : "Nej"}
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  };

  const renderStatusColumn = (record: Deviation) => {
    if (record.status === "rejected") {
      const isResolving = resolvingIds.has(record.id);
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
          onClick={() => handleMarkAsResolved(record.id)}
          aria-label={`Markera avvikelse "${record.name}" som åtgärdad`}
        >
          Åtgärda
        </Button>
      );
    }
    if (record.status === "resolved") {
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
    return null;
  };

  // Tabell med separata kolumner - logisk ordning: vad → vad det är → var det är
  // Anpassad för mindre skärmar med mindre text och kortare kolumner
  const columns: ColumnsType<Deviation> = [
    {
      title: "AVVIKELSE",
      key: "name",
      dataIndex: "name",
      width: screens.xxl ? 300 : screens.xl ? 240 : screens.lg ? 190 : 160,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <Text
            strong
            style={{
              fontSize: screens.lg ? "14px" : "12px",
              lineHeight: "1.4",
            }}
          >
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "PRIORITET",
      key: "priority",
      dataIndex: "priority",
      width: screens.lg ? 90 : 75,
      render: (priority: Deviation["priority"]) => (
        <Tag
          color={getPriorityColor(priority)}
          style={{ fontSize: screens.lg ? "12px" : "11px", padding: "2px 8px" }}
        >
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: "OBJEKT",
      key: "objectName",
      dataIndex: "objectName",
      width: screens.xxl ? 130 : screens.xl ? 100 : screens.lg ? 90 : 80,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <Text style={{ fontSize: screens.lg ? "13px" : "12px" }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "BYGGNAD",
      key: "buildingName",
      dataIndex: "buildingName",
      width: screens.xxl ? 200 : screens.xl ? 170 : screens.lg ? 150 : 130,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <Text style={{ fontSize: screens.lg ? "13px" : "12px" }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "FASTIGHET",
      key: "propertyName",
      dataIndex: "propertyName",
      width: screens.xxl ? 240 : screens.xl ? 200 : screens.lg ? 180 : 160,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <Text style={{ fontSize: screens.lg ? "13px" : "12px" }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "RUM",
      key: "roomName",
      dataIndex: "roomName",
      width: screens.xxl ? 150 : screens.xl ? 120 : screens.lg ? 100 : 80,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip title={text} placement="topLeft">
          <Text style={{ fontSize: screens.lg ? "13px" : "12px" }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "SKAPAD",
      key: "createdAtUtc",
      dataIndex: "createdAtUtc",
      width: screens.xxl ? 120 : screens.xl ? 110 : screens.lg ? 100 : 90,
      ellipsis: {
        showTitle: false,
      },
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleDateString("sv-SE");
        const fullDateTime = new Date(date).toLocaleString("sv-SE");
        return (
          <Tooltip title={fullDateTime} placement="topLeft">
            <Text style={{ fontSize: screens.lg ? "13px" : "12px" }}>
              {formattedDate}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: "ÅTGÄRD",
      key: "action",
      width: screens.lg ? 130 : 110,
      fixed: "right" as const,
      render: (_, record) => renderStatusColumn(record),
    },
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb
        items={[
          {
            title: (
              <HomeOutlined aria-label="Hem" role="img" aria-hidden="false" />
            ),
          },
          { title: <span className={styles.breadcrumbText}>Avvikelser</span> },
        ]}
        className={styles.breadcrumb}
        aria-label="Navigeringssökväg"
      />

      <div className={styles.headerContainer}>
        <h1 className={styles.title}>Avvikelser</h1>
      </div>

      {error && (
        <Alert
          message="Kunde inte ladda avvikelser"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text>Laddar avvikelser...</Text>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as TabKey)}
              style={{ flex: 1 }}
              aria-label="Filtrera avvikelser efter status"
              items={[
                {
                  key: "current",
                  label: `Aktuella (${currentCount})`,
                },
                {
                  key: "completed",
                  label: `Avslutad (${completedCount})`,
                },
              ]}
            />
          </div>

          {showCards ? (
            <div className={styles.cardContainer}>
              {filteredDeviations.length === 0 ? (
                <div className={styles.emptyState}>
                  Inga avvikelser hittades
                </div>
              ) : (
                filteredDeviations.map((record) => (
                  <Card
                    key={record.id}
                    className={`${styles.deviationCard} ${
                      resolvingIds.has(record.id) ? styles.resolvingCard : ""
                    }`}
                    style={
                      resolvingIds.has(record.id)
                        ? {
                            backgroundColor: "#f6ffed",
                            borderColor: "#52c41a",
                            borderWidth: "3px",
                            boxShadow: "0 0 0 2px rgba(82, 196, 26, 0.2)",
                          }
                        : {
                            borderLeftWidth: "4px",
                            borderLeftColor:
                              getPriorityColor(record.priority) === "red"
                                ? "#ff4d4f"
                                : getPriorityColor(record.priority) === "orange"
                                ? "#fa8c16"
                                : getPriorityColor(record.priority) === "blue"
                                ? "#1890ff"
                                : "#d9d9d9",
                          }
                    }
                    title={
                      <Text strong style={{ fontSize: "18px" }}>
                        {record.name}
                      </Text>
                    }
                    extra={
                      <Tag
                        color={getPriorityColor(record.priority)}
                        style={{
                          fontSize: "12px",
                          padding: "2px 8px",
                          lineHeight: "1.5",
                        }}
                      >
                        {getPriorityText(record.priority)} prioritet
                      </Tag>
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
                              {record.buildingName}
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
                              {record.roomName}
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
                            {renderSecondaryInfo(record)}
                          </Panel>
                        </Collapse>
                        <div style={{ marginLeft: "12px", flexShrink: 0 }}>
                          {record.status === "rejected" ? (
                            (() => {
                              const isResolving = resolvingIds.has(record.id);
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
                                  onClick={() =>
                                    handleMarkAsResolved(record.id)
                                  }
                                  aria-label={`Markera avvikelse "${record.name}" som åtgärdad`}
                                >
                                  Åtgärda
                                </Button>
                              );
                            })()
                          ) : (
                            <Button
                              type="primary"
                              size="small"
                              icon={<CheckCircleOutlined />}
                              disabled
                            >
                              Åtgärdad
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredDeviations}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: "Inga avvikelser hittades",
              }}
              size={screens.lg ? "middle" : "small"}
              className={styles.compactTable}
              rowClassName={(record) =>
                resolvingIds.has(record.id) ? styles.resolvingRow : ""
              }
              onRow={(record) => ({
                style: resolvingIds.has(record.id)
                  ? {
                      backgroundColor: "#f6ffed",
                      borderLeft: "4px solid #52c41a",
                      transition:
                        "background-color 0.3s ease, border-left 0.3s ease",
                    }
                  : {},
              })}
              components={{
                header: {
                  cell: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
                    <th {...props} className={styles.tableHeader} />
                  ),
                },
              }}
              expandable={{
                expandedRowRender: (record) => renderSecondaryInfo(record),
                rowExpandable: () => true,
                expandIcon: ({ expanded, onExpand, record }) => (
                  <DownOutlined
                    style={{
                      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onClick={(e) => onExpand(record, e)}
                    aria-label={
                      expanded
                        ? `Dölj sekundär information för avvikelse "${record.name}"`
                        : `Visa sekundär information för avvikelse "${record.name}"`
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        // Använd onClick-hanteraren istället för att skicka keyboard event
                        const syntheticEvent =
                          e as unknown as React.MouseEvent<HTMLElement>;
                        onExpand(record, syntheticEvent);
                      }
                    }}
                  />
                ),
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default DeviationList;
