

export interface User {
    id: string;
    id_type: string;
    id_number: string;
    names: string;
    last_names: string;
    email: string;
    password: string;
    temp_password: boolean;
    phone: string;    
    address: string;
    gender: string;
    wrong_login_attempts: number;
    status: number;
    role: string;
    policies?: [];
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}
