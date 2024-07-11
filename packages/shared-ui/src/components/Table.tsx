import "../styles/table.css";

type TableProps = {
  headers: string[];
  tableData: string[][];
};
export default function Table({ headers, tableData }: TableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            {row.map((cellValue, index) => (
              <td key={index}>
                <input value={cellValue} onChange={(e)=>{}} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
