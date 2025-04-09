export interface User {
    id: string;
    id_number: string;
    id_type: 'CC' | 'CE' | string;
    names: string;
    last_names: string;
    email: string;
    password: string;
    temp_password: boolean;
    gender: 'M' | 'F';
    address: string;
    wrong_login_attempts: number;
    status: string;
    role_id: string;
    created_at: Date; // ISO date string
    updated_at: Date; // ISO date string
    deleted_at?: Date; // ISO date string, optional
}
