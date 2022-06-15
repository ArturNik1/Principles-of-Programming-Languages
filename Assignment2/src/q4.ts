import { map } from 'ramda';
import { AppExp, Binding, CExp, Exp, isAppExp, isBoolExp, isDefineExp, isIfExp, isLetExp, isLitExp, isNumExp, isPrimOp, isProcExp, isProgram, isStrExp, isVarRef, LetExp, LitExp, parseL3, PrimOp, ProcExp, Program, VarDecl } from '../imp/L3-ast';
import { isSymbolSExp, valueToString } from '../imp/L3-value';
import { Result, makeOk } from '../shared/result';

/*
Purpose: Transform L3 AST to JavaScript program string
Signature: l30ToJS(l2AST)
Type: [EXP | Program] => Result<string>
*/
export const l30ToJS = (exp: Exp | Program): Result<string> =>
    makeOk(unparseL3Q4(exp));

export const unparseL3Q4 = (exp: Program | Exp): string =>
    isBoolExp(exp) ? valueToString(exp.val) :
    isNumExp(exp) ? valueToString(exp.val) :
    isStrExp(exp) ? valueToString(exp.val) :
    isLitExp(exp) ? unparseLitExp(exp) :
    isVarRef(exp) ?  exp.var :
    isProcExp(exp) ? unparseProcExp(exp) :
    isIfExp(exp) ? `(${unparseL3Q4(exp.test)} ? ${unparseL3Q4(exp.then)} : ${unparseL3Q4(exp.alt)})` :
    isAppExp(exp) ? unparseAppExp(exp) :
    isPrimOp(exp) ? convertPrim(exp.op) :
    isLetExp(exp) ? unparseLetExp(exp) :
    isDefineExp(exp) ? `const ${exp.var.var} = ${unparseL3Q4(exp.val)}` :
    isProgram(exp) ? map(unparseL3Q4, exp.exps).join(";\n") :
    exp;

const unparseAppExp = (ae: AppExp): string =>
    isPrimOp(ae.rator) ? applyPrimOp(ae.rator, ae.rands) :
    `${unparseL3Q4(ae.rator)}(${map(unparseL3Q4, ae.rands).join(",")})`;

const unparseLitExp = (le: LitExp): string =>
    isSymbolSExp(le.val) ? `Symbol.for("${valueToString(le.val)}")` : 
    `${le.val}`;

const unparseProcExp = (pe: ProcExp): string =>
    `((${map((e: VarDecl) => e.var, pe.args).join(",")}) => ${unparseL3Q4(pe.body[pe.body.length-1])})`

const unparseLetExp = (le: LetExp): string =>
    `((${map((b: Binding) => b.var.var, le.bindings).join(",")}) => ${unparseL3Q4(le.body[0])})(${map((b: Binding) => unparseL3Q4(b.val), le.bindings).join(",")})`;

const convertPrim = (op: string): string =>
    op === "=" || op === "eq?" || op === "string=?" ? "===" :
    op === "number?" ? `((x) => (typeof (x) === number))` :
    op === "boolean?" ? `((x) => (typeof (x) === boolean))` :
    op === "symbol?" ? `((x) => (typeof (x) === symbol))` :
    op === "string?" ? `((x) => (typeof (x) === string))` :
    op === "not" ? `!` :
    op === "and" ? `&` :
    op === "or" ? '|' :
    op;

const applyPrimOp = (rator: PrimOp, rands: CExp[]): string =>
    rator.op === "not" ? `(!${unparseL3Q4(rands[0])})` :
    rator.op === "and" || rator.op === "or" ? `(${map((c: CExp) => {unparseL3Q4(c)}, rands).join(convertPrim(rator.op))})` :
    rator.op === "number?" || rator.op === "boolean?" || rator.op === "symbol?" || rator.op === "string?" ?  `(${convertPrim(rator.op)}(${rands[0]})` :
    `(${map(unparseL3Q4, rands).join(" " + convertPrim(rator.op) + " ")})`;