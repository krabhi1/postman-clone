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
  onDelete?: (rowIndex: number) => void;
  onAdd?: (key: string, value: any) => void;
}>;
export default function Table({
  data,
  children,
  onEdit,
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
  const headers = items.map((item) => item.props.header);
  const keys = items.map((item) => item.props.field);
  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
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
          // for new ro
        ))}
        <tr>
          {keys.map((key, index) => (
            <td key={index}>
              <input
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
          ))}
        </tr>
      </tbody>
    </table>
  );
}

type ColumnProps = {
  field: string;
  header: string;
};
export function Column(props: ColumnProps) {
  return <></>;
}
