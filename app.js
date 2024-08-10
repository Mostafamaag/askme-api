require('dotenv').config()
const http = require('http');
const cors = require('cors');
const express = require('express');
const httpStatusText = require('./utils/httpStatusText');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');


const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const Question = require('./models/question');
const User = require('./models/user');
const Answer = require('./models/answer');


const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/', userRoutes);
app.use('/', authRoutes);


app.use((req, res) => {
    console.log(req.url);
    res.status(404).json({ stats: httpStatusText.ERROR, data: 'Invalid URL' })
})

// global error handling middleware
app.use((err, req, res, next) => {
    console.log()
    res.status(err.statusCode || 500).json({
        satuts: err.status || httpStatusText.ERROR,
        message: err.message || 'Internal Server Error',
        code: err.satutsCode
    })
})

// Define associations
User.hasMany(Question, { foreignKey: 'askerId', as: 'askedQuestions', onDelete: 'CASCADE' });
Question.belongsTo(User, { foreignKey: 'askerId', as: 'asker' });

User.hasMany(Question, { foreignKey: 'recipientId', as: 'receivedQuestions', onDelete: 'CASCADE' });
Question.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answer', onDelete: 'CASCADE' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' })

User.hasMany(Answer, { foreignKey: 'responderId', as: 'answers', onDelete: 'CASCADE' });
Answer.belongsTo(User, { foreignKey: 'responderId', as: 'responder' });


const server = http.createServer(app);


//sequelize.sync({ force: true })

sequelize.sync()
    .then(result => {
        server.listen(process.env.PORT || 3000, () => {
            console.log(`listening on port ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log(err)
    })



