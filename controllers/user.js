
const Question = require('../models/question');
const Answer = require('../models/answer');
const User = require('../models/user');
const AppErr = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText');
const catchAsync = require('../middleware/catchAsync');


const getFeed = catchAsync(async (req, res, next) => {

    let feed;


    feed = await req.user.getReceivedQuestions({
        include: 'asker'
        // include:
        //     [{
        //         model: User,
        //         as: 'asker',
        //         attributes: ['username']
        //     }]
    });

    if (!feed.length) {
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: 'No questions received yet' });
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: feed });
})

const getReceivedQuestions = catchAsync(async (req, res, next) => {

    const limit = req.query.limit || 4;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const questions = await req.user.getReceivedQuestions({
        limit: limit,
        offset: skip
    });

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { questions: questions } })
})

const getQuestions = catchAsync(async (req, res, next) => {

    const questions = await req.user.getAskedQuestions();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { questions: questions } })
})

const getQuestion = catchAsync(async (req, res, next) => {
    const questionId = +req.params.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
        const error = new AppErr('No question found', httpStatusText.ERROR, 404);
        return next(error);
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { question: question } });
})

const askQuestion = catchAsync(async (req, res, next) => {
    const recipientId = req.body.recipientId;
    const questionText = req.body.question;


    const recipient = await User.findByPk(recipientId);
    if (!recipient) {
        const error = new AppErr('recipient not found', httpStatusText.FAIL, 404);
        return next(error);
    }

    const question = await req.user.createAskedQuestion({
        questionText: questionText, recipientId: recipientId
    });

    res.status(201).json({ status: httpStatusText.SUCCESS, data: { question: question } })
})

const editQuestion = catchAsync(async (req, res, next) => {
    const questionText = req.body.question;
    const questionId = +req.params.questionId;

    const question = await Question.findByPk(questionId);
    if (!question) {
        const error = new AppErr('No question found', httpStatusText.ERROR, 404);
        return next(error);
    }

    if (question.askerId !== req.user.id) {
        const error = new AppErr('You are not authorized', httpStatusText.FAIL, 403);
        return next(error);
    }

    question.questionText = questionText;
    await question.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { question: question } });
})

const deleteQuestion = catchAsync(async (req, res, next) => {

    const questionId = +req.params.questionId;

    const question = await Question.findByPk(questionId);
    if (!question) {
        const error = new AppErr('No question found', httpStatusText.ERROR, 404);
        return next(error);
    }

    if (question.recipientId !== req.userId && req.user.role != 'admin') {
        const error = new AppErr('You are not authorized', httpStatusText.FAIL, 403);
        return next(error);
    }

    await question.destroy();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });

})

const getAnswers = catchAsync(async (req, res, next) => {

    const answers = await req.user.getAnswers();
    if (!answers) {
        const error = new AppErr('No Asked Questions', httpStatusText.FAIL, 404);
        return next(error);
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { answers: answers } })
})

const getAnswer = catchAsync(async (req, res, next) => {
    const answerId = +req.params.answerId;

    const answer = await Answer.findByPk(answerId);
    if (!answer) {
        const error = new AppErr('No answer found', httpStatusText.ERROR, 404);
        return next(error);
    }

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { answer: answer } });
})

const answerQuestion = catchAsync(async (req, res, next) => {
    const questionId = +req.params.questionId;
    const answerText = req.body.answer;

    const question = await Question.findByPk(questionId);
    if (!question) {
        const error = new AppErr('Answer not found', httpStatusText.ERROR, 404);
        return next(error);
    }

    if (question.recipientId !== req.user.id) {
        const error = new AppErr('Not Authorized', httpStatusText.FAIL, 403);
        return next(error);
    }

    const answer = await req.user.createAnswer({ answerText: answerText, questionId: questionId });
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { answer: answer } });
})

const editAnswer = catchAsync(async (req, res, next) => {
    const answerId = +req.params.answerId;
    const updatedAnswer = req.body.answer;

    const answer = await Answer.findByPk(answerId);
    if (!answer) {
        const error = new AppErr('Answer not found', httpStatusText.ERROR, 404);
        return next(error);
    }

    if (answer.responderId !== req.user.id) {
        const error = new AppErr('Not Authorized', httpStatusText.FAIL, 403);
        return next(error);
    }

    answer.answerText = updatedAnswer;
    await answer.save();

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { answer: answer } });

})

const deleteAnswer = catchAsync(async (req, res, next) => {
    const answerId = +req.params.answerId;

    const answer = await Answer.findByPk(answerId);
    if (!answer) {
        const error = new AppErr('Answer not found', httpStatusText.ERROR, 404);
        return next(error);
    }

    if (answer.responderId !== req.user.id) {
        const error = new AppErr('Not Authorized', httpStatusText.FAIL, 403);
        return next(error);
    }

    await answer.destroy();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
})


module.exports = {
    askQuestion,
    deleteQuestion,
    getQuestions,
    editQuestion,
    getQuestion,
    getReceivedQuestions,

    getFeed,

    getAnswers,
    getAnswer,
    answerQuestion,
    deleteAnswer,
    editAnswer

}