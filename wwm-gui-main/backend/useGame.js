import { useState, useEffect, useMemo } from "react";
import useBackend from "@/backend/useBackend";
import { getLanguage, useTranslation } from "react-multi-lang";
import { useAudioPlayer, useGlobalAudioPlayer } from "react-use-audio-player";

/**
 *
 * @param {"quick-game" | "train" | "latest-show" | "game-of-the-day"} type
 * @param {string[]} categories
 * @param {number} displayResultTimeoutLength
 *
 * @returns {{
 *  gameState: "loading",
 *  errorId: string,
 *  reload: () => void
 * } | {
 *  correctAnswers: number,
 *  difficulty: number,
 *  scoringDisabled: boolean,
 *  gameState: "running" | "finished",
 *  questionIndex: number,
 *  question: string,
 *  answers: string[],
 *  displayResultOfQuestion: boolean,
 *  selectedAnswerIndex: number | null,
 *  correctAnswerIndex: number,
 *  jokerMessage: string | null,
 *  audienceVoting: number[] | null,
 *  score: number,
 *  subtext: string,
 *  usedFiftyFiftyJoker: boolean,
 *  usedPhoneJoker: boolean,
 *  usedPersonFromAudienceJoker: boolean
 *  usedAudienceJoker: boolean,
 *  useFiftyFiftyJoker: () => void,
 *  usePhoneJoker: () => void,
 *  usePersonFromAudienceJoker: () => void,
 *  useAudienceJoker: () => void,
 *  selectAnswer: (index: number) => void,
 *  showContinueWithoutScoringPopup: () => void,
 *  continueWithoutScoring: () => void,
 *  end: () => void,
 * }}
 */
export default function (type, categories, displayResultTimeoutLength = 2000) {
	const backend = useBackend();
	const { paused } = useGlobalAudioPlayer();
	const correctSound = useAudioPlayer();
	const wrongSound = useAudioPlayer();

	useEffect(() => {
		correctSound.load("/sound/correct_answer.mp3");
		wrongSound.load("/sound/wrong_answer.mp3");
	}, []);

	const t = useTranslation();

	const [gameState, setGameState] = useState("loading");

	// Controls whether the result of the question is displayed (right answer -> green, wrong answer -> red + result table)
	const [displayResultOfQuestion, setDisplayResultOfQuestion] =
		useState(false);

	// Score
	const [score, setScore] = useState(0);
	const [subtext, setSubtext] = useState(null);
	const [scoringDisabled, setScoringDisabled] = useState(type === "train");
	const [correctAnswers, setCorrectAnswers] = useState(0);

	// Popup
	const [
		showContinueWithoutScoringPopup,
		setShowContinueWithoutScoringPopup,
	] = useState(false);

	// Load questions from backend
	const [questions, setQuestions] = useState([]);
	const [errorId, setErrorId] = useState(null);

	// Fifty fifty joker
	const [usedFiftyFiftyJoker, setUsedFiftyFiftyJoker] = useState(false);
	const [showAnswer, setShowAnswer] = useState([true, true, true, true]);

	// Phone or person from audience joker
	const [usedPhoneJoker, setUsedPhoneJoker] = useState(false);
	const [usedPersonFromAudienceJoker, setUsedPersonFromAudienceJoker] =
		useState(false);
	const [jokerMessage, setJokerMessage] = useState(null);

	// Audience joker
	const [usedAudienceJoker, setUsedAudienceJoker] = useState(false);
	const [audienceVoting, setAudienceVoting] = useState(null);

	// State that determines which question is currently displayed and which answer is selected
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
	const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

	useMemo(() => {
		if (questions.length === 0) return null;

		setJokerMessage(null);
		setAudienceVoting(null);
		setSelectedAnswerIndex(null);
		setShowAnswer([true, true, true, true]);
		setDisplayResultOfQuestion(false);
	}, [currentQuestionIndex]);

	async function loadQuestions() {
		setGameState("loading");
		setErrorId(null);
		setQuestions(null);
		const result = await backend.getQuestions(type, categories);

		if (result.success) {
			for (let i = 0; i < result.questions.length; i++) {
				const randomIndex = Math.floor(Math.random() * 4);
				const correctAnswer = result.questions[i].answers[0];
				result.questions[i].answers[0] =
					result.questions[i].answers[randomIndex];
				result.questions[i].answers[randomIndex] = correctAnswer;
				result.questions[i].correctAnswerIndex = randomIndex;
			}
			setQuestions(result.questions);
			setCurrentQuestionIndex(0);
			setGameState("running");
		} else {
			setErrorId(result.error_id);
		}
	}

	useEffect(() => {
		loadQuestions();
	}, []);

	function useFiftyFiftyJoker() {
		if (usedFiftyFiftyJoker) return;
		setUsedFiftyFiftyJoker(true);

		const newShowAnswer = [false, false, false, false];

		newShowAnswer[
			questions[currentQuestionIndex].correctAnswerIndex
		] = true;
		let randomWrongAnswerIndex =
			questions[currentQuestionIndex].correctAnswerIndex;
		do {
			randomWrongAnswerIndex = Math.floor(Math.random() * 4);
			newShowAnswer[randomWrongAnswerIndex] = true;
		} while (
			randomWrongAnswerIndex ===
			questions[currentQuestionIndex].correctAnswerIndex
		);

		setAudienceVoting(null);
		setJokerMessage(null);
		setShowAnswer(newShowAnswer);
	}

	function usePhoneJoker() {
		if (usedPhoneJoker) return;
		setUsedPhoneJoker(true);

		const randomIndex = Math.floor(Math.random() * 6);
		setAudienceVoting(null);
		setJokerMessage(
			t("jokerTip." + randomIndex, {
				letter: String.fromCharCode(
					65 + questions[currentQuestionIndex].correctAnswerIndex
				),
			})
		);
	}

	function usePersonFromAudienceJoker() {
		if (usedPersonFromAudienceJoker) return;
		setUsedPersonFromAudienceJoker(true);

		const randomIndex = Math.floor(Math.random() * 6);
		setAudienceVoting(null);
		setJokerMessage(
			t("jokerTip." + randomIndex, {
				letter: String.fromCharCode(
					65 + questions[currentQuestionIndex].correctAnswerIndex
				),
			})
		);
	}

	function useAudienceJoker() {
		if (usedAudienceJoker) return;
		setUsedAudienceJoker(true);

		const voting = [0, 0, 0, 0];
		const correctAnswerIndex =
			questions[currentQuestionIndex].correctAnswerIndex;

		for (let i = 0; i < voting.length; i++) {
			if (i === correctAnswerIndex) {
				voting[i] = Math.floor(Math.random() * 70) + 30;
			} else if (showAnswer[i]) {
				voting[i] = Math.floor(Math.random() * 40) + 20;
			}
		}

		setJokerMessage(null);
		setAudienceVoting(voting);
	}

	function next(newScore) {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			end(newScore);
		}
	}

	function selectAnswer(index) {
		let newScore = score;
		if (selectedAnswerIndex !== null || !showAnswer[index]) return;
		setSelectedAnswerIndex(index);
		if (index === questions[currentQuestionIndex].correctAnswerIndex) {
			if (!scoringDisabled) {
				setScore(questions[currentQuestionIndex].difficulty);
				newScore = questions[currentQuestionIndex].difficulty;
			}
			setCorrectAnswers(correctAnswers + 1);
			if (!paused) correctSound.play();
		} else {
			if (!paused) wrongSound.play();
		}
		setDisplayResultOfQuestion(true);
		setTimeout(() => {
			if (
				!scoringDisabled &&
				index !== questions[currentQuestionIndex].correctAnswerIndex
			) {
				setShowContinueWithoutScoringPopup(true);
			} else {
				next(newScore);
			}
		}, displayResultTimeoutLength);
	}

	function continueWithoutScoring() {
		setScoringDisabled(true);
		setShowContinueWithoutScoringPopup(false);
		next();
	}

	function end(newScore) {
		let finalScore = newScore || score;
		if (finalScore > 0) backend.uploadGameResult(finalScore);
		let newSubtext;
		if (finalScore === 0) {
			newSubtext = "subtext.nothing";
		} else if (finalScore <= 1000) {
			newSubtext = "subtext.low";
		} else if (finalScore <= 32000) {
			newSubtext = "subtext.medium";
		} else if (finalScore <= 125000) {
			newSubtext = "subtext.high";
		} else if (finalScore <= 500000) {
			newSubtext = "subtext.very_high";
		} else {
			newSubtext = "subtext.million";
		}
		setSubtext(newSubtext);
		setShowContinueWithoutScoringPopup(false);
		setGameState("finished");
	}

	if (gameState === "loading")
		return {
			gameState,
			errorId,
			reload: () => {
				setErrorId(null);
				setGameState("loading");
				setTimeout(() => {
					loadQuestions();
				}, 1000);
			},
		};

	return {
		correctAnswers,
		difficulty: questions[currentQuestionIndex].difficulty,
		scoringDisabled,
		gameState,
		questionIndex: currentQuestionIndex,
		question: questions[currentQuestionIndex].question[getLanguage()],
		answers: questions[currentQuestionIndex].answers.map(
			(answer, index) => {
				if (showAnswer[index]) return answer[getLanguage()];
				else return "";
			}
		),
		displayResultOfQuestion,
		selectedAnswerIndex,
		correctAnswerIndex: questions[currentQuestionIndex].correctAnswerIndex,
		jokerMessage,
		audienceVoting,
		score,
		subtext,
		useFiftyFiftyJoker,
		usedFiftyFiftyJoker,
		usePhoneJoker,
		usedPhoneJoker,
		usePersonFromAudienceJoker,
		usedPersonFromAudienceJoker,
		useAudienceJoker,
		usedAudienceJoker,
		selectAnswer,
		showContinueWithoutScoringPopup,
		continueWithoutScoring,
		end,
	};
}
