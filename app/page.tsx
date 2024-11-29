'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from '@/components/file-uploader'
import { DataTable } from '@/components/data-table'
import { SearchForm } from '@/components/search-form'
import { FilterForm } from '@/components/filter-form'
import { getParquetData } from '@/lib/parquet-reader'

export default function Home() {
  const [data, setData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [tableHeader, setTableHeader] = useState<string[]>([])

  const handleFileUpload = async (files: FileList | File[]) => {
    const { headers, records } = await getParquetData(files);
    setTableHeader(headers);
    setData(records);
    setFilteredData(records);
  }

  const handleSearch = (searchConditions: { column: string; value: string }[]) => {
    const searchResult = data.filter(record => 
      searchConditions.every(({ column, value }) => {
        const index = tableHeader.indexOf(column);
        return String(record[index]).toLowerCase().includes(String(value).toLowerCase())
      })
    )
    setFilteredData(searchResult)
  }

  const handleFilter = (filterConditions: { column: string; operator: string; value: string }[]) => {
    const filterResult = data.filter(record => 
      filterConditions.every(({ column, operator, value }) => {
        const index = tableHeader.indexOf(column);
        const recordValue = record[index];
        switch (operator) {
          case '==': return recordValue == value
          case '!=': return recordValue != value
          case '>': return recordValue > value
          case '>=': return recordValue >= value
          case '<': return recordValue < value
          case '<=': return recordValue <= value
          default: return true
        }
      })
    )
    setFilteredData(filterResult)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Parquet File Viewer</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Parquet Files</CardTitle>
            <CardDescription>Select one or more Parquet files to upload</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onUpload={handleFileUpload} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Search and Filter</CardTitle>
            <CardDescription>Apply search and filter conditions to the data</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchForm columns={tableHeader} onSearch={handleSearch} />
            <br />
            <FilterForm columns={tableHeader} onFilter={handleFilter} />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>Showing {filteredData.length} of {data.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable headers={tableHeader} data={filteredData} />
        </CardContent>
      </Card>
    </main>
  )
}

