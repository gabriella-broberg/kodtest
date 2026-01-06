import { Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Deviation } from "../types/deviation";
import { DownOutlined } from "@ant-design/icons";
import { PriorityTag } from "./PriorityTag";
import { StatusButton } from "./StatusButton";
import { DeviationDetails } from "./DeviationDetails";
import styles from "./DeviationList.module.css";
import React from "react";

const { Text } = Typography;

interface DeviationTableProps {
  deviations: Deviation[];
  resolvingIds: Set<number>;
  resolvedBy: Map<number, string>;
  screens: Record<string, boolean>;
  onResolve: (id: number) => void;
}

export const DeviationTable = ({
  deviations,
  resolvingIds,
  resolvedBy,
  screens,
  onResolve,
}: DeviationTableProps) => {
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
      width: screens.lg ? 75 : 65,
      render: (priority: Deviation["priority"]) => (
        <PriorityTag priority={priority} size="small" />
      ),
    },
    {
      title: "OBJEKT",
      key: "objectName",
      dataIndex: "objectName",
      width: screens.xxl ? 150 : screens.xl ? 120 : screens.lg ? 110 : 95,
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
      width: screens.xxl ? 220 : screens.xl ? 180 : screens.lg ? 160 : 140,
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
        return (
          <Tooltip
            title={new Date(date).toLocaleString("sv-SE")}
            placement="topLeft"
          >
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
      width: 150,
      fixed: "right" as const,
      render: (_, record) => (
        <StatusButton
          deviation={record}
          isResolving={resolvingIds.has(record.id)}
          onResolve={onResolve}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={deviations}
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
              transition: "background-color 0.3s ease, border-left 0.3s ease",
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
        expandedRowRender: (record) => (
          <DeviationDetails
            deviation={record}
            resolvedBy={resolvedBy.get(record.id)}
            isMobile={false}
          />
        ),
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
                onExpand(record, e as any);
              }
            }}
          />
        ),
      }}
    />
  );
};
