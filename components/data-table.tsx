import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableProps {
  headers: any[],
  data: any[]
}

export function DataTable({ headers, data }: Readonly<DataTableProps>) {
  if (data.length === 0 || headers.length === 0) {
    return <p>No data to display</p>
  }
  console.log(headers)
  console.log(data)
  const columns = Object.keys(data[0])

  const toDataString = (item: any) => {
    if (item instanceof Date) {
      return item.toISOString();
    } else if (item instanceof Map || item instanceof Object) {
      return JSON.stringify(item);
    } else {
      return String(item);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column}>
                {toDataString(row[column])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

