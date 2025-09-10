export interface QuestionItem {
  id: string;
  text: string;
}

export const QuestionBank = {
  questions: {
    "01": "(2+(((8/2)+2)/2))/5",
    "02": "(6/(5-3))/((7+2)/3)",
    "03": "(10/(4-(6/3)))-(8/2)",
    "04": "3-((12/((7+2)/3))/2)",
    "05": "(5-3)/(6/((11-5)/2))",

    "06": "((3+(((6/2)+1)/4))/2)",
    "07": "((6/2)+5)/(4/(6-5))",
    "08": "(12/(7-(10/2)))-(12/3)",
    "09": "8-((12/(4/2))/(2-1))",
    "10": "(3+5)/(8/((7-3)/2))",

    "11": "(5+((5-(8/4))/3))/2",
    "12": "(2+(14/2))/((4+2)/2)",
    "13": "(10/(8/(9-5)))-(6/3)",
    "14": "7-(12/((6/2)/(4-3)))",
    "15": "(12+3)/(10/((9-3)/3))",

    "16": "(4+(((6/2)+5)/2))/2",
    "17": "(16/(6-4))/((8-2)/3)",
    "18": "(12/(8/2))+(8/(3+5))",
    "19": "10-((12/(6/3))/(3-2))",
    "20": "(5+11)/(8/((6-2)/2))"
  },
  answers: {
    "01": "1",
    "02": "1",
    "03": "1",
    "04": "1",
    "05": "1",

    "06": "2",
    "07": "2",
    "08": "2",
    "09": "2",
    "10": "2",

    "11": "3",
    "12": "3",
    "13": "3",
    "14": "3",
    "15": "3",

    "16": "4",
    "17": "4",
    "18": "4",
    "19": "4",
    "20": "4",
  },
}

export const trainingBank = {
  questions: {
    "01": "1+3",
    "02": "7-5",
    "03": "6/2",
    "04": "(2+6)/8",
    "05": "(5+(4+(3+(2+1))))-14",
    "06": "(12/(6/(2+1)))-4",
    "07": "8-5",
    "08": "(2+2)/2",
    "09": "(2+6)/(7-5)",
    "10": "(18-9)/(12/(8/2))",
  },
  answers: {
    "01": "4",
    "02": "2",
    "03": "3",
    "04": "1",
    "05": "1",
    "06": "2",
    "07": "3",
    "08": "2",
    "09": "4",
    "10": "3",
  },
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function toLatexSimple(input: string): string {
  let s = input.trim()
  while (s.includes('/')) {
    const idx = s.indexOf('/')
    let i = idx - 1
    while (i >= 0 && s[i] === ' ') i--
    let Lstart = i
    if (s[i] === ')') {
      let depth = 1; i--
      while (i >= 0 && depth) {
        if (s[i] === ')') depth++
        else if (s[i] === '(') depth--
        i--
      }
      Lstart = i + 1
    } else {
      while (i >= 0 && /[A-Za-z0-9]/.test(s[i])) i--
      Lstart = i + 1
    }
    const Lend = idx
    i = idx + 1
    while (i < s.length && s[i] === ' ') i++
    let Rend = i
    if (s[Rend] === '(') {
      let depth = 1; Rend++
      while (Rend < s.length && depth) {
        if (s[Rend] === '(') depth++
        else if (s[Rend] === ')') depth--
        Rend++
      }
    } else {
      while (Rend < s.length && /[A-Za-z0-9]/.test(s[Rend])) Rend++
    }
    const L = s.slice(Lstart, Lend).trim()
    const R = s.slice(i, Rend).trim()
    s = s.slice(0, Lstart) + `\\frac{${L}}{${R}}` + s.slice(Rend)
  }
  return s.replace(/\*/g, '\\cdot ')
}

export async function fetchQuestionItems(): Promise<QuestionItem[]> {
  const questionKeys = Object.keys(QuestionBank.questions)

  const shuffledRaw = shuffle(questionKeys)
  const shuffledLatex = shuffle(questionKeys)

  const rawItems = shuffledRaw.map((key) => ({
    id: `01${key.padStart(2, '0')}`,
    text: QuestionBank.questions[key as keyof typeof QuestionBank.questions],
  }))

  const latexItems = shuffledLatex.map((key) => ({
    id: `02${key.padStart(2, '0')}`,
    text: toLatexSimple(
      QuestionBank.questions[key as keyof typeof QuestionBank.questions]
    ),
  }))

  return [...rawItems, ...latexItems]
}

/**
 * Getter for training questions—returns the same set twice:
 * once as raw strings and once converted to LaTeX.
 */
export async function fetchTrainingItems(): Promise<QuestionItem[]> {
  const keys = Object.keys(trainingBank.questions)

  const shuffledRaw = shuffle(keys)
  const shuffledLatex = shuffle(keys)

  const rawItems = shuffledRaw.map((key) => ({
    id: `01${key.padStart(2, '0')}`,
    text: trainingBank.questions[key as keyof typeof trainingBank.questions],
  }))

  const latexItems = shuffledLatex.map((key) => ({
    id: `02${key.padStart(2, '0')}`,
    text: toLatexSimple(
      trainingBank.questions[key as keyof typeof trainingBank.questions]
    ),
  }))

  return [...rawItems, ...latexItems]
}
