import { getFirstName, isValidPassword } from "../src/utils/user";
test("Should return first name when given full name ", () => {
  const firstName = getFirstName("Dmitry Preeternal");
  expect(firstName).toBe("Dmitry");
});

test("Should return first name when given first name", () => {
  const firstName = getFirstName("Jen");
  expect(firstName).toBe("Jen");
});

test("Should reject password shorter than 8 characters", () => {
  const isValid = isValidPassword("abc123");
  expect(isValid).toBe(false);
});

test("Should reject password that contains word password", () => {
  const isValid = isValidPassword("abc123Password");
  expect(isValid).toBe(false);
});

test("Should correctly validate a valid password", () => {
  const isValid = isValidPassword("abc123Testing");
  expect(isValid).toBe(true);
});
