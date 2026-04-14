import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

interface EnrolledCourse {
  enrollmentId: string;
  courseId: string;
  name: string;
  image: string;
  modulesCount: number;
  progress: number;
  completed: boolean;
  courseCompleted: boolean;
}

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [user, setUser] = useState<any>(null);

  /* ================= AUTH ================= */

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  /* ================= TOTAL COURSES ================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "courses"),
      (snapshot) => {
        setTotalCourses(snapshot.size);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ================= FETCH ENROLLMENTS + COURSE DETAILS ================= */

  // useEffect(() => {
  //   if (!user) return;
        useEffect(() => {
        if (!user?.uid) return; // ✅ FIX

        console.log("USER UID:", user.uid); // 🔍 DEBUG

    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const enriched: EnrolledCourse[] = [];

      for (const docSnap of snapshot.docs) 
        {
          const enrollment = docSnap.data();

          const courseSnap = await getDoc(
            doc(db, "courses", enrollment.courseId)
          );

          if (courseSnap.exists()) {
            const courseData = courseSnap.data();

            enriched.push({
              enrollmentId: docSnap.id,
              courseId: enrollment.courseId,
              name: courseData.name,
              image: courseData.image,
              modulesCount: courseData.modules?.length || 0,
              progress: enrollment.progress || 0,
              // completed: enrollment.completed || false,
              completed: enrollment.courseCompleted || false,
              courseCompleted: enrollment.courseCompleted || false,
          });
        }
        console.log("ENROLLMENT:", docSnap.data());
      }

      setCourses(enriched);
    });

    return () => unsubscribe();
  }, [user]);

  const enrolledCourses = courses.filter((c) => !c.completed);
  const completedCourses = courses.filter((c) => c.completed);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">{totalCourses}</p>
              <p className="text-sm text-muted-foreground">
                Available Courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">
                {enrolledCourses.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Enrolled Courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">
                {completedCourses.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Completed Courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ================= ENROLLED COURSES ================= */}

        <h2 className="text-xl font-bold mb-4">
          Enrolled Courses
        </h2>

        {enrolledCourses.length === 0 && (
          <p className="text-muted-foreground">
            No enrolled courses.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {enrolledCourses.map((course) => (
            <Card key={course.enrollmentId}>
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardContent className="p-5">
                <Badge variant="secondary" className="mb-2">
                  {course.modulesCount} Modules
                </Badge>

                <h3 className="text-lg font-semibold mb-3">
                  {course.name}
                </h3>

                <Progress
                  value={course.progress}
                  className="mb-2"
                />

                {/* <p className="text-sm text-muted-foreground mb-3">
                  {course.progress}% completed
                </p> */}
                <p className="text-sm text-muted-foreground mb-1">
                  {course.progress}% Learning Completed
                </p>

                {/*   FINAL STATUS */}
                {course.progress === 100 && !course.courseCompleted && (
                  <p className="text-yellow-600 text-xs mb-2">
                    ⚠ Final Assessment Pending
                  </p>
                )}

                {course.courseCompleted && (
                  <p className="text-green-600 text-xs mb-2">
                    🎉 Course Completed
                  </p>
                )}

                <Button
                  className="w-full"
                  onClick={() =>
                    navigate(`/learn/${course.courseId}`)
                  }
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ================= COMPLETED COURSES ================= */}

        <h2 className="text-xl font-bold mb-4">
          Completed Courses
        </h2>

        {completedCourses.length === 0 && (
          <p className="text-muted-foreground">
            No completed courses yet.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedCourses.map((course) => (
            <Card key={course.enrollmentId}>
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardContent className="p-5">
                <Badge variant="secondary" className="mb-2">
                  {course.modulesCount} Modules
                </Badge>

                <h3 className="text-lg font-semibold mb-4">
                  {course.name}
                </h3>

                <div className="flex gap-2">

                {/*  COMPLETED BADGE (NOT CLICKABLE) */}
                <Button
                  disabled
                  className="w-1/2 bg-green-600 text-white cursor-default"
                >
                  Completed
                </Button>

                {/*  VIEW BUTTON */}
                <Button
                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate(`/learn/${course.courseId}`)}
                >
                  View
                </Button>

              </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;