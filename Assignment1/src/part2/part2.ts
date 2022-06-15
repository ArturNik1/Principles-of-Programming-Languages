import * as R from "ramda";

const stringToArray = R.split("");

/* Question 1 */
export const countLetters: (s: string) => {[key:string]:number} = (s:string) : {[key:string]:number} => {
    const f: (x: string) => {[key:string]:number} = R.pipe((x:string) => 
    R.toLower(x),
    (x:string) => stringToArray(x).filter((x: string) => (x >= 'a' && x <= 'z')),
    (x:string[]) => x.reduce(
        (acc: { [key: string]: number }, cur: string) => {
            const val: number = acc[cur] + 1;
            return cur in acc ? R.mergeAll([{[cur]: val}, (R.pickBy((val:number, key:string|number) => key!=cur, acc))]) : R.mergeAll([acc, {[cur] : 1}]);
        }, {}
    ))
    return f(s);
};


/* Question 2 */
export const isPaired: (s: string) => boolean = (s:string):boolean=>{
    const arr: string[]= stringToArray(s);
    return recIsPaird([],arr);
}
export const recIsPaird:(stack:string[],arr:string[])=>boolean=(stack:string[],arr:string[]):boolean=>
{
    return (arr.length==0&&stack.length==0) ? true:(arr.length==0&&stack.length!=0 ? false :
                (isOpen(arr[0]) ? recIsPaird([arr[0]].concat(stack),arr.slice(1)):((isClose(
                    arr[0])?(stack.length==0||!isMatched(stack[0],arr[0])?false:recIsPaird(stack.slice(1),arr.slice(1))):recIsPaird(stack,arr.slice(1))))));
}

export const isOpen:(s:string)=>boolean=(s:string):boolean=>
{
    return (s == '(' || s == '{'||s=='[');
}
export const isClose:(s:string)=>boolean=(s:string):boolean=>
{
    return (s == ')' || s == '}'||s==']');
}
export const isMatched:(open:string,close:string)=>boolean=(open:string,close:string):boolean=>
{
    return ((open == '(' && close == ')' )|| (open == '{' && close == '}')||(open == '[' && close == ']'));
}



/* Question 3 */
export interface WordTree {
    root: string;
    children: WordTree[];
}

export const treeToSentence = (t: WordTree): string => {
    return recTree(t).slice(0, -1);
}


export const recTree : (t: WordTree) => string = (t: WordTree) : string => {
    const s: string = t.root + " " + t.children.reduce(
        (acc: string, current: WordTree) => {
            return current.children.length === 0 ? acc.concat(current.root + " ") : acc.concat(recTree(current));
        }, ""
    );
    return s;
}




