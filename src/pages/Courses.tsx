import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Search } from "lucide-react";

const Courses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  const user = auth.currentUser;

  /* ================= FETCH COURSES ================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "courses"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(list);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ================= FETCH USER ENROLLMENTS ================= */

  useEffect(() => {
    if (!user) return;

    const fetchEnrollments = async () => {
      const q = query(
        collection(db, "enrollments"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEnrollments(list);
    };

    fetchEnrollments();
  }, [user]);

  /* ================= ENROLL FUNCTION ================= */

  const handleEnroll = async (course: any) => {
    if (!user) return;

    await addDoc(collection(db, "enrollments"), {
      userId: user.uid,
      courseId: course.id,
      courseName: course.name,
      progress: 0,
      completed: false,
    });

    // Refresh enrollments instantly
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEnrollments(list);
  };

  /* ================= BUTTON LOGIC ================= */

  const renderButton = (course: any) => {
    const enrollment = enrollments.find(
      (e) => e.courseId === course.id
    );

    // Not enrolled
    if (!enrollment) {
      return (
        <Button
          className="w-full"
          onClick={() => handleEnroll(course)}
        >
          Enroll
        </Button>
      );
    }

    // Completed
    if (enrollment.completed) {
      return (
        <Button
          disabled
          className="w-full bg-gray-400 cursor-not-allowed"
        >
          Completed
        </Button>
      );
    }

    // Enrolled but not completed
    return (
      <Button
        className="w-full"
        onClick={() =>
          navigate(`/learn/${course.id}`)
        }
      >
        Continue
      </Button>
    );
  };

  /* ================= SEARCH ================= */

  const filtered = courses.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />   {/*  NAVBAR STAYS */}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">
          Browse Courses
        </h1>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Card key={course.id}>
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={course.image}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardContent className="p-5">
                <Badge variant="secondary" className="mb-2">
                  {course.modules?.length || 0} Modules
                </Badge>

                <h3 className="text-lg font-semibold mb-4">
                  {course.name}
                </h3>

                {renderButton(course)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;