import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  Compass,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Video,
  FileText,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

export default function Home() {
  const featuredTracks = [
    {
      id: "math",
      title: "Foundational Mathematics",
      subject: "Mathematics",
      description: "Master arithmetic, algebra, geometry, and real-world calculation skills with step-by-step guidance.",
      lessonsCount: "12 Lessons",
      level: "Basic to Intermediate",
      tagColor: "brand",
    },
    {
      id: "science",
      title: "General Science & Nature",
      subject: "Science",
      description: "Explore biology, physics, and agricultural science fundamentals tailored for rural students.",
      lessonsCount: "10 Lessons",
      level: "All Levels",
      tagColor: "rural",
    },
    {
      id: "computer",
      title: "Digital Literacy & Computers",
      subject: "Technology",
      description: "Learn computer basics, smartphones, typing, internet safety, and essential digital citizen skills.",
      lessonsCount: "8 Lessons",
      level: "Beginner",
      tagColor: "brand",
    },
    {
      id: "english",
      title: "Practical English Communication",
      subject: "English",
      description: "Build confidence in conversational English, daily vocabulary, reading comprehension, and grammar.",
      lessonsCount: "15 Lessons",
      level: "Beginner",
      tagColor: "rural",
    },
  ];

  const features = [
    {
      icon: Smartphone,
      title: "Built for Mobile & Low Bandwidth",
      description:
        "Engineered to load fast even on 2G/3G connections and budget smartphones with minimal data consumption.",
      color: "text-brand-600 bg-brand-50",
    },
    {
      icon: Video,
      title: "Video, PDF & Note Lessons",
      description:
        "Learn through bite-sized video lectures, comprehensive study notes, and downloadable PDF material.",
      color: "text-rural-600 bg-rural-50",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Progress Tracking",
      description:
        "Mark lessons as completed, track overall progress, and know exactly what to study next.",
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: ShieldCheck,
      title: "100% Free & Open Access",
      description:
        "No hidden fees or subscriptions. High-quality education accessible to every student in every village.",
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Create Free Account",
      desc: "Sign up in 30 seconds with just your name and email. No technical skills required.",
    },
    {
      num: "02",
      title: "Choose Your Course",
      desc: "Explore verified courses across Mathematics, Science, Digital Skills, and Languages.",
    },
    {
      num: "03",
      title: "Study at Your Pace",
      desc: "Watch videos, read notes, and review lessons whenever convenient for your daily routine.",
    },
    {
      num: "04",
      title: "Track Your Progress",
      desc: "Monitor your accomplishments on your personalized student dashboard as you complete each lesson.",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-12 pb-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rural-100/80 border border-rural-200 text-rural-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-rural-600" />
                <span>Empowering Rural India Through E-Learning</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Learn Without Limits, <br />
                <span className="bg-gradient-to-r from-brand-600 via-blue-700 to-rural-600 bg-clip-text text-transparent">
                  Grow Without Boundaries.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                GramShiksha brings the classroom directly to your village.
                Enjoy clean, distraction-free courses, structured lesson paths, and complete learning tracking designed specifically for rural learners.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="primary"
                    fullWidth
                    icon={Compass}
                    className="shadow-md hover:shadow-lg"
                  >
                    Explore Courses
                  </Button>
                </Link>

                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    fullWidth
                    icon={ArrowRight}
                  >
                    Register as Student
                  </Button>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Free Access</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-xs text-slate-500 font-medium">Self-Paced</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Mobile</div>
                  <div className="text-xs text-slate-500 font-medium">Optimized</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Learning Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative background glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-200 to-rural-200 rounded-3xl blur-2xl opacity-60"></div>

                <div className="relative bg-white rounded-2xl shadow-elevated border border-slate-100 p-6 sm:p-8 space-y-6">
                  {/* Mock Classroom Header Card */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          Digital Classroom
                        </div>
                        <div className="text-xs text-rural-600 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rural-500 animate-pulse"></span>
                          Online & Interactive
                        </div>
                      </div>
                    </div>
                    <Badge variant="brand" size="sm">
                      Rural Ed
                    </Badge>
                  </div>

                  {/* Visual Course Item 1 */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          Chapter 1: Arithmetic Basics
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Video Lesson • 12 mins
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>

                  {/* Visual Course Item 2 */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">
                          Chapter 2: Study Notes
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Illustrated Reading • Notes
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>

                  {/* Visual Progress bar inside card */}
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-600">Your Learning Progress</span>
                      <span className="text-brand-600 font-bold">75% Completed</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-600 to-rural-600 h-full rounded-full transition-all duration-500"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Tracks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="brand" size="md" className="mb-3">
            Core Curriculum
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Explore Featured Learning Tracks
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Carefully curated subjects created to build strong academic and practical skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTracks.map((track) => (
            <Card
              key={track.id}
              hoverable
              className="flex flex-col justify-between h-full"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={track.tagColor} size="sm">
                    {track.subject}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {track.lessonsCount}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {track.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {track.description}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {track.level}
                </span>
                <Link
                  to="/courses"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/courses">
            <Button variant="outline" size="md" icon={Compass}>
              View All Available Courses
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose GramShiksha (Features) */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="rural" size="md" className="mb-3">
              Designed For Rural India
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Why Learn With GramShiksha?
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Removing geographical and economic obstacles through simple, accessible technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-card transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="brand" size="md" className="mb-3">
            Simple 4-Step Process
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            How GramShiksha Works
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Start your learning journey today in four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="relative bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-3xl font-black text-brand-600/20">
                  {st.num}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-rural-700 p-8 sm:p-12 text-white shadow-elevated relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Begin Learning Today?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Join GramShiksha for free. No credit card, no complex setups. Just click register and start exploring lessons right away.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link to="/register">
              <Button
                size="lg"
                variant="secondary"
                icon={ArrowRight}
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md"
              >
                Register Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
