const { admin } = require("../firebaseAdmin");

async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return res.status(401).send("Unauthorized");
  const idToken = header.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded; // uid + claims
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

function requireTeacher(req, res, next) {
  if (req.user?.role === "teacher") return next();
  return res.status(403).send("Forbidden: Teachers only");
}

module.exports = { authenticate, requireTeacher };
