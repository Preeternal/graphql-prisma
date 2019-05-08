import jwt from "jsonwebtoken";

const getUserId = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization // http
    : request.connection.context.Authorization; //web sockets

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisIsASecret");
    return decoded.userId;
  }
  if (requireAuth) {
    throw new Error("Authentication required");
  }
  return null;
};

export { getUserId as default };
