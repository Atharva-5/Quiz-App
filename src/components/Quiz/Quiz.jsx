import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
    const [quizData, setQuizData] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

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
                shuffled_answers: question.type === "boolean" ? ["True", "False"] : shuffleArray([...question.incorrect_answers, question.correct_answer])
            }));

            // Initialize selected answers for each question
            const initialSelectedAnswers = {};
            shuffledData.forEach((question, index) => {
                initialSelectedAnswers[index] = null;
            });

            setQuizData(shuffledData);
            setSelectedAnswers(initialSelectedAnswers);
            setSubmitted(false);
        }
        fetchQuizData();
    }, []);

    const handleAnswerClick = (index, clickedAnswer) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [index]: clickedAnswer
        }));
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    // Function to shuffle an array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const solvedCount = Object.values(selectedAnswers).filter(answer => answer !== null).length;
    const correctCount = quizData.filter((question, index) => selectedAnswers[index] === question.correct_answer).length;
    const incorrectCount = solvedCount - correctCount;

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
                                <li key={i} onClick={() => handleAnswerClick(index, answer)} className={selectedAnswers[index] === answer ? 'selected' : ''}>
                                    {answer}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {!submitted && (
                <button onClick={handleSubmit}>Submit</button>
            )}
            {submitted && (
                <div className="quiz-result">
                    <h2>Quiz Result</h2>
                    <div className="result-box">
                        <h3>Solved</h3>
                        <div className="count">{solvedCount}</div>
                    </div>
                    <div className="result-box">
                        <h3>Correct</h3>
                        <div className="count">{correctCount}</div>
                    </div>
                    <div className="result-box">
                        <h3>Incorrect</h3>
                        <div className="count">{incorrectCount}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
