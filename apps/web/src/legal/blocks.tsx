import * as React from "react";

export function Section({ title, children }: { title: string; children: React.ReactNode }): React.ReactElement {
  return (
    <section className="legal-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }): React.ReactElement {
  return (
    // Scrollable regions must be reachable by keyboard, or the columns past the
    // fold are invisible to anyone not using a pointer.
    <div className="legal-table-wrap" role="region" aria-label="Table" tabIndex={0}>
      <table>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }): React.ReactElement {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
