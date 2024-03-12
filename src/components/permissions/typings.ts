export interface Menu {
    id: number
    select: boolean,
    apis: Api[],
    children: Menu[],
}

export interface Api {
    id: number
    name: string
    select: boolean
}
