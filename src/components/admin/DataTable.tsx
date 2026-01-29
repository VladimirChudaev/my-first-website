// components/admin/DataTable.tsx

import { ReactNode } from 'react';

export type DataTableColumn<T> = {
  key: keyof T;
  title: string;
  render?: (value: any, row: T) => ReactNode;
};

type Props<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
};

export default function DataTable<T>({
  columns,
  data,
}: Props<T>) {
  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left px-4 py-2 font-medium"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-muted-foreground"
              >
                No data
              </td>
            </tr>
          )}

          {data.map((row, i) => (
            <tr
              key={i}
              className="border-t hover:bg-muted/50 transition"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-2">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
