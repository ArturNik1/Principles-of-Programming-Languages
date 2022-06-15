import {  Exp, LetExp, LetPlusExp, Program,Binding,CExp, makePrimOp, isLetExp, makeBinding, isLetPlusExp, isCExp, isDefineExp, makeDefineExp, isProgram, makeProgram,parseL31Exp} from "./L31-ast";
import { isAppExp, isBoolExp, isIfExp, isLitExp, isNumExp, isPrimOp, isProcExp, isStrExp, isVarRef ,unparseL31} from "./L31-ast";
import { makeAppExp, makeIfExp, makeProcExp, makeVarDecl, makeVarRef,makeLetExp } from "./L31-ast";
import { Result, makeFailure, makeOk,bind as bb, isOk } from "../shared/result";
import { bind, is, map } from "ramda";







export const RecPlusToLet :(bindings: Binding[], body: CExp[])=>LetExp=(bindings: Binding[], body: CExp[])=>
    bindings.length ===1 ? makeLetExp(bindings ,body) : makeLetExp([bindings[0]],[RecPlusToLet(bindings.slice(1),body)]);

export const LetPlusToLet :(exp:LetPlusExp)=>LetExp=(exp:LetPlusExp)=>
    RecPlusToLet(exp.bindings,exp.body);







export const RecConvert=(exp: CExp): CExp =>
   isBoolExp(exp) ? exp :
    isNumExp(exp) ? exp :
    isStrExp(exp) ? exp :
    isLitExp(exp) ? exp :
    isVarRef(exp) ? exp :
    isProcExp(exp) ? makeProcExp(exp.args,map((x:CExp)=>RecConvert(x),exp.body)):
    isIfExp(exp) ? makeIfExp(RecConvert(exp.test),RecConvert(exp.then),RecConvert(exp.alt)):
    isAppExp(exp)? makeAppExp(RecConvert(exp.rator),map((x:CExp)=>RecConvert(x),exp.rands)):
    isPrimOp(exp)? exp:
    isLetExp(exp)? makeLetExp(map((x:Binding)=>makeBinding(x.var.var,RecConvert(x.val)),exp.bindings),map((x:CExp)=>RecConvert(x),exp.body)):
    isLetPlusExp(exp)? RecConvert(LetPlusToLet(exp)):
    exp;

export const RecExp=(exp:Exp):Exp=>
    isCExp(exp) ? RecConvert(exp):
    isDefineExp(exp) ? makeDefineExp(exp.var,RecConvert(exp.val)):
    exp;

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/




export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
   isCExp(exp) ? makeOk(RecConvert(exp)):
    isDefineExp(exp) ? makeOk(makeDefineExp(exp.var,RecConvert(exp.val))):
    isProgram(exp) ? makeOk(makeProgram(map((x:Exp)=>RecExp(x),exp.exps))):
    exp;






    





