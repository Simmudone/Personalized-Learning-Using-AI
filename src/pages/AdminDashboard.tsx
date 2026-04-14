
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, User, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/* ================= TYPES ================= */

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
  image: string;
  modules: Module[];
  finalAiAssignmentEnabled?: boolean;
}

/* ================= COMPONENT ================= */

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [newCourse, setNewCourse] = useState({
    name: "",
    image: "",
  });

  const [modules, setModules] = useState<Module[]>([]);

  const [finalAiAssignment, setFinalAiAssignment] = useState(false);

  /* ================= FETCH COURSES ================= */

  const fetchCourses = async () => {
    const snapshot = await getDocs(collection(db, "courses"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Course[];

    setCourses(list);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

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

  const toggleAiAssignment = (id: number, checked: boolean) => {
    setModules(
      modules.map((m) =>
        m.id === id
          ? { ...m, aiAssignmentEnabled: checked }
          : m
      )
    );
  };

  const removeModule = (id: number) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const addItem = (moduleId: number, type: "content" | "video") => {
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

  /* ================= ADD COURSE ================= */

  const addCourse = async () => {
    if (!newCourse.name || !newCourse.image) return;

    // await addDoc(collection(db, "courses"), {
    //   name: newCourse.name,
    //   image: newCourse.image,
    //   modules,
    //   createdAt: serverTimestamp(),
    // });
    await addDoc(collection(db, "courses"), {
      name: newCourse.name,
      image: newCourse.image,
      modules,
      finalAiAssignmentEnabled: finalAiAssignment,
      createdAt: serverTimestamp(),
    });

    setNewCourse({ name: "", image: "" });
    setModules([]);
    setFinalAiAssignment(false);
    setDialogOpen(false);
    fetchCourses();
  };

  /* ================= DELETE COURSE ================= */

  const confirmDeleteCourse = async () => {
    if (!deleteId) return;

    await deleteDoc(doc(db, "courses", deleteId));

    const enrollQuery = query(
      collection(db, "enrollments"),
      where("courseId", "==", deleteId)
    );

    const enrollSnapshot = await getDocs(enrollQuery);

    const deletePromises = enrollSnapshot.docs.map((d) =>
      deleteDoc(doc(db, "enrollments", d.id))
    );

    await Promise.all(deletePromises);

    setDeleteDialogOpen(false);
    setDeleteId(null);
    fetchCourses();
  };

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-500" />
          <h2 className="font-semibold text-lg">Admin Panel</h2>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/admin-profile")}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* MAIN */}
      <div className="p-8">

        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          {/* ADD COURSE */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">

                <Input
                  placeholder="Course Name"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                />

                <Input
                  placeholder="Image URL"
                  value={newCourse.image}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, image: e.target.value })
                  }
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={finalAiAssignment}
                    onChange={(e) =>
                      setFinalAiAssignment(e.target.checked)
                    }
                  />
                  <label className="text-sm font-medium">
                    Enable Final AI Assignment (Complete Course)
                  </label>
                </div>
                <Button onClick={addModule} variant="outline">
                  Add Module
                </Button>

                {modules.map((module) => (
                  <Card key={module.id} className="p-4">
                    <CardContent className="space-y-4 p-0">

                      <Input
                        placeholder="Module Title"
                        value={module.title}
                        onChange={(e) =>
                          updateModuleTitle(module.id, e.target.value)
                        }
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={module.aiAssignmentEnabled || false}
                          onChange={(e) =>
                            toggleAiAssignment(module.id, e.target.checked)
                          }
                        />
                        <label className="text-sm font-medium">
                          Enable AI Assignment
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          onClick={() =>
                            addItem(module.id, "content")
                          }
                        >
                          Add Content
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            addItem(module.id, "video")
                          }
                        >
                          Add Video
                        </Button>
                      </div>

                      {module.items.map((item) => (
                        <div key={item.id} className="border p-3 rounded space-y-2">
                          <Badge>{item.type.toUpperCase()}</Badge>

                          <Input
                            placeholder="Title"
                            value={item.name}
                            onChange={(e) =>
                              updateItem(module.id, item.id, "name", e.target.value)
                            }
                          />

                          {item.type === "video" && (
                            <Input
                              placeholder="Video URL"
                              value={item.url}
                              onChange={(e) =>
                                updateItem(module.id, item.id, "url", e.target.value)
                              }
                            />
                          )}

                          <Textarea
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(module.id, item.id, "description", e.target.value)
                            }
                          />

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              removeItem(module.id, item.id)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))}

                      <Button
                        variant="destructive"
                        onClick={() =>
                          removeModule(module.id)
                        }
                      >
                        Remove Module
                      </Button>

                    </CardContent>
                  </Card>
                ))}

                <Button onClick={addCourse} className="w-full">
                  Save Course
                </Button>

              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Search courses..."
          className="mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* COURSE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <img
                src={course.image}
                alt={course.name}
                className="h-40 w-full object-cover"
              />
              <CardContent className="p-4">
                <Badge>{course.modules.length} Modules</Badge>
                <h3 className="font-semibold mt-2">{course.name}</h3>

                <div className="flex gap-3 mt-4">
                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate(`/admin-course/${course.id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setDeleteId(course.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/*   DELETE CONFIRMATION DIALOG */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                ⚠ Are you sure you want to delete this course?
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              This will permanently delete the course and all enrollments.
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={confirmDeleteCourse}
              >
                Delete Permanently
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
    
  );
};

export default AdminDashboard;