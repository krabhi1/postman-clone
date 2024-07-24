import React, { Children, ReactElement, useRef } from "react";
import { ReactChildren } from "../others/utils";
import "../styles/table.css";
import { KeyValue } from "common-utils";
import CloseIcon from "../icons/CloseIcon";

export type RowData = {
  data: KeyValue<any>;
  isReadOnly?: boolean;
};
type TableProps = React.PropsWithChildren<{
  data: RowData[];
  onEdit?: (rowIndex: number, key: string, value: any) => void;
  onEdit2?: (
    rowIndex: number,
    keyName: string,
    value: any,
    row: RowData
  ) => void;
  onDelete?: (rowIndex: number) => void;
  onAdd?: (key: string, value: any) => void;
}>;
export default function Table({
  data,
  children,
  onEdit,
  onEdit2,
  onDelete,
  onAdd,
}: TableProps) {
  const items = Children.toArray(children).filter(
    (e): e is ReactElement<ColumnProps> => {
      const child = e as ReactElement<ColumnProps>;
      if (React.isValidElement(child) && child.type === Column) {
        return true;
      }
      return false;
    }
  ) as ReactElement<ColumnProps>[];
  const lastRowRef = useRef<HTMLTableRowElement>(null);
  function focusLastRowInput(colIndex: number) {
    const child = lastRowRef.current?.children[colIndex];
    if (child instanceof HTMLElement) {
      child.querySelector("input")?.focus();
    }
  }
  const itemProps = items.map((item) => ({
    key: item.props.field,
    canAdd: item.props.canAdd == undefined ? true : item.props.canAdd,
    header: item.props.header,
  }));
  return (
    <table className="table">
      <thead>
        <tr>
          {itemProps.map(({ header }, index) => (
            <th key={index + header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} ref={lastRowRef}>
            {Object.keys(row.data).map((key, index) => {
              const isReadOnly = row.isReadOnly || false;
              const keys = Object.keys(row.data);
              return (
                <td key={index}>
                  <input
                    disabled={isReadOnly}
                    value={row.data[key]}
                    onChange={(e) => {
                      onEdit?.(i, key, e.target.value);
                      onEdit2?.(i, key, e.target.value, row);
                    }}
                  />
                  {!isReadOnly && keys.length - 1 === index && (
                    <div
                      className="row-del"
                      onClick={() => {
                        onDelete?.(i);
                      }}
                    >
                      <span>
                        <CloseIcon />
                      </span>
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
        {/* add new row */}
        <tr>
          {itemProps.map(({ key, canAdd }, index) => {
            return (
              <td key={index}>
                <input
                  disabled={!canAdd}
                  placeholder={key}
                  type="text"
                  onKeyDown={(e) => {
                    e.preventDefault();

                    onAdd?.(key, e.key);
                    //lost focus
                    (e.target as HTMLElement).blur();
                    setTimeout(() => focusLastRowInput(index));
                  }}
                />
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
}

type ColumnProps = {
  field: string;
  header: string;
  canAdd?: boolean;
};
export function Column(props: ColumnProps) {
  return <></>;
}
