export interface RegisterModel {
    username: string
    email: string
    name: string
    phone: string
    password: string
    role: 'user' | 'admin'
}
export interface LoginModel {
    username: string 
    password: string
}