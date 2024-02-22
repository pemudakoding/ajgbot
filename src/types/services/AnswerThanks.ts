type AnswerThanks = {
    input: string,
    is_thanks: boolean,
    possible_answers: {text: string, context: string}[]
}

export default AnswerThanks