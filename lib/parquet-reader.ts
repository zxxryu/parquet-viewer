import { parquetRead, parquetMetadata } from 'hyparquet'
import { compressors } from 'hyparquet-compressors'
// import { asyncBufferFrom } from '@hyparam/components'

async function getParquetData(files: FileList|File[]): Promise<{headers: any[], records: any[]}> {
    const headers: any[] = [];
    const records: any[] = [];
    const promises = [];
    for (const file of Array.from(files)) {
        console.log(file);
        const arrayBuffer = await asyncArrayBufferFormFile(file);
        const metadata = parquetMetadata(arrayBuffer);
        if (headers.length === 0) {
            headers.push(...metadata?.schema?.slice(1)?.map(item => item.name));
        }
        console.log(metadata);
        const p = await parquetRead({
            metadata,
            file: {
                byteLength: file.size, 
                slice(start, end) {
                    return arrayBuffer.slice(start, end);
                }
            },
            compressors,
            onComplete: data => {
                console.log(data);
                records.push(...data)
            }
        });
        promises.push(p);
    }
    await Promise.all(promises);
    return { headers: headers, records: records};
}

async function asyncArrayBufferFormFile(file: File) : Promise<ArrayBuffer>{
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function() {
            if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result);
            } else {
                resolve(new ArrayBuffer(0));
            }
        }
        reader.readAsArrayBuffer(file);
    });
}

export {
    getParquetData
}