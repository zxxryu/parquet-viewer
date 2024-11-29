'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// import * as parquet from 'parquetjs-lite'

interface FileUploaderProps {
  onUpload: (files: FileList | Array<File>) => void | Promise<void>
}

export function FileUploader({ onUpload }: Readonly<FileUploaderProps>) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState(0)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    setIsLoading(true)
    await onUpload(files);
    setIsLoading(false);
    setSelectedFiles(files.length)
  }

  const handleClearFiles = () => {
    const file = document.getElementById('parquet-file');
    if (file && file instanceof HTMLInputElement) {
      file.value = '';
    }
    onUpload([]);
    setSelectedFiles(0)
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="parquet-file">Parquet File(s)</Label>
      <Input
        id="parquet-file"
        type="file"
        multiple
        accept=".parquet"
        onChange={handleFileChange}
        disabled={isLoading}
      />
      {selectedFiles > 0 && <Button type="button" onClick={handleClearFiles}>Clear</Button>}
      {isLoading && <p>Loading...</p>}
    </div>
  )
}

