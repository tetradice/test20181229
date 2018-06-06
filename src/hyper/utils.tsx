/** 指定回数の繰り返し */
export function loop(count: number, action: (index: number) => void): void{
    for(let i = 0; i < count; i++){
        action.call(this, i);
    }
}