import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [chosenLevel, setChosenLevel] = useState(undefined);
  const [words, setWords] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [clicked, setClicked] = useState([]);
  const [score, setScore] = useState(0);

  const getRandomWords = () => {
    const options = {
      method: "GET",
      url: "https://twinword-word-association-quiz.p.rapidapi.com/type1/",
      params: { level: chosenLevel, area: "sat" },
      headers: {
        "x-rapidapi-host": "twinword-word-association-quiz.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };

    axios
      .request(options)
      .then((response) => {
        // console.log(response.data);
        setWords(response.data.quizlist);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    if (chosenLevel) getRandomWords();
  }, [chosenLevel]);

  const checkAnswer = (option, optionIndex, correctAnswer) => {
    if (optionIndex + 1 == correctAnswer) {
      setCorrectAnswers([...correctAnswers, option]);
      setScore((score) => score + 1);
    } else {
      setIncorrectAnswers([...incorrectAnswers, option]);
      setScore((score) => score);
    }
    setClicked([...clicked, option]);
  };

  return (
    <div className="app">
      {!chosenLevel && (
        <div className="level-selector">
          <h1>Word Association Game App</h1>
          <p>Select Your level to start</p>
          <select
            name="levels"
            id="levels"
            value={chosenLevel}
            onChange={(e) => setChosenLevel(e.target.value)}
          >
            <option value={null}>Select a Level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
            <option value="6">Level 6</option>
            <option value="7">Level 7</option>
            <option value="8">Level 8</option>
            <option value="9">Level 9</option>
            <option value="10">Level 10</option>
          </select>
        </div>
      )}
      {chosenLevel && words && (
        <div className="question-area">
          <h1>Welcome to level: {chosenLevel}</h1>
          <h3>Your score is: {score}</h3>

          <div className="questions">
            {words.map((question, _questionIndex) => (
              <div className="question-box" key={_questionIndex}>
                {question.quiz.map((tip, _index) => (
                  <p key={_index}>{tip}</p>
                ))}
                <div className="question-buttons">
                  {question.option.map((option, optionIndex) => (
                    <div className="question-button" key={optionIndex}>
                      <button
                        disabled={  // if one of options is in 'clicked array - then the buttons disabled
                          clicked.includes(question.option[0]) ||
                          clicked.includes(question.option[1])
                        }
                        onClick={(e) => {
                          checkAnswer(option, optionIndex, question.correct);
                        }}
                      >
                        {option}
                      </button>
                      {correctAnswers.includes(option) && <p>Correct!</p>}
                      {incorrectAnswers.includes(option) && <p>Incorrect!</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setChosenLevel(undefined)}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default App;
