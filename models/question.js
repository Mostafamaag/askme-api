const sequelize = require('../utils/database');
const Sequelize = require('sequelize');


const Question = sequelize.define('question', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    questionText: {
        type: Sequelize.TEXT,
        allowNull: false
    },
})

module.exports = Question;

// const fs = require('fs/promises');
// const path = require('path');
// const Answer = require('./answers')

// const root = path.dirname(require.main.filename);
// const p = path.join(root, 'data', 'questions.json');

// const getQuestionsFromFile = async () => {

//     try {
//         const data = await fs.readFile(p, 'utf-8');
//         return JSON.parse(data)
//     }
//     catch (err) {
//         console.error(err);
//         return [];
//     }

// }

// class Question {

//     constructor(id = null, question) {
//         this.id = id;
//         this.question = question;
//     }

//     static async fetchAll() {
//         const data = await getQuestionsFromFile();
//         //if (!data) console.log(data);
//         return data;
//     }

//     async save() {
//         const questionsData = await getQuestionsFromFile();

//         if (!this.id) {
//             this.id = Math.floor(Math.random() * 1000);
//             questionsData.push({ id: this.id, question: this.question });
//         }
//         else {

//             const updatedQuestionIndex = questionsData.findIndex(qs => qs.id === this.id);
//             questionsData[updatedQuestionIndex].id = this.id;
//             questionsData[updatedQuestionIndex].question = this.question;
//         }
//         console.log(questionsData);
//         try {
//             await fs.writeFile(p, JSON.stringify(questionsData));
//         }
//         catch (err) {
//             console.log("question no added ", "Error", err);
//         }
//     }

//     static async deleteById(id) {
//         const questionsData = await getQuestionsFromFile();
//         const updatedQuestions = questionsData.filter(qs => qs.id !== id);

//         try {
//             await fs.writeFile(p, JSON.stringify(updatedQuestions));
//         }
//         catch (err) {
//             console.log("question not deleted ", "Error", err);
//         }
//         Answer.deleteById(null, id);
//     }

//     static async getById(id) {
//         const questions = await getQuestionsFromFile();
//         const question = questions.find(qs => qs.id === id);
//         console.log(questions);
//         return question;
//     }

// }

// module.exports = Question

