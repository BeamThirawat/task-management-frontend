export interface IResponse<T> {
    code?: string;
    status?: string;
    message?: string;
    data?: T;
}
