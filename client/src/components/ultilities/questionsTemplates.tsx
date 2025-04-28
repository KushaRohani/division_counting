

export enum GroupEnum {
  string = 0,
  latex  = 1,
}

// KUSHA SHIT

export const BinaryExpression = {
  DIV: "/",
  PLUS: "+",
  MINUS: "-",
  MULTIPLY: "*",
}


export const getQuestions = (totalDivisions: number) => {
  return DivisorWithX(totalDivisions)
}


const DivisorWithX = (TotalDivisions: number) => {
  
  const XFirst: boolean = Math.floor(Math.random() * 2) == 0; // Random number between (0,1) inclusive. Use to randomly choose between true or false
  if (TotalDivisions == 1) {  // if total divisions is 1, return one division with x either on top or bottom.
    if (XFirst) {
      return "( x / b )"; 
    } else {
      return "( a / x )"; 
    }
    
  } else if (TotalDivisions == 0) {
    return "x"
  } // If the total divisions is 0, return a.


  const m: number = Math.floor(Math.random() * (TotalDivisions - 1)) + 1; // Random number between (0,totalDivisions) not inclusive.
  
  
  const expressions = Object.values(BinaryExpression);
  const randomIndex = Math.floor(Math.random() * expressions.length);
  const randomExpression = expressions[randomIndex]; // Randomly choose an expression from the BinaryExpression object.
  
  if (randomExpression == BinaryExpression.DIV) {
    TotalDivisions = TotalDivisions - 1; // If the expression is division, we need to subtract 1 from the total divisions to avoid division by zero.
  }

  const n: number = TotalDivisions - m; // The other number to make the total divisions.

  let leftSide: string = ""; // The left side of the expression.
  let rightSide: string = ""; // The right side of the expression.

  if (XFirst) {
    leftSide = DivisorWithX(m) 
    rightSide = DivisorWithoutX(n)
  } else {
    leftSide = DivisorWithoutX(n)
    rightSide = DivisorWithX(m) 
  }

  if (randomExpression == BinaryExpression.DIV) {
    leftSide = "( " + leftSide; // If the expression is division, we need to add parentheses to the left side.
    rightSide = rightSide + " )"; // Add parentheses to the right side.
  }


  return leftSide + " " + randomExpression + " " + rightSide; // Return the expression.
}

const DivisorWithoutX = (TotalDivisions: number) => {
  
  if (TotalDivisions == 1) {
    return "( a / b )"; // If the total divisions is 1, return 1.
  } else if (TotalDivisions == 0) {
    return "a"
  } // If the total divisions is 0, return a.


  const m: number = Math.floor(Math.random() * (TotalDivisions - 1)) + 1; // Random number between (0,totalDivisions) not inclusive.
  
  const expressions = Object.values(BinaryExpression);
  const randomIndex = Math.floor(Math.random() * expressions.length);
  const randomExpression = expressions[randomIndex]; // Randomly choose an expression from the BinaryExpression object.
  
  if (randomExpression == BinaryExpression.DIV) {
    TotalDivisions = TotalDivisions - 1; // If the expression is division, we need to subtract 1 from the total divisions to avoid division by zero.
  }

  const n: number = TotalDivisions - m; // The other number to make the total divisions.

  let leftSide: string = DivisorWithoutX(m); // The left side of the expression.
  let rightSide: string = DivisorWithoutX(n); // The right side of the expression.

  if (randomExpression == BinaryExpression.DIV) {
    leftSide = "( " + leftSide; // If the expression is division, we need to add parentheses to the left side.
    rightSide = rightSide + " )"; // Add parentheses to the right side.
  }
  

  return leftSide + " " + randomExpression + " " + rightSide; // Return the expression.
}


export function countXDivisions(expr: string): number {
  // tokenize into identifiers, parens and operators
  const tokens = expr.match(/[A-Za-z]+|[()+\-*/]/g)!;


  let pos = 0;
  const peek = () => tokens[pos];
  const consume = (expect?: string) => {
    const tok = tokens[pos++];
    if (expect && tok !== expect) {
      throw new Error(`Expected '${expect}' but got '${tok}'`);
    }
    return tok;
  };

  type Node =
    | { type: 'id'; name: string }
    | { type: 'op'; op: string; left: Node; right: Node };

  // Grammar:
  // Expr → Term (('+'|'-') Term)*
  // Term → Factor (('*'|'/') Factor)*
  // Factor → Identifier | '(' Expr ')'
  function parseExpr(): Node {
    let node = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume()!;
      node = { type: 'op', op, left: node, right: parseTerm() };
    }
    return node;
  }

  function parseTerm(): Node {
    let node = parseFactor();
    while (peek() === '*' || peek() === '/') {
      const op = consume()!;
      node = { type: 'op', op, left: node, right: parseFactor() };
    }
    return node;
  }

  function parseFactor(): Node {
    if (peek() === '(') {
      consume('(');
      const node = parseExpr();
      consume(')');
      return node;
    }
    // identifier
    const name = consume()!;
    return { type: 'id', name };
  }

  const ast = parseExpr();

  // does this subtree contain an 'x' anywhere?
  function containsX(n: Node): boolean {
    if (n.type === 'id') return n.name === 'x';
    return containsX(n.left) || containsX(n.right);
  }

  // count every '/' whose LEFT subtree contains an 'x'
  function walk(n: Node): number {
    if (n.type === 'id') return 0;
    let cnt = 0;
    if (n.op === '/' && containsX(n.left)) cnt++;
    cnt += walk(n.left) + walk(n.right);
    return cnt;
  }

  return walk(ast);
}

/**
 * Convert every “a / b” (with nesting) into \frac{a}{b}, then “*” → “\cdot”.
 */
export function toLatexSimple(input: string): string {
  let s = input.trim();

  // Keep looping until there are no arithmetic slashes left
  while (s.includes('/')) {
    const slashIdx = s.indexOf('/');

    // 1) Find left operand [Lstart…Lend)
    let i = slashIdx - 1;
    while (i >= 0 && s[i] === ' ') i--;
    let Lend = i + 1, Lstart: number;
    if (s[i] === ')') {
      // match balanced parens
      let depth = 1; i--;
      while (i >= 0 && depth > 0) {
        if (s[i] === ')') depth++;
        else if (s[i] === '(') depth--;
        i--;
      }
      Lstart = i + 1;
    } else if (s[i] === '}') {
      // match balanced braces, and include preceding “\frac” if present
      let depth = 1; i--;
      while (i >= 0 && depth > 0) {
        if (s[i] === '}') depth++;
        else if (s[i] === '{') depth--;
        i--;
      }
      // check for “\frac” just before
      if (s.slice(i - 4 + 1, i + 1) === '\\frac') {
        Lstart = i - 4 + 1;
      } else {
        Lstart = i + 1;
      }
    } else {
      // bare var/number
      while (i >= 0 && /[A-Za-z0-9]/.test(s[i])) i--;
      Lstart = i + 1;
    }

    // 2) Find right operand (Rstart…Rend)
    i = slashIdx + 1;
    while (i < s.length && s[i] === ' ') i++;
    let Rstart = i, Rend: number;
    if (s[i] === '(') {
      let depth = 1; i++;
      while (i < s.length && depth > 0) {
        if (s[i] === '(') depth++;
        else if (s[i] === ')') depth--;
        i++;
      }
      Rend = i;
    } else {
      while (i < s.length && /[A-Za-z0-9]/.test(s[i])) i++;
      Rend = i;
    }

    // 3) Splice in the \frac{L}{R}
    const L = s.slice(Lstart, Lend).trim();
    const R = s.slice(Rstart, Rend).trim();
    const frac = `\\frac{${L}}{${R}}`;
    s = s.slice(0, Lstart) + frac + s.slice(Rend);
  }

  // 4) Finally swap * → \cdot
  return s.replace(/\*/g, '\\cdot ');
}