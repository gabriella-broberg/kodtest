import { useState, useMemo } from "react";
import { Tabs, Spin, Alert, Grid, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useDeviations } from "../hooks/useDeviations";
import { DeviationCard } from "./DeviationCard";
import { DeviationTable } from "./DeviationTable";
import styles from "./DeviationList.module.css";

const { useBreakpoint } = Grid;

type TabKey = "current" | "completed";

function DeviationList() {
  const [activeTab, setActiveTab] = useState<TabKey>("current");
  const screens = useBreakpoint();
  const showCards = !screens.lg;

  const {
    deviations,
    loading,
    error,
    resolvingIds,
    resolvedBy,
    markAsResolved,
  } = useDeviations();

  const filteredDeviations = useMemo(() => {
    return deviations.filter((dev) => {
      if (activeTab === "current") {
        return dev.status === "rejected";
      } else {
        return dev.status === "resolved";
      }
    });
  }, [deviations, activeTab]);

  const currentCount = useMemo(
    () => deviations.filter((dev) => dev.status === "rejected").length,
    [deviations]
  );
  const completedCount = useMemo(
    () => deviations.filter((dev) => dev.status === "resolved").length,
    [deviations]
  );

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
                  <DeviationCard
                    key={record.id}
                    deviation={record}
                    isResolving={resolvingIds.has(record.id)}
                    resolvedBy={resolvedBy.get(record.id)}
                    onResolve={markAsResolved}
                  />
                ))
              )}
            </div>
          ) : (
            <DeviationTable
              deviations={filteredDeviations}
              resolvingIds={resolvingIds}
              resolvedBy={resolvedBy}
              screens={screens}
              onResolve={markAsResolved}
            />
          )}
        </>
      )}
    </div>
  );
}

export default DeviationList;
