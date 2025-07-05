export interface IUser {
    id: number,
    username: string,
    email: string,
    password: string,
    googleUser: boolean,
    google_id: string,
    created_at: string
}

export interface ILogin {
    id: number,
    username: string,
    email: string,
    token: string
}

export class Login {
    public email!: string;
    public password!: string;
}

export class Register {
    public username!: string;
    public email!: string;
    public password!: string;
}