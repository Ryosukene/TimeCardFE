export type Task = {
    id: number
    title: string
    created_at: Date
    updated_at: Date
  }
  export type CsrfToken = {
    csrf_token: string
  }
  export type Credential = {
    email: string
    password: string
  }

  export type ClockInTime = {
    clock_in_time: string
  }

  export type ClockOutTime = {
    clock_out_time: string
  }

  export type User = {
    email: string
    password: string
    department: string  
    name: string
  }
