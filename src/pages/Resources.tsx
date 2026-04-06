import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Search, Play, FileText, Code, ExternalLink, BookOpen, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const resources = [
  { id: 1, title: "Python Crash Course Video", type: "Video", course: "Python", url: "#", desc: "Complete beginner to advanced Python tutorial" },
  { id: 2, title: "DSA Cheat Sheet", type: "PDF", course: "Data Structures", url: "#", desc: "Quick reference for all data structures" },
  { id: 3, title: "ML Algorithms Explained", type: "Video", course: "Machine Learning", url: "#", desc: "Visual guide to common ML algorithms" },
  { id: 4, title: "OOP Practice Problems", type: "Interactive", course: "Python", url: "#", desc: "Hands-on coding exercises for OOP" },
  { id: 5, title: "Graph Theory Notes", type: "PDF", course: "Data Structures", url: "#", desc: "Detailed notes on graph algorithms" },
  { id: 6, title: "Neural Networks Lab", type: "Interactive", course: "Machine Learning", url: "#", desc: "Build a neural network step by step" },
  { id: 7, title: "React Fundamentals", type: "Video", course: "Web Development", url: "#", desc: "Learn React from scratch" },
  { id: 8, title: "SQL Masterclass", type: "PDF", course: "Database Management", url: "#", desc: "Complete SQL reference guide" },
];

const typeIcon: Record<string, typeof Play> = {
  Video: Play,
  PDF: FileText,
  Interactive: Code,
};

const Resources = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.course.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || r.type.toLowerCase() === tab;
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-foreground mb-2">Learning Resources</h1>
          <p className="text-muted-foreground">Access videos, PDFs, and interactive content for your courses</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resources..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="pdf">PDFs</TabsTrigger>
              <TabsTrigger value="interactive">Interactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const Icon = typeIcon[r.type] || BookOpen;
            return (
              <Card key={r.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm">{r.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">{r.course}</Badge>
                      <Badge variant="outline" className="text-xs">{r.type}</Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Resources;
