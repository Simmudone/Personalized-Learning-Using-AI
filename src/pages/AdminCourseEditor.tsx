import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

import AdminNavbar from "../components/AdminNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Trash2 } from "lucide-react";

/* ================= TYPES ================= */

interface ModuleItem {
  id: number;
  type: string; // "content" | "video"
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

/* ================= COMPONENT ================= */

const AdminCourseEditor = () => {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId as string;

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalAiAssignmentEnabled, setFinalAiAssignmentEnabled] = useState(false);
  
  /* ================= LOAD COURSE ================= */

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      const snap = await getDoc(doc(db, "courses", courseId));

      if (!snap.exists()) {
        navigate("/admin-dashboard");
        return;
      }

      const data = snap.data();

      setName(data?.name || "");
      setImage(data?.image || "");
      setModules(data?.modules || []);
      setFinalAiAssignmentEnabled(data?.finalAiAssignmentEnabled || false);
      setLoading(false);
    };

    fetchCourse();
  }, [courseId, navigate]);

  /* ================= MODULE FUNCTIONS ================= */

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: Date.now(),
        title: "",
        items: [],
        aiAssignmentEnabled: false,
      },
    ]);
  };

  const updateModuleTitle = (id: number, value: string) => {
    setModules(
      modules.map((m) =>
        m.id === id ? { ...m, title: value } : m
      )
    );
  };

  const removeModule = (id: number) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  /* ================= ITEM FUNCTIONS ================= */

  const addItem = (moduleId: number, type: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              items: [
                ...m.items,
                {
                  id: Date.now(),
                  type,
                  name: "",
                  description: "",
                  url: "",
                },
              ],
            }
          : m
      )
    );
  };

  const updateItem = (
    moduleId: number,
    itemId: number,
    field: string,
    value: string
  ) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              items: m.items.map((item) =>
                item.id === itemId
                  ? { ...item, [field]: value }
                  : item
              ),
            }
          : m
      )
    );
  };

  const removeItem = (moduleId: number, itemId: number) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              items: m.items.filter(
                (item) => item.id !== itemId
              ),
            }
          : m
      )
    );
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!courseId) return;

    await updateDoc(doc(db, "courses", courseId), {
      name,
      image,
      modules,
      finalAiAssignmentEnabled,
    });

    navigate("/admin-dashboard");
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  /* ================= UI ================= */

  return (
  <div className="min-h-screen bg-background">

    {/* ADMIN NAVBAR */}
    <AdminNavbar />

    <div className="container mx-auto px-6 py-8">

      {/* BACK BUTTON */}
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/admin-dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <h1 className="text-3xl font-bold mb-6">
        Edit Course
      </h1>

      {/* COURSE INFO */}
      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <Input
            placeholder="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            placeholder="Course Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={finalAiAssignmentEnabled}
              onChange={(e) =>
                setFinalAiAssignmentEnabled(e.target.checked)
              }
            />
            <label>Enable Final AI Assignment</label>
          </div>
        </CardContent>
      </Card>

      {/* MODULE HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Modules</h2>
        <Button onClick={addModule}>
          Add Module
        </Button>
      </div>

      {/* MODULE LOOP */}
      {modules.map((module) => (
        <Card key={module.id} className="mb-6">
          <CardContent className="p-6 space-y-4">

            <Input
              placeholder="Module Title"
              value={module.title}
              onChange={(e) =>
                updateModuleTitle(module.id, e.target.value)
              }
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={module.aiAssignmentEnabled || false}
                onChange={(e) =>
                  setModules(
                    modules.map((m) =>
                      m.id === module.id
                        ? {
                            ...m,
                            aiAssignmentEnabled: e.target.checked,
                          }
                        : m
                    )
                  )
                }
              />
              <label>Enable AI Assignment</label>
            </div>

            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={() => addItem(module.id, "content")}
              >
                Add Content
              </Button>

              <Button
                size="sm"
                onClick={() => addItem(module.id, "video")}
              >
                Add Video
              </Button>
            </div>

            {module.items.map((item) => (
              <div
                key={item.id}
                className="border rounded p-4 space-y-3"
              >
                <Input
                  placeholder="Title"
                  value={item.name}
                  onChange={(e) =>
                    updateItem(
                      module.id,
                      item.id,
                      "name",
                      e.target.value
                    )
                  }
                />

                {item.type === "video" && (
                  <Input
                    placeholder="Video URL"
                    value={item.url}
                    onChange={(e) =>
                      updateItem(
                        module.id,
                        item.id,
                        "url",
                        e.target.value
                      )
                    }
                  />
                )}

                <Textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(
                      module.id,
                      item.id,
                      "description",
                      e.target.value
                    )
                  }
                />

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    removeItem(module.id, item.id)
                  }
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            ))}

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeModule(module.id)}
            >
              Delete Module
            </Button>

          </CardContent>
        </Card>
      ))}

      <Button
        className="w-full mt-6"
        onClick={handleSave}
      >
        Save Changes
      </Button>

    </div>
  </div>
);
};

export default AdminCourseEditor;


