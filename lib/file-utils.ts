interface FileItem {
    uuid: string;
    type: string;
    label: string;
    fullPath: string;
    file?: () => Promise<File>;
    items?: FileItem[];
}

class FileUtils  {
    constructor() {}

    async getFilesFromTransferItemList(items: DataTransferItemList): Promise<FileItem[]> {
        const files: FileItem[] = [];
        for (const dataTransferItem of items) {
            const item = dataTransferItem.webkitGetAsEntry();
            if (item?.isDirectory) {
                const folder = {
                    uuid: window.crypto.randomUUID(),
                    type: 'folder',
                    label: item.name,
                    fullPath: item.fullPath,
                    items: [],
                };
                files.push(folder);
                this._listFilesByDirEntry(item as FileSystemDirectoryEntry, folder.items);
            } else if (item?.isFile) {
                const file = {
                    uuid: window.crypto.randomUUID(),
                    type: 'file',
                    label: item.name,
                    fullPath: item.fullPath,
                    file: this.getFileFromFileSystemFileEntry.bind(this, item as FileSystemFileEntry),
                };
                files.push(file);
            }
        }
        return files.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1;
            } else {
                return a.label.localeCompare(b.label);
            }
        });
    }

    async getFilesFromTransferItem(dataTransferItem: DataTransferItem): Promise<FileItem | undefined> {
        const item = dataTransferItem.webkitGetAsEntry();
        if (item?.isDirectory) {
            const folder = {
                uuid: window.crypto.randomUUID(),
                type: 'folder',
                label: item.name,
                fullPath: item.fullPath,
                items: await this.listFiles(item as FileSystemDirectoryEntry),
            };
            return folder;
        } else if (item?.isFile) {
            const file = {
                uuid: window.crypto.randomUUID(),
                type: 'file',
                label: item.name,
                fullPath: item.fullPath,
                file: this.getFileFromFileSystemFileEntry.bind(this, item as FileSystemFileEntry),
            };
            return file;
        }
    }

    async listFiles(folder: FileSystemDirectoryEntry): Promise<FileItem[]> {
        const files: FileItem[] = [];
        return new Promise((resolve) => {
            const reader = folder.createReader();
            reader.readEntries(async (entries) => {
                for (const entry of entries) {
                    if (entry?.isDirectory) {
                        const folder: FileItem = {
                            uuid: window.crypto.randomUUID(),
                            type: 'folder',
                            label: entry.name,
                            fullPath: entry.fullPath,
                            items: await this.listFiles(entry as FileSystemDirectoryEntry),
                        };
                        files.push(folder);
                    } else if (entry?.isFile) {
                        const file = {
                            uuid: window.crypto.randomUUID(),
                            type: 'file',
                            label: entry.name,
                            fullPath: entry.fullPath,
                            file: this.getFileFromFileSystemFileEntry.bind(this, entry as FileSystemFileEntry),
                        };
                        files.push(file);
                    }
                }
                resolve(files);
            });
        });
    }

    _listFilesByDirEntry(folder: FileSystemDirectoryEntry, fileItems: FileItem[]) {
        const reader = folder.createReader();
        reader.readEntries((entries) => {
            for (const entry of entries) {
                if (entry?.isDirectory) {
                    const folder = {
                        uuid: window.crypto.randomUUID(),
                        type: 'folder',
                        label: entry.name,
                        fullPath: entry.fullPath,
                        items: [],
                    };
                    fileItems.push(folder);
                    this._listFilesByDirEntry(entry as FileSystemDirectoryEntry, folder.items)
                } else if (entry?.isFile) {
                    const file = {
                        uuid: window.crypto.randomUUID(),
                        type: 'file',
                        label: entry.name,
                        fullPath: entry.fullPath,
                        file: this.getFileFromFileSystemFileEntry.bind(this, entry as FileSystemFileEntry),
                    };
                    fileItems.push(file);
                }
            }
            fileItems.sort((a, b) => {
                if (a.type !== b.type) {
                    return a.type === 'folder' ? -1 : 1;
                } else {
                    return a.label.localeCompare(b.label);
                }
            });
        });
    }

    async getFileFromFileSystemFileEntry(fileEntry: FileSystemFileEntry): Promise<File> {
        return new Promise((resolve, reject) => {
            fileEntry.file(
                file => {
                    resolve(file);
                },
                error => {
                    reject(error);
                }
            );
        });
    }

    async getFilesFromDirHandle(dirHandle: any): Promise<FileItem[]> {
        const files: FileItem[] = [];
        const file = {
            uuid: window.crypto.randomUUID(),
            type: 'folder',
            label: dirHandle.name,
            fullPath: '/' + dirHandle.name,
            items: [],
        };
        await this._listFilesByDirHandle(dirHandle, file.items as FileItem[], file.fullPath);
        files.push(file);
        return files;
    }

    async getFileFromFileHandle(fileHandles: any): Promise<FileItem[]> {
        const files: FileItem[] = [];
        for (const fileHandle of fileHandles) {
            const file = {
                uuid: window.crypto.randomUUID(),
                type: 'file',
                label: fileHandle.name,
                fullPath: '/' + fileHandle.name,
                file: () => {
                    return fileHandle.getFile();
                },
            };
            files.push(file);
        }
        return files.sort((a, b) => a.label.localeCompare(b.label));
    }

    async _listFilesByDirHandle(dirHandle: any, fileItems: FileItem[], parentPath: string) {
        for await (const [key, value] of dirHandle.entries()) {
            if (value instanceof FileSystemDirectoryHandle) {
                const file: FileItem = {
                    uuid: window.crypto.randomUUID(),
                    type: 'folder',
                    label: key,
                    fullPath: parentPath + '/' + key,
                    items: []
                };
                fileItems.push(file);
                await this._listFilesByDirHandle(value, file.items as FileItem[], file.fullPath);
            } else if (value instanceof FileSystemFileHandle) {
                const file: FileItem = {
                    uuid: window.crypto.randomUUID(),
                    type: 'file',
                    label: key,
                    fullPath: parentPath + '/' + key,
                    file: () => {
                        return value.getFile();
                    }
                };
                fileItems.push(file);
            }
        }
        fileItems.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1;
            } else {
                return a.label.localeCompare(b.label);
            }
        });
    }
}

export const fileUtils = new FileUtils();
