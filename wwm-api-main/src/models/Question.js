/**
 * Question model. An instance of this class represents a question.
 */
class Question {
    /**
     * Creates a new question. Does not validate the passed parameters.
     * @param {number | undefined} id the id of the question (use undefined if the question is not stored in the database yet)
     * @param {string | undefined} question_de the question in german
     * @param {string | undefined} right_answer_de the right answer in german
     * @param {string | undefined} answer1_de the first wrong answer in german
     * @param {string | undefined} answer2_de the second wrong answer in german
     * @param {string | undefined} answer3_de the third wrong answer in german
     * @param {string | undefined} question_en the question in english
     * @param {string | undefined} right_answer_en the right answer in english
     * @param {string | undefined} answer1_en the first wrong answer in english
     * @param {string | undefined} answer2_en the second wrong answer in english
     * @param {string | undefined} answer3_en the third wrong answer in english
     * @param {number | undefined} difficulty the difficulty of the question
     * @param {string | undefined} category the category of the question
     * @param {Date | undefined} creation_date the creation date of the question
     * @param {boolean | undefined} gameOfTheDay_question true if the question is part of the game of the day
     */
    constructor(
        id,
        question_de,
        right_answer_de,
        answer1_de,
        answer2_de,
        answer3_de,
        question_en,
        right_answer_en,
        answer1_en,
        answer2_en,
        answer3_en,
        difficulty,
        category,
        creation_date,
        gameOfTheDay_question
    ) {
        this.id = id;
        this.question_de = question_de;
        this.right_answer_de = right_answer_de;
        this.answer1_de = answer1_de;
        this.answer2_de = answer2_de;
        this.answer3_de = answer3_de;
        this.question_en = question_en;
        this.right_answer_en = right_answer_en;
        this.answer1_en = answer1_en;
        this.answer2_en = answer2_en;
        this.answer3_en = answer3_en;
        this.difficulty = difficulty;
        this.category = category;
        this.creation_date = creation_date;
        this.gameOfTheDay_question = gameOfTheDay_question;
    }

    static fromJSON(id, json) {
        return new Question(
            id,
            json.question?.de,
            json.answers?.[0]?.de,
            json.answers?.[1]?.de,
            json.answers?.[2]?.de,
            json.answers?.[3]?.de,
            json.question?.en,
            json.answers?.[0]?.en,
            json.answers?.[1]?.en,
            json.answers?.[2]?.en,
            json.answers?.[3]?.en,
            json.difficulty,
            json.category,
            undefined,
            undefined
        );
    }

    /**
     * Converts the question to a simplified JSON object.
     * @returns {Question} the question as JSON
     */
    toJSON() {
        const question = {
            id: this.id,
            question: {
                en: this.question_en,
                de: this.question_de,
            },
            answers: [
                {
                    en: this.right_answer_en,
                    de: this.right_answer_de,
                },
                {
                    en: this.answer1_en,
                    de: this.answer1_de,
                },
                {
                    en: this.answer2_en,
                    de: this.answer2_de,
                },
                {
                    en: this.answer3_en,
                    de: this.answer3_de,
                },
            ],
            category: this.category,
            difficulty: this.difficulty,
        };

        return question;
    }
}

module.exports = Question;
