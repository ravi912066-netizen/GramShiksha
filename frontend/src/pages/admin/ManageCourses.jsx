import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  Layers,
  Users,
  AlertCircle,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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

export default function ManageCourses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Deletion state
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await courseService.getAllCourses({
        search,
        page,
        limit: 10,
      });

      if (res?.success && res?.data) {
        setCourses(res.data.courses || []);
        if (res.data.pagination) setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Fetch courses error:", err);
      toast.error("Failed to load courses from server.");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handle URL query parameters for ?action=new or ?edit=:id
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      openCreateModal();
    }
    const editId = searchParams.get("edit");
    if (editId && courses.length > 0) {
      const target = courses.find((c) => c.id === parseInt(editId, 10));
      if (target) openEditModal(target);
    }
  }, [searchParams, courses]);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({ title: "", description: "", subject: "" });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      subject: course.subject,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingCourse(null);
    setSearchParams({});
  };

  const validateCourseForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Course title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.subject.trim()) errors.subject = "Subject category is required";
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateCourseForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setFormSubmitting(true);

      if (editingCourse) {
        // Update existing course
        const res = await adminService.updateCourse(editingCourse.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          subject: formData.subject.trim(),
        });

        if (res?.success) {
          toast.success("Course updated successfully!");
          closeFormModal();
          fetchCourses();
        }
      } else {
        // Create new course
        const res = await adminService.createCourse({
          title: formData.title.trim(),
          description: formData.description.trim(),
          subject: formData.subject.trim(),
        });

        if (res?.success) {
          toast.success("Course created successfully!");
          closeFormModal();
          fetchCourses();
        }
      }
    } catch (err) {
      console.error("Course save error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save course. Please check inputs.";
      toast.error(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Deletion
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setDeleting(true);
      const res = await adminService.deleteCourse(courseToDelete.id);
      if (res?.success) {
        toast.success("Course and its curriculum lessons deleted.");
        setCourseToDelete(null);
        fetchCourses();
      }
    } catch (err) {
      console.error("Delete course error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Courses
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create, update, and manage rural education courses and syllabus curriculum.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={openCreateModal}
        >
          Add New Course
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search courses by title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
          Total: <span className="font-bold text-slate-900">{pagination.total}</span> Courses
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <LoadingSpinner
          size="lg"
          message="Loading course repository..."
          className="py-16"
        />
      )}

      {/* Course List Table */}
      {!loading && courses.length > 0 && (
        <Card className="p-0 overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Title & Description</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4 text-center">Lessons</th>
                  <th className="py-3.5 px-4 text-center">Students</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 truncate">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {c.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="brand" size="sm">
                        {c.subject}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      <Link
                        to={`/admin/lessons?courseId=${c.id}`}
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-semibold"
                        title="Manage lessons for this course"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{c._count?.lessons || 0}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      <div className="inline-flex items-center gap-1 text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c._count?.enrollments || 0}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/lessons?courseId=${c.id}`}>
                          <Button variant="ghost" size="sm" icon={Layers}>
                            Lessons
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit2}
                          onClick={() => openEditModal(c)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setCourseToDelete(c)}
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Empty State */}
      {!loading && courses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={
            search
              ? "No courses matching your search term. Try another keyword."
              : "Get started by creating your first course for rural students."
          }
          actionLabel="Add New Course"
          actionIcon={Plus}
          onAction={openCreateModal}
        />
      )}

      {/* Create / Edit Course Modal */}
      {isFormOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
            onClick={closeFormModal}
          />

          <div className="relative bg-white rounded-2xl shadow-elevated border border-slate-200 max-w-lg w-full p-6 space-y-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCourse ? "Edit Course" : "Create New Course"}
              </h3>
              <button
                type="button"
                onClick={closeFormModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <Input
                label="Course Title"
                placeholder="e.g. Foundational Mathematics for Grade 8"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (formErrors.title) setFormErrors({ ...formErrors, title: "" });
                }}
                error={formErrors.title}
                required
              />

              <Input
                label="Subject Category"
                placeholder="e.g. Mathematics, Science, Technology, English"
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  if (formErrors.subject) setFormErrors({ ...formErrors, subject: "" });
                }}
                error={formErrors.subject}
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Course Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formErrors.description) setFormErrors({ ...formErrors, description: "" });
                  }}
                  placeholder="Describe what students will learn, concepts covered, and key outcomes..."
                  className={`
                    block w-full rounded-lg border text-sm p-3 transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${
                      formErrors.description
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200"
                        : "border-slate-300 bg-white focus:border-brand-500 focus:ring-brand-100 text-slate-900"
                    }
                  `}
                />
                {formErrors.description && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={closeFormModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={formSubmitting}
                >
                  {editingCourse ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!courseToDelete}
        title="Delete Course?"
        message={`Are you sure you want to delete "${courseToDelete?.title}"? All associated lessons, progress records, and enrollments will be permanently removed.`}
        confirmLabel="Yes, Delete Course"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteCourse}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
}
