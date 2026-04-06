
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { GraduationCap, ArrowLeft } from "lucide-react";

interface ModuleItem {
  id: number;
  type: "content" | "video";
  name: string;
  description: string;
  url?: string;
}

interface Module {
  id: number;
  title: string;
  items: ModuleItem[];
  aiAssignmentEnabled?: boolean;
}

interface Course {
  id: string;
  name: string;
  modules: Module[];
  finalAiAssignmentEnabled?: boolean;
}

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [finalPassed, setFinalPassed] = useState(false);
  const isCourseCompleted =
  completedIds.length === course?.modules.length &&
  finalPassed;

  const user = auth.currentUser;

  /* ================= FETCH COURSE ================= */
  useEffect(() => {
  if (!scrollRef.current) return;

  // Move scroll to top
  scrollRef.current.scrollTop = 0;

  // Reset circle percentage
  setScrollPercent(0);

}, [selectedIndex]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      const snap = await getDoc(doc(db, "courses", courseId));

      if (!snap.exists()) {
        navigate("/dashboard");
        return;
      }

      setCourse({
        id: snap.id,
        ...snap.data(),
      } as Course);
      console.log("Course Data:", snap.data());
    };

    fetchCourse();
  }, [courseId]);

  /* ================= FETCH ENROLLMENT (REALTIME RESTORE) ================= */

  useEffect(() => {
    if (!user || !courseId) return;

    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", user.uid),
      where("courseId", "==", courseId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const enrollment = snapshot.docs[0];

        setEnrollmentId(enrollment.id);
        setProgress(enrollment.data().progress || 0);

        // 🔥 IMPORTANT FIX
        setCompletedIds(
          enrollment.data().completedModules || []
        );
        setFinalPassed(enrollment.data().courseCompleted || false);
      }
    });

    return () => unsubscribe();
  }, [user, courseId]);

  /* ================= EMBED FIX ================= */

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("watch?v="))
      return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "youtube.com/embed/");
    return url;
  };

  const handleScroll = async () => {
    if (!scrollRef.current || !course || !enrollmentId) return;

    const el = scrollRef.current;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;

    const percent = Math.min(
      100,
      Math.round((el.scrollTop / maxScroll) * 100)
    );

    // ✅ ALWAYS UPDATE (NO CONDITION)
    setScrollPercent((prev) => Math.max(prev, percent));

    const currentModule = course.modules[selectedIndex];

    if (
      percent === 100 &&
      !completedIds.includes(currentModule.id)
    ) {
      const updatedCompleted = [
        ...completedIds,
        currentModule.id,
      ];

      setCompletedIds(updatedCompleted);

      const progressPercent = Math.round(
        (updatedCompleted.length / course.modules.length) * 100
      );

      setProgress(progressPercent);

      await updateDoc(
        doc(db, "enrollments", enrollmentId),
        {
          progress: progressPercent,
          // completed: progressPercent === 100,
          completedModules: updatedCompleted,
        }
      );
    }
  };
  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    return index <= completedIds.length;
  };

  /* ================= CIRCLE COMPONENT ================= */

  const LargeModuleCircle = ({ percent }: { percent: number }) => {
    const radius = 26;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 2;
    const circumference =
      normalizedRadius * 2 * Math.PI;

    const strokeDashoffset =
      circumference -
      (percent / 100) * circumference;

    return (
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#2563eb"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "0.3s",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="11"
          fill="#2563eb"
          fontWeight="bold"
        >
          {percent === 100 ? "✓" : `${percent}%`}
        </text>
      </svg>
    );
  };

  if (!course)
    return <div className="p-10">Loading...</div>;

  // const activeModule = course.modules[selectedIndex];
  const activeModule = 
    course.modules && course.modules.length > 0
    ? course.modules[selectedIndex]
    : null;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ===== NAVBAR ===== */}
      <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <GraduationCap className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-semibold">
            Personalised Learning Path
          </h1>
        </div>

        <div className="flex gap-6 font-medium">
          <button onClick={() => navigate("/courses")}>
            Courses
          </button>
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </div>
      </div>

      {/* ===== BACK BUTTON ===== */}
      <div className="px-8 pt-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="flex h-[calc(100vh-140px)] mt-4">

        {/* ===== SIDEBAR ===== */}
        <div className="w-80 bg-white border-r p-4">
          <div className="p-5 bg-blue-600 text-white rounded mb-4">
            <h2 className="text-lg font-semibold">
              {course.name}
            </h2>
            {/* <p>{progress}% completed</p> */}
            <p>{progress}% Learning Completed</p>
              {!finalPassed && progress === 100 && (
                <p className="text-yellow-600 text-sm mt-1">
                  Final Assessment Pending
                </p>
              )}

              {finalPassed && (
                <p className="text-green-600 text-sm mt-1">
                  Course Completed 🎉
                </p>
              )}
          </div>

          {course.modules.map((mod, index) => {
            const unlocked = isUnlocked(index);
            const completed =
              completedIds.includes(mod.id);

            return (
              <div
                key={mod.id}
                onClick={() =>
                  unlocked &&
                  setSelectedIndex(index)
                }
                className={`p-3 mb-3 rounded flex justify-between items-center cursor-pointer
                ${
                  index === selectedIndex
                    ? "bg-blue-100"
                    : unlocked
                    ? "hover:bg-gray-100"
                    : "bg-gray-100 opacity-60 cursor-not-allowed"
                }`}
              >
                <span className="font-medium">
                  {mod.title}
                </span>

                {unlocked ? (
                  <LargeModuleCircle
                    percent={
                      completed
                        ? 100
                        : index === selectedIndex
                        ? scrollPercent
                        : 0
                    }
                  />
                ) : (
                  <span>🔒</span>
                )}
              </div>
            );
          })}
          {course.finalAiAssignmentEnabled === true && (
            <div
              onClick={() => {
                if (completedIds.length === course.modules.length) {

                  // 🔥 FULL COURSE CONTENT (BEST VERSION)
                  const fullCourseContent = course.modules
                    .map((m: any) =>
                      m.items
                        .map((item: any) =>
                          `${item.name} ${item.description || ""}`
                        )
                        .join(" ")
                    )
                    .join(" ");

                  navigate(`/assignment/${course.id}/final`, {
                    state: {
                      moduleTitle: fullCourseContent,
                    },
                  });
                }
              }}
              className={`p-3 mt-4 rounded flex justify-between items-center cursor-pointer
                ${
                  finalPassed
                    ? "bg-green-100 hover:bg-green-200"
                    : completedIds.length === course.modules.length
                    ? "bg-yellow-100 hover:bg-yellow-200"
                    : "bg-gray-100 opacity-60 cursor-not-allowed"
                }`}
            >
              <span className="font-medium">
                Final Assessment
              </span>
              {isCourseCompleted ? (
                <span className="text-green-600 font-bold">✓</span>
              ) : completedIds.length === course.modules.length ? (
                <span>ℹ️</span>  // unlocked but not completed
              ) : (
                <span>🔒</span>
              )}
            </div>
          )}
        </div>

        {/* ===== CONTENT ===== */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 p-10 overflow-y-auto"
        >
          <h1 className="text-2xl font-bold mb-6">
            {activeModule.title}
          </h1>

          {activeModule.items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded shadow mb-6"
            >
              <h3 className="font-semibold text-lg mb-3">
                {item.name}
              </h3>

              {item.type === "content" && (
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {item.description}
                </div>
              )}

              {item.type === "video" && (
                <div className="w-full aspect-video mb-4">
                  <iframe
                    className="w-full h-full rounded-xl shadow"
                    src={getEmbedUrl(item.url)}
                    title={item.name}
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ))}
          {/* ===== AI ASSIGNMENT SECTION ===== */}

          {/* {activeModule.aiAssignmentEnabled && ( */}  
            {activeModule?.aiAssignmentEnabled === true && (
            <div className="bg-white p-6 rounded shadow mb-6">
              <h2 className="text-lg font-bold mb-4">
                AI Assignment
              </h2>

              <p className="mb-4">
                Complete this AI-generated assignment to unlock the next module.
                You must score 75% or higher.
              </p>

              <button
                onClick={() =>
                  // navigate(
                  //   `/assignment/${course.id}/${activeModule.id}`
                  // )
                  navigate(
                      `/assignment/${course.id}/${activeModule.id}`,
                    {
                      state: {
                        moduleTitle: activeModule.title,
                      },
                    }
                  )
                }
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
              >
                Take AI Assignment
              </button>
            </div>
          )}
          <div style={{ height: "250px" }} />
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;