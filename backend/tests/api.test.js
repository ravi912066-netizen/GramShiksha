const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const jwt = require("jsonwebtoken");
const app = require("../src/server");
const prisma = require("../src/db");

let server;
let baseUrl;
let adminToken;
let studentToken;
let nonEnrolledStudentToken;
let testAdmin;
let testStudent;
let nonEnrolledStudent;
let testCourse;
let testLesson;

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  // Ensure test admin exists
  testAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!testAdmin) {
    testAdmin = await prisma.user.create({
      data: {
        name: "Test Admin",
        email: "testadmin@gramshiksha.org",
        password: "hashedadminpassword",
        role: "ADMIN",
      },
    });
  }

  // Create test student
  testStudent = await prisma.user.create({
    data: {
      name: "Suresh Patel",
      email: `suresh_${Date.now()}@gramshiksha.org`,
      password: "studentpassword123",
      role: "STUDENT",
    },
  });

  // Create another student who is not enrolled
  nonEnrolledStudent = await prisma.user.create({
    data: {
      name: "Anita Sharma",
      email: `anita_${Date.now()}@gramshiksha.org`,
      password: "studentpassword123",
      role: "STUDENT",
    },
  });

  adminToken = jwt.sign(
    { userId: testAdmin.id, role: testAdmin.role },
    process.env.JWT_SECRET
  );
  studentToken = jwt.sign(
    { userId: testStudent.id, role: testStudent.role },
    process.env.JWT_SECRET
  );
  nonEnrolledStudentToken = jwt.sign(
    { userId: nonEnrolledStudent.id, role: nonEnrolledStudent.role },
    process.env.JWT_SECRET
  );
});

after(async () => {
  try {
    if (testCourse) {
      await prisma.course.deleteMany({ where: { id: testCourse.id } });
    }
    if (testStudent) {
      await prisma.user.deleteMany({ where: { id: testStudent.id } });
    }
    if (nonEnrolledStudent) {
      await prisma.user.deleteMany({ where: { id: nonEnrolledStudent.id } });
    }
  } catch (err) {
    // Ignore cleanup errors
  } finally {
    if (server) {
      server.close();
    }
    await prisma.$disconnect();
  }
});

describe("1. Authentication APIs", () => {
  test("POST /api/auth/register - Successfully register new student", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Pooja Verma",
        email: `pooja_${Date.now()}@gramshiksha.org`,
        password: "securepassword123",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.success, true);
    assert.equal(data.user.role, "STUDENT");
    assert.ok(data.user.id);

    // Clean up created user
    await prisma.user.delete({ where: { id: data.user.id } });
  });

  test("POST /api/auth/register - Fails on invalid email format", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bad Email User",
        email: "not-an-email",
        password: "securepassword123",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.success, false);
  });

  test("POST /api/auth/register - Fails on short password", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Short Pwd",
        email: `short_${Date.now()}@gramshiksha.org`,
        password: "123",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.success, false);
  });

  test("POST /api/auth/login - Fails with wrong password", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testStudent.email,
        password: "wrongpassword",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 401);
    assert.equal(data.success, false);
  });

  test("GET /api/users/profile - Returns profile with valid token", async () => {
    const res = await fetch(`${baseUrl}/api/users/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.equal(data.user.id, testStudent.id);
  });
});

describe("2. Course Management APIs", () => {
  test("POST /api/courses - Admin creates a course", async () => {
    const res = await fetch(`${baseUrl}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Agricultural Science for High School",
        description: "Understanding organic farming, soil health, and weather patterns.",
        subject: "Agriculture",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.success, true);
    assert.ok(data.course.id);
    testCourse = data.course;
  });

  test("POST /api/courses - Forbidden for regular student", async () => {
    const res = await fetch(`${baseUrl}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        title: "Unauthorized Course",
        description: "Trying to create without admin permissions",
        subject: "Science",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 403);
    assert.equal(data.success, false);
  });

  test("GET /api/courses - Public course discovery with search", async () => {
    const res = await fetch(
      `${baseUrl}/api/courses?search=agricultural&subject=Agriculture&page=1&limit=10`
    );

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.ok(data.data.courses.length >= 1);
    assert.ok(data.data.pagination);
  });

  test("GET /api/courses/:id - Public single course overview", async () => {
    const res = await fetch(`${baseUrl}/api/courses/${testCourse.id}`);
    const data = await res.json();

    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.equal(data.course.id, testCourse.id);
  });

  test("PUT /api/courses/:id - Admin updates course details", async () => {
    const res = await fetch(`${baseUrl}/api/courses/${testCourse.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Modern Agricultural Science (Updated)",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.course.title, "Modern Agricultural Science (Updated)");
  });
});

describe("3. Lesson Management APIs", () => {
  test("POST /api/courses/:courseId/lessons - Admin creates a lesson", async () => {
    const res = await fetch(`${baseUrl}/api/courses/${testCourse.id}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Soil Preparation and pH Testing",
        description: "Hands-on guide to testing rural soil acidity",
        type: "VIDEO",
        contentUrl: "https://cdn.gramshiksha.org/lessons/soil-prep.mp4",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.success, true);
    assert.equal(data.lesson.type, "VIDEO");
    testLesson = data.lesson;
  });

  test("POST /api/courses/:courseId/lessons - Rejects invalid lesson type", async () => {
    const res = await fetch(`${baseUrl}/api/courses/${testCourse.id}/lessons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: "Invalid Lesson",
        type: "PODCAST",
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.success, false);
  });

  test("GET /api/courses/:courseId/lessons - Public curriculum strips contentUrl", async () => {
    const res = await fetch(`${baseUrl}/api/courses/${testCourse.id}/lessons`);
    const data = await res.json();

    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.ok(data.lessons.length >= 1);
    assert.equal("contentUrl" in data.lessons[0], false);
  });
});

describe("4. Student Course Enrollment APIs", () => {
  test("POST /api/courses/:courseId/enroll - Student enrolls successfully", async () => {
    const res = await fetch(`${baseUrl}/api/courses/${testCourse.id}/enroll`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.success, true);
    assert.equal(data.enrollment.courseId, testCourse.id);
  });

  test("POST /api/courses/:courseId/enroll - Prevents duplicate enrollment (409)", async () => {
    const res = await fetch(`${baseUrl}/api/courses/${testCourse.id}/enroll`, {
      method: "POST",
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 409);
    assert.equal(data.success, false);
  });

  test("GET /api/courses/:courseId/enrollment-status - Returns isEnrolled: true", async () => {
    const res = await fetch(
      `${baseUrl}/api/courses/${testCourse.id}/enrollment-status`,
      {
        headers: { Authorization: `Bearer ${studentToken}` },
      }
    );

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.isEnrolled, true);
  });

  test("GET /api/users/enrollments - Returns list of student enrolled courses", async () => {
    const res = await fetch(`${baseUrl}/api/users/enrollments`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.enrollments.length >= 1);
  });
});

describe("5. Protected Lesson Access APIs", () => {
  test("GET /api/lessons/:id - Non-enrolled student gets 403 Forbidden", async () => {
    const res = await fetch(`${baseUrl}/api/lessons/${testLesson.id}`, {
      headers: { Authorization: `Bearer ${nonEnrolledStudentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 403);
    assert.equal(data.success, false);
  });

  test("GET /api/lessons/:id - Enrolled student receives contentUrl", async () => {
    const res = await fetch(`${baseUrl}/api/lessons/${testLesson.id}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.equal(data.lesson.contentUrl, "https://cdn.gramshiksha.org/lessons/soil-prep.mp4");
  });

  test("GET /api/courses/:courseId/lessons/access - Enrolled student gets protected lessons list", async () => {
    const res = await fetch(
      `${baseUrl}/api/courses/${testCourse.id}/lessons/access`,
      {
        headers: { Authorization: `Bearer ${studentToken}` },
      }
    );

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.ok(data.lessons.length >= 1);
    assert.ok(data.lessons[0].contentUrl);
  });
});

describe("6. Learning Progress Tracking APIs", () => {
  test("POST /api/lessons/:lessonId/progress - Mark lesson completed", async () => {
    const res = await fetch(`${baseUrl}/api/lessons/${testLesson.id}/progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ completed: true }),
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.progress.completed, true);
    assert.equal(data.courseProgress.completionPercentage, 100);
  });

  test("GET /api/lessons/:lessonId/progress - Check single lesson progress", async () => {
    const res = await fetch(`${baseUrl}/api/lessons/${testLesson.id}/progress`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.completed, true);
  });

  test("GET /api/users/progress - Returns overall progress breakdown", async () => {
    const res = await fetch(`${baseUrl}/api/users/progress`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.summary.completedLessons >= 1, true);
  });
});

describe("7. Student Learning Dashboard API", () => {
  test("GET /api/users/dashboard - Returns real aggregated metrics", async () => {
    const res = await fetch(`${baseUrl}/api/users/dashboard`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.ok(data.dashboard.summary);
    assert.equal(data.dashboard.summary.totalEnrolledCourses >= 1, true);
    assert.equal(data.dashboard.summary.completedLessons >= 1, true);
  });
});

describe("8. Admin Management & Analytics APIs", () => {
  test("GET /api/admin/stats - Admin fetches platform analytics", async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.success, true);
    assert.ok(data.stats.users.total >= 1);
    assert.ok(data.stats.courses.total >= 1);
    assert.ok(data.stats.lessons.byType);
  });

  test("GET /api/admin/dashboard - Admin fetches overview dashboard", async () => {
    const res = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.dashboard.metrics);
    assert.ok(data.dashboard.recentActivity);
  });

  test("GET /api/admin/users - Returns users without leaking passwords", async () => {
    const res = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const data = await res.json();
    assert.equal(res.status, 200);
    assert.ok(data.data.users.length >= 1);
    const leakedPassword = data.data.users.some((u) => "password" in u);
    assert.equal(leakedPassword, false);
  });
});

describe("9. Backend Security & Error Handling", () => {
  test("GET /api/nonexistent - Returns 404 Route Not Found", async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent-route-endpoint`);
    const data = await res.json();

    assert.equal(res.status, 404);
    assert.equal(data.success, false);
  });

  test("POST /api/auth/register - Malformed JSON body returns 400", async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ not a json ",
    });

    const data = await res.json();
    assert.equal(res.status, 400);
    assert.equal(data.success, false);
  });
});