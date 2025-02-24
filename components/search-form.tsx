'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFormProps {
  columns: any[],
  onSearch: (conditions: { column: string; value: string }[]) => void
}

export function SearchForm({ columns, onSearch }: Readonly<SearchFormProps>) {
  const [conditions, setConditions] = useState<{ column: string; value: string }[]>([{ column: '', value: '' }])

  const handleAddCondition = () => {
    setConditions([...conditions, { column: '', value: '' }])
  }

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: 'column' | 'value', value: string) => {
    const newConditions = [...conditions]
    newConditions[index][field] = value
    setConditions(newConditions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(conditions.filter(c => c.column && c.value))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button type="submit" className="w-[120px]">Search</Button>
      <Button type="button" onClick={handleAddCondition} className="ml-4">
        Add Condition
      </Button>
      {conditions.map((condition, index) => (
        <div key={index} className="flex space-x-2">
          <Select
            value={condition.column}
            onValueChange={(value) => handleChange(index, 'column', value)}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={column} value={column}>{column}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Value"
            value={condition.value}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
          />
          <Button type="button" variant="outline" onClick={() => handleRemoveCondition(index)}>
            Remove
          </Button>
        </div>
      ))}
    </form>
  )
}

