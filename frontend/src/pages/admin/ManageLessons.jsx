import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Video,
  FileText,
  BookOpen,
  ChevronDown,
  AlertCircle,
  X,
  ExternalLink,
  BookMarked,
} from "lucide-react";
import adminService from "../../services/adminService";
import courseService from "../../services/courseService";
import { useToast } from "../../hooks/useToast";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";

export default function ManageLessons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // Lesson Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "VIDEO",
    contentUrl: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Deletion Modal State
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all courses for the dropdown selector
  const fetchCoursesList = useCallback(async () => {
    try {
      setLoadingCourses(true);
      const res = await courseService.getAllCourses({ limit: 100 });
      if (res?.success && res?.data?.courses) {
        const fetchedCourses = res.data.courses;
        setCourses(fetchedCourses);

        // Check if courseId is in URL params
        const paramCourseId = searchParams.get("courseId");
        if (paramCourseId) {
          setSelectedCourseId(paramCourseId);
        } else if (fetchedCourses.length > 0) {
          setSelectedCourseId(fetchedCourses[0].id.toString());
        }
      }
    } catch (err) {
      console.error("Fetch courses error:", err);
      toast.error("Failed to load courses list.");
    } finally {
      setLoadingCourses(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCoursesList();
  }, [fetchCoursesList]);

  // Fetch lessons whenever selectedCourseId changes
  const fetchLessonsForCourse = useCallback(async (courseId) => {
    if (!courseId) return;
    try {
      setLoadingLessons(true);
      // Fetch full protected lessons as admin
      const res = await adminService.getAdminDashboard();
      // Use protected endpoint to see full contentUrls as admin
      const lessonsRes = await courseService.getCourseLessons(courseId);
      if (lessonsRes?.success) {
        setLessons(lessonsRes.lessons || []);
      }
    } catch (err) {
      console.error("Fetch lessons error:", err);
      toast.error("Failed to load lessons for selected course.");
    } finally {
      setLoadingLessons(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchLessonsForCourse(selectedCourseId);
    }
  }, [selectedCourseId, fetchLessonsForCourse]);

  const handleCourseChange = (e) => {
    const newId = e.target.value;
    setSelectedCourseId(newId);
    setSearchParams({ courseId: newId });
  };

  const openCreateModal = () => {
    setEditingLesson(null);
    setFormData({
      title: "",
      description: "",
      type: "VIDEO",
      contentUrl: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      type: lesson.type || "VIDEO",
      contentUrl: lesson.contentUrl || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  const validateLessonForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Lesson title is required";
    if (!["VIDEO", "PDF", "NOTE"].includes(formData.type)) {
      errors.type = "Type must be VIDEO, PDF, or NOTE";
    }
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLessonForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);

      if (editingLesson) {
        // Update lesson
        const res = await adminService.updateLesson(editingLesson.id, {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          type: formData.type,
          contentUrl: formData.contentUrl.trim() || null,
        });

        if (res?.success) {
          toast.success("Lesson updated successfully!");
          closeModal();
          fetchLessonsForCourse(selectedCourseId);
        }
      } else {
        // Create lesson
        const res = await adminService.createLesson(selectedCourseId, {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          type: formData.type,
          contentUrl: formData.contentUrl.trim() || null,
        });

        if (res?.success) {
          toast.success("Lesson added successfully!");
          closeModal();
          fetchLessonsForCourse(selectedCourseId);
        }
      }
    } catch (err) {
      console.error("Save lesson error:", err);
      toast.error(err?.response?.data?.message || "Failed to save lesson.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;
    try {
      setDeleting(true);
      const res = await adminService.deleteLesson(lessonToDelete.id);
      if (res?.success) {
        toast.success("Lesson deleted successfully.");
        setLessonToDelete(null);
        fetchLessonsForCourse(selectedCourseId);
      }
    } catch (err) {
      console.error("Delete lesson error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete lesson.");
    } finally {
      setDeleting(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id.toString() === selectedCourseId);

  const getLessonIcon = (type) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-4 h-4 text-blue-600" />;
      case "PDF":
        return <FileText className="w-4 h-4 text-rose-600" />;
      case "NOTE":
      default:
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Lessons
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Add and organize video lectures, study PDFs, and notes for each course curriculum.
          </p>
        </div>

        {selectedCourseId && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={openCreateModal}
          >
            Add New Lesson
          </Button>
        )}
      </div>

      {/* Course Selection Dropdown Bar */}
      <Card className="p-4 sm:p-5 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-md space-y-1.5">
            <label
              htmlFor="courseSelector"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
            >
              Select Course:
            </label>
            <div className="relative">
              <select
                id="courseSelector"
                value={selectedCourseId}
                onChange={handleCourseChange}
                disabled={loadingCourses || courses.length === 0}
                className="block w-full py-2.5 px-3.5 pr-10 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 appearance-none"
              >
                {courses.length === 0 ? (
                  <option value="">No courses available</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.subject})
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {selectedCourse && (
            <div className="flex items-center gap-3 self-end sm:self-center">
              <Badge variant="brand" size="md">
                {selectedCourse.subject}
              </Badge>
              <span className="text-xs font-semibold text-slate-600">
                {lessons.length} Lessons Configured
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {loadingLessons && (
        <LoadingSpinner
          size="lg"
          message="Loading lessons for selected course..."
          className="py-16"
        />
      )}

      {/* Lessons Table */}
      {!loadingLessons && lessons.length > 0 && (
        <Card className="p-0 overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">Lesson Details</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lessons.map((lesson, idx) => (
                  <tr key={lesson.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-bold text-slate-900">
                        {lesson.title}
                      </div>
                      {lesson.description && (
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {lesson.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {getLessonIcon(lesson.type)}
                        <span>{lesson.type}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit2}
                          onClick={() => openEditModal(lesson)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setLessonToDelete(lesson)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Empty State when no lessons */}
      {!loadingLessons && selectedCourseId && lessons.length === 0 && (
        <EmptyState
          icon={Layers}
          title="No lessons in this course yet"
          description="Build the curriculum for this course by adding your first video, PDF, or study note lesson."
          actionLabel="Add First Lesson"
          actionIcon={Plus}
          onAction={openCreateModal}
        />
      )}

      {/* Lesson Create / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
            onClick={closeModal}
          />

          <div className="relative bg-white rounded-2xl shadow-elevated border border-slate-200 max-w-lg w-full p-6 space-y-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingLesson ? "Edit Lesson" : "Add Lesson"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <Input
                label="Lesson Title"
                placeholder="e.g. Chapter 1: Fractions and Decimals"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (formErrors.title) setFormErrors({ ...formErrors, title: "" });
                }}
                error={formErrors.title}
                required
              />

              {/* Lesson Type Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Lesson Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "VIDEO", label: "Video Lecture", icon: Video },
                    { type: "PDF", label: "PDF Document", icon: FileText },
                    { type: "NOTE", label: "Study Note", icon: BookOpen },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = formData.type === t.type;
                    return (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t.type })}
                        className={`
                          flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all
                          ${
                            isSelected
                              ? "border-brand-600 bg-brand-50 text-brand-700 shadow-xs"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600"
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 mb-1 text-inherit" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content URL input */}
              <Input
                label={
                  formData.type === "VIDEO"
                    ? "Video URL (YouTube, Vimeo, or MP4)"
                    : formData.type === "PDF"
                    ? "PDF Document URL"
                    : "Resource Link (Optional)"
                }
                placeholder={
                  formData.type === "VIDEO"
                    ? "https://www.youtube.com/watch?v=..."
                    : formData.type === "PDF"
                    ? "https://example.com/curriculum.pdf"
                    : "https://example.com/reference-notes"
                }
                value={formData.contentUrl}
                onChange={(e) =>
                  setFormData({ ...formData, contentUrl: e.target.value })
                }
                helperText="Protected content URL shown only to enrolled students."
              />

              {/* Description / Text content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {formData.type === "NOTE"
                    ? "Lesson Note Content"
                    : "Lesson Description (Optional)"}
                </label>
                <textarea
                  rows={formData.type === "NOTE" ? 6 : 3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={
                    formData.type === "NOTE"
                      ? "Write the full study notes, concept explanations, and definitions here..."
                      : "Brief summary of what this video or document covers..."
                  }
                  className="block w-full rounded-lg border border-slate-300 bg-white text-sm p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={saving}
                >
                  {editingLesson ? "Save Changes" : "Create Lesson"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!lessonToDelete}
        title="Delete Lesson?"
        message={`Are you sure you want to delete lesson "${lessonToDelete?.title}"? All student progress recorded for this lesson will be permanently deleted.`}
        confirmLabel="Yes, Delete Lesson"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteLesson}
        onCancel={() => setLessonToDelete(null)}
      />
    </div>
  );
}
