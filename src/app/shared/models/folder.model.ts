export interface IFolder {
    folder_id: number,
    folder_name: string,
    description: string
}

export class Folder {
    public folder_name?: string
    public description?: string
}

export class GetFolder {
    public folder_id?: number
}