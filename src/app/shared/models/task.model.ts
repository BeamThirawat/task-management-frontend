export interface ITask {
    id: number,
    title: string,
    description: string,
    status: string,
    startDate: string,
    user_id: number,
    folder_id: number
}

export class Task {
    public title?: string
    public description?: string
    public status?: string
    public folder_id?: number
    public startDate?: string 
}

export class GetTaskByStatus {
    public status?: string
}

export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}