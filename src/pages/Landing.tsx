import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Target, BarChart3, Users, Sparkles, User } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
const features = [
  { icon: Target, title: "Domain Mastery", desc: "Complete domains to unlock dynamic AI-generated assignments" },
  { icon: BookOpen, title: "Rich Resources", desc: "Videos, PDFs, interactive content matched to your style" },
  { icon: User, title: "AI Assignments", desc: "Ai based Assignments generator." },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="AI Learning" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-secondary/80" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-secondary-foreground leading-tight mb-6">
              Personalized Learning Path
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8 leading-relaxed">
              Discover your learning style, get personalized course recommendations, and track your progress with intelligent AI assistance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/student-login">
                <Button size="lg" className="text-base px-8">Start as a student</Button>
              </Link>
              <Link to="/courses">
                
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-3">Why LearnPath AI?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Our intelligent platform adapts to how you learn best</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <f.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join thousands of students already using AI to optimize their learning journey</p>
          <Link to="/student-login">
            <Button size="lg" className="text-base px-10">Sign Up Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 LearnPath AI — Personalized Learning Path Recommender
        </div>
      </footer>
    </div>
  );
};

export default Landing;
