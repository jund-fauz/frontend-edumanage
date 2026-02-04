export type User = {
	email: string
}

export type Student = {
    id: number,
    name: string,
    address: string,
    birthday: string | Date,
    classroom_id: number
}

export type Teacher = {
    id: number,
    name: string,
    lessons: string[],
    classroom_id: number
}

export type Classroom = {
    id: number,
    name: string,
    teachers?: Teacher[],
    students?: Student[]
}