import { isValidEmail, validateRegistration, validateLogin } from "./validators.js";

// Simple test runner for validation utilities
function runTests() {
  console.log("Running GramShiksha Frontend Unit Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // Email Validation Tests
  console.log("Email Validation:");
  assert(isValidEmail("student@gramshiksha.org"), "Accepts valid student email");
  assert(isValidEmail("ramesh.kumar@rural.edu.in"), "Accepts valid educational domain");
  assert(!isValidEmail("invalid-email"), "Rejects invalid email format without @");
  assert(!isValidEmail("@missingusername.com"), "Rejects email without local part");
  assert(!isValidEmail(""), "Rejects empty email");

  // Registration Validation Tests
  console.log("\nRegistration Form Validation:");
  const validReg = validateRegistration({
    name: "Ramesh Patel",
    email: "ramesh@example.com",
    password: "password123",
    confirmPassword: "password123",
  });
  assert(validReg.isValid, "Valid registration passes validation");

  const mismatchReg = validateRegistration({
    name: "Ramesh Patel",
    email: "ramesh@example.com",
    password: "password123",
    confirmPassword: "differentPassword",
  });
  assert(!mismatchReg.isValid && mismatchReg.errors.confirmPassword, "Catches password mismatch");

  const shortPassReg = validateRegistration({
    name: "Ramesh Patel",
    email: "ramesh@example.com",
    password: "123",
    confirmPassword: "123",
  });
  assert(!shortPassReg.isValid && shortPassReg.errors.password, "Enforces minimum 6 characters password");

  // Login Validation Tests
  console.log("\nLogin Form Validation:");
  const validLogin = validateLogin({
    email: "ramesh@example.com",
    password: "password123",
  });
  assert(validLogin.isValid, "Valid login payload passes validation");

  const missingPassLogin = validateLogin({
    email: "ramesh@example.com",
    password: "",
  });
  assert(!missingPassLogin.isValid && missingPassLogin.errors.password, "Catches missing password");

  console.log(`\nTests Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
