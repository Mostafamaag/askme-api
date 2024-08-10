const express = require('express')
const userController = require('../controllers/user');
const isAuthenticated = require('../middleware/authenticated');
const authorize = require('../middleware/authorized');
const ROLES = require('../utils/userRoles')
const router = express.Router();


router.get('/', isAuthenticated, userController.getFeed);
router.get('/feed', isAuthenticated, userController.getFeed); // not full implemented yet

router.get('/question/:id', isAuthenticated, userController.getQuestion);
router.get('/questions', isAuthenticated, userController.getQuestions)
router.get('/received-questions', isAuthenticated, userController.getReceivedQuestions)
router.post('/ask-question', isAuthenticated, authorize(ROLES.USER), userController.askQuestion);
router.put('/edit-question/:questionId', isAuthenticated, authorize(ROLES.USER), userController.editQuestion);
router.delete('/delete-question/:questionId', isAuthenticated, authorize(ROLES.ADMIN, ROLES.USER), userController.deleteQuestion);

router.get('/answers', isAuthenticated, userController.getAnswers);
router.get('/answer/:answerId', isAuthenticated, userController.getAnswer);
router.post('/answer-question/:questionId', isAuthenticated, authorize(ROLES.USER), userController.answerQuestion);
router.put('/edit-answer/:answerId', isAuthenticated, authorize(ROLES.USER), userController.editAnswer);
router.delete('/delete-answer/:answerId', isAuthenticated, authorize(ROLES.ADMIN, ROLES.USER), userController.deleteAnswer);

module.exports = router;