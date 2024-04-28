import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [quizData, setQuizData] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

    useEffect(() => {
        async function fetchQuizData() {
            const apiUrl = 'https://opentdb.com/api.php?amount=10&category=18';
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log(data);
            // Decode the URL encoded data here
            const decodedData = data.results.map(question => ({
                ...question,
                question: decodeURIComponent(question.question),
                incorrect_answers: question.incorrect_answers.map(answer => decodeURIComponent(answer)),
                correct_answer: decodeURIComponent(question.correct_answer)
            }));
            // Shuffle the answer choices for each question
            const shuffledData = decodedData.map(question => ({
                ...question,
                shuffled_answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
            }));
            setQuizData(shuffledData);
        }
        fetchQuizData();
    }, []);

    const handleAnswerClick = (clickedAnswer, correctAnswer) => {
        setSelectedAnswer(clickedAnswer);
        // Check if the clicked answer is correct
        if (clickedAnswer === correctAnswer) {
            setIsAnswerCorrect(true);
        } else {
            setIsAnswerCorrect(false);
        }
    };

    // Function to shuffle an array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <div className="quiz-app">
            <h1>Quiz Questions</h1>
            <div className="quiz-questions">
                {quizData.map((question, index) => (
                    <div key={index} className="question">
                        <h2>Question {index + 1}:</h2>
                        <p>{question.question}</p>
                        <ul>
                            {question.shuffled_answers.map((answer, i) => (
                                <li key={i} onClick={() => handleAnswerClick(answer, question.correct_answer)} className={selectedAnswer === answer ? (answer === question.correct_answer ? 'correct' : 'incorrect') : ''}>
                                    {answer}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Quiz;
