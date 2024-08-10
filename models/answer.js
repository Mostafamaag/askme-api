const sequlize = require('../utils/database');
const Sequelize = require('sequelize');


const Answer = sequlize.define('answer', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    answerText: {
        type: Sequelize.TEXT,
        allowNull: false
    },
})

module.exports = Answer;

// const fs = require('fs/promises');
// const path = require('path');

// const root = path.dirname(require.main.filename);
// const p = path.join(root, 'data', 'answers.json');

// const getAnswersFromFile = async () => {

//     try {
//         const data = await fs.readFile(p, 'utf-8');
//         return JSON.parse(data)
//     }
//     catch (err) {
//         console.error("weeeeeeeeeeeee", err);
//         return [];
//     }

// }

// class Answer {
//     constructor(id = null, answer, questionId) {
//         this.id = id;
//         this.questionId = questionId;
//         this.answer = answer
//     }

//     static async fetchAll() {
//         const answers = await getAnswersFromFile();
//         return answers;
//     }

//     async save() {
//         const answersData = await getAnswersFromFile();
//         console.log(this);
//         if (!this.id) {
//             this.id = Math.floor(Math.random() * 1000);
//             answersData.push({ id: this.id, questionId: this.questionId, answer: this.answer });
//         }
//         else {
//             const updatedAnswerIndex = answersData.findIndex(ans => ans.id === this.id)
//             console.log(this.id);
//             answersData[updatedAnswerIndex].id = this.id;
//             answersData[updatedAnswerIndex].questionId = this.questionId;
//             answersData[updatedAnswerIndex].answer = this.answer;
//         }

//         try {
//             await fs.writeFile(p, JSON.stringify(answersData));
//         }
//         catch (err) {
//             console.log("Answer to added", "Error", err);
//         }
//     }

//     static async deleteById(id, qsId = null) {
//         const answersData = await getAnswersFromFile();

//         let updatedAnswers;
//         if (qsId) {
//             updatedAnswers = answersData.filter(ans => ans.questionId !== qsId);
//         }
//         else {
//             updatedAnswers = answersData.filter(ans => ans.id !== id);
//         }

//         try {
//             await fs.writeFile(p, JSON.stringify(updatedAnswers));
//         }
//         catch (err) {
//             console.log("answer not deleted ", "Error", err);
//         }
//     }

//     static async getById(id, qsId = null) {

//         const answers = await getAnswersFromFile();
//         let answer;
//         if (qsId) {
//             answer = answers.find(ans => ans.questionId === qsId);
//         }
//         else {
//             answer = answers.find(ans => ans.id === id);
//         }
//         return answer;
//     }
// }
// module.exports = Answer
