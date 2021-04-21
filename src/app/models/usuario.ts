import { Role } from '../models/role';

export class Usuario {

    id: number;
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[] = [];
}
