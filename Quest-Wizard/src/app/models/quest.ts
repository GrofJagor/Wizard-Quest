export type QuestLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'DEADLY';


export interface Quest{
    id:number,
    title:string,
    level:QuestLevel,
    patron:string, //ce bude neki user
    description:string,
    reward:number,
    wizards:string[],
    status:string;
    open:boolean



}

