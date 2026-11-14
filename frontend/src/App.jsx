import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Button from "./components/common/Button";
import Card from "./components/common/Card";
import Badge from "./components/common/Badge";
import { BookOpen, Sparkles, Compass, ArrowRight, CheckCircle2 } from "lucide-react";

export default function App() {
  return (
    <Router>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section Banner */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="rural" size="md" className="mb-4">
              <Sparkles className="w-3.5 h-3.5 text-rural-600" />
              GramShiksha Design System Initialized
            </Badge>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Learn Without Limits, <br />
              <span className="bg-gradient-to-r from-brand-600 to-rural-600 bg-clip-text text-transparent">
                Grow Without Boundaries.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              A high-performance, mobile-first e-learning platform crafted for rural learners.
              Designed with a soothing educational palette, lightweight components, and offline-ready responsiveness.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/courses">
                <Button size="lg" variant="primary" icon={Compass}>
                  Explore Courses
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" icon={ArrowRight}>
                  Join as Student
                </Button>
              </Link>
            </div>
          </div>

          {/* Design System Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverable className="border-t-4 border-t-brand-600">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Accessible Education
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Clean typography, high contrast, and intuitive navigation built so students of all backgrounds can learn comfortably.
              </p>
            </Card>

            <Card hoverable className="border-t-4 border-t-rural-600">
              <div className="w-12 h-12 rounded-xl bg-rural-50 text-rural-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Low Bandwidth Ready
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lightweight bundle size, minimal animations, and offline PWA support for intermittent rural internet connectivity.
              </p>
            </Card>

            <Card hoverable className="border-t-4 border-t-amber-500">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Student & Admin Portals
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Role-based authenticated dashboards with lesson tracking, enrollment flows, and full curriculum management.
              </p>
            </Card>
          </div>
        </div>
      </Layout>
    </Router>
  );
}
