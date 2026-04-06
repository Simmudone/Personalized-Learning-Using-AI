
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { auth, db } from "../firebase";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

import {
  GraduationCap,
  User,
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Assignment = () => {
  const { courseId, moduleId } = useParams();
  const isFinal = moduleId === "final";
  const navigate = useNavigate();
  const location = useLocation();
  const moduleTitle = location.state?.moduleTitle || "General Topic";
  const user = auth.currentUser;
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<any>({});
  const [theoryQuestions, setTheoryQuestions] = useState<any[]>([]);
  const [codingQuestions, setCodingQuestions] = useState<any[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallbackMode, setFallbackMode] = useState(false);
  const userName = localStorage.getItem("userName") || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!isFinal) {
      generate(); // module → auto load
    }
  }, []);
  const generate = async () => {
  setLoading(true);
  setScore(null);
  setAnswers({});
  setFallbackMode(false);

  try {
    // 🔥 ADD THIS CHECK FIRST
      if (!user?.uid) {
        alert("User not loaded. Please try again.");
        return;
      }
    // const response = await axios.post(
    //   "http://localhost:8080/api/assignment/generate",
    //   {
      
    //   moduleContent: moduleTitle,
    //   isFinal: moduleId === "final",
    //   userId: user?.uid || "student",
    //   }
    // );
    const response = await axios.post(
        "http://localhost:8080/api/assignment/generate",
        {
          moduleContent:
            moduleId === "final"
              ? "Course: " + moduleTitle + " programming coding algorithms"
              : moduleTitle,

          isFinal: moduleId === "final",

          userId: user.uid, // 🔥 remove "student" fallback
        }
      );

    let text = response.data.questions;

    console.log("RAW RESPONSE:", text); // 🔥 debug

    let cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleanText);

      setQuestions(parsed.mcqs || []);
      setCodingQuestions(parsed.coding || []);
      setTheoryQuestions(parsed.theory || []);
    } catch (e) {
      console.error("JSON PARSE ERROR:", e);
      console.log("RAW TEXT:", cleanText);

      setQuestions([]);
      setCodingQuestions([]);
    }

  } catch (error) {
    console.error("API ERROR:", error);

    // 🔥 FALLBACK MODE
    setFallbackMode(true);
    setQuestions([]);
    setCodingQuestions([]);
  }

  setLoading(false);
};
    const submit = async () => {
    let correct = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) {
        correct++;
      }
    });

    const percent = Math.round((correct / questions.length) * 100);
    setScore(percent);
    setShowResultPopup(true);
    if (!user) return;

    const enrollQuery = query(
      collection(db, "enrollments"),
      where("userId", "==", user.uid),
      where("courseId", "==", courseId)
    );

    const snap = await getDocs(enrollQuery);

    if (!snap.empty) {
      const enrollmentDoc = snap.docs[0];

      // 🔥 MODULE ASSIGNMENT
      if (!isFinal && percent >= 75) {
        const prevPassed =
          enrollmentDoc.data().assignmentPassedModules || [];

        await updateDoc(
          doc(db, "enrollments", enrollmentDoc.id),
          {
            assignmentPassedModules: [
              ...prevPassed,
              Number(moduleId),
            ],
          }
        );
      }

      // 🔥 FINAL ASSIGNMENT
      if (isFinal) {
        await updateDoc(
          doc(db, "enrollments", enrollmentDoc.id),
          {
            finalScore: percent,
            courseCompleted: percent >= 75, // ✅ MAIN LOGIC
          }
        );
      }
    }
  };

  if (loading && !isFinal) {
    return (
      <>
        {/* NAVBAR */}
        <nav className="border-b bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-blue-600" />
            <h1 className="text-lg font-semibold">
              Personalised Learning Path
            </h1>
          </div>
        </nav>

        <div className="flex justify-center mt-10 text-blue-600 text-lg">
          Generating AI Questions...
        </div>
      </>
    );
  }

  return (
    <>
      {/* 🔥 NAVBAR (NO COURSES / DASHBOARD) */}
      <nav className="border-b bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-blue-600" />
          <h1 className="text-lg font-semibold">
            Personalised Learning Path
          </h1>
        </div>

        {/* PROFILE */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{userName}</span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link to="/" className="flex items-center gap-2 text-red-500">
                <LogOut className="h-4 w-4" /> Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* 🔥 BACK BUTTON */}

      <div className="px-8 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* 🔥 CONTENT */}
      <div className="max-w-3xl mx-auto p-6">
        {isFinal && !started && (
          <div className="bg-white p-8 rounded shadow text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Final Assessment
            </h2>

            <p className="mb-3 text-gray-700">
              This is your final exam for the course.
            </p>

            <ul className="text-left mb-4 text-gray-600 list-disc pl-5">
              <li>Minimum 75% required to pass</li>
              <li>15 MCQs + Coding questions</li>
              <li>You can retake if failed</li>
            </ul>

            <button
              onClick={() => {
                setStarted(true);
                setLoading(true);
                generate();
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Start Final Assessment
            </button>
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          AI Generated Assignment
        </h2>

        {(!isFinal || started) && !loading && !fallbackMode &&
          questions.map((q, index) => (
          <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-3">
              Q{index + 1}. {q.question}
            </h3>

            {q.options.map((opt: string, i: number) => (
              <label
                key={i}
                className={`block p-2 border rounded mb-2 cursor-pointer ${
                  answers[index] === i
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${index}`}
                  className="mr-2"
                  checked={answers[index] === i}
                  onChange={() =>
                    setAnswers({
                      ...answers,
                      [index]: i,
                    })
                  }
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        {(!isFinal || started) && !loading && !fallbackMode && theoryQuestions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-yellow-600">
              Descriptive Questions
            </h2>

            {theoryQuestions.map((q, index) => (
              <div key={index} className="mb-6 p-4 bg-white rounded shadow">
                <p className="font-semibold">{q.question}</p>

                <textarea
                  placeholder="Write your answer..."
                  className="w-full mt-3 p-2 border rounded"
                  rows={4}
                />
              </div>
            ))}
          </div>
        )}
        {/* {(!isFinal || started) && codingQuestions.length > 0 && ( */}
        {(!isFinal || started) && !loading && !fallbackMode && codingQuestions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-purple-600">
            Coding Questions
          </h2>

          {codingQuestions.map((q, index) => (
            <div
              key={index}
              className="mb-6 p-4 bg-white rounded-lg shadow border-l-4 border-purple-500"
            >
              <h3 className="font-semibold mb-2">
                ({q.level.toUpperCase()}) Question:
              </h3>

              {/* <p className="text-gray-700">{q.question}</p> */}
              <p className="text-gray-700 mb-2">{q.question}</p>

              {q.input && (
                <p className="text-sm text-blue-600">
                  <b>Input:</b> {q.input}
                </p>
              )}

              {q.output && (
                <p className="text-sm text-green-600">
                  <b>Output:</b> {q.output}
                </p>
              )}

              {q.example && (
                <p className="text-sm text-gray-600">
                  <b>Example:</b> {q.example}
                </p>
              )}

              <textarea
                placeholder="Write your code here..."
                className="w-full mt-3 p-2 border rounded"
                rows={4}
              />
            </div>
          ))}
        </div>
      )}
        {/* 🔥 ADD HERE (LOADING MESSAGE) */}
        {isFinal && started && loading && (
          <div className="text-center mt-10 text-blue-600 text-lg">
            Generating AI Questions...
          </div>
        )}
        {/* {(!isFinal || started) && ( */}
        {/* 🔥 FALLBACK MESSAGE */}
        {fallbackMode && (
          <div className="text-center text-orange-600 mb-4">
            ⚠️ AI limit reached. You can still submit this assignment.
          </div>
        )}
        {(!isFinal || started) && !loading && (
        <div className="text-center">
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit Assignment
          </button>
        </div>)}
        {score !== null && (
          <div className="text-center mt-6">
            <h2
              className={`text-xl font-bold ${
                score >= 75 ? "text-green-600" : "text-red-600"
              }`}
            >
              Score: {score}%
            </h2>

            {score >= 75 ? (
              <>
                <p className="text-green-600 mt-2">
                  🎉 You Passed!
                </p>

                {moduleId === "final" && (
                  <p className="text-blue-600 font-semibold mt-2">
                    ✅ Course Completed Successfully!
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-red-600 mt-2">
                  ❌ You Failed. Try again!
                </p>

                <button
                  onClick={generate}
                  className="mt-4 bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
                >
                  Retake Assignment
                </button>
              </>
            )}
          </div>
        )}
        {/* 🔥 ADD POPUP HERE */}
        {showResultPopup && score !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            
            {score >= 75 && <Confetti />}

            <div className="bg-white p-8 rounded-xl text-center shadow-lg w-[350px]">

              <h2 className="text-2xl font-bold mb-4">
                {score >= 75 ? "🎉 Congratulations!" : "😢 Don't Give Up!"}
              </h2>

              <p className="text-lg mb-2">
                Your Score: <b>{score}%</b>
              </p>

              {score >= 75 ? (
                <p className="text-green-600 mb-4">
                  You passed successfully!
                </p>
              ) : (
                <p className="text-red-600 mb-4">
                  Keep practicing 💪
                </p>
              )}
             
                <div className="flex justify-center gap-3">

                {/* ✅ PASS (MODULE OR FINAL) → GO TO COURSE */}
                {score >= 75 ? (
                  <button
                    onClick={() => navigate(`/learn/${courseId}`)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Go to Course
                  </button>
                ) : (
                  <button
                    onClick={() => setShowResultPopup(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                )}

                {/* ❌ FAIL → RETAKE */}
                {score < 75 && (
                  <button
                    onClick={() => {
                      setShowResultPopup(false);
                      generate();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Try Again
                  </button>
                )}

              </div>
              
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Assignment;