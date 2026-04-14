import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = onSnapshot(
      doc(db, "courses", id),
      (snapshot) => {
        if (snapshot.exists()) {
          setCourse({ id: snapshot.id, ...snapshot.data() });
        }
      }
    );

    return () => unsubscribe();
  }, [id]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-6">
          {course.name}
        </h1>

        {course.modules?.map((module: any, index: number) => (
          <Card key={index} className="mb-6">
            <CardContent className="p-6">

              <h2 className="text-xl font-semibold mb-3">
                Module {index + 1}: {module.title}
              </h2>

              {module.content && (
                <p className="text-muted-foreground mb-4 whitespace-pre-line">
                  {module.content}
                </p>
              )}

              {module.videoUrl && (
                <iframe
                  src={module.videoUrl}
                  title={module.title}
                  className="w-full h-64 rounded-lg"
                  allowFullScreen
                />
              )}

            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  );
};

export default CourseDetail;