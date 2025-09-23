// =============================================
// BACKEND: Final StudentController.js
// Ready for Node + Firebase Admin + Firestore
// =============================================

import { StudentModel } from "../models/StudentModel.js";

export const StudentController = {
  // =============================================
  // Register a new student
  // =============================================
  async register(req, res) {
    try {
      const {
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        contact_number_1,
        contact_number_2,
        student_class,
        school_or_college_name,
        board_or_university_name,
        address,
        city,
        district,
        state,
        pin,
        notes,
        email,
        google_uid,
        google_photo_url,
        student_photo_path,
      } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !student_class) {
        return res.status(400).json({
          error: "Missing required fields: first_name, last_name, email, student_class",
        });
      }

      const uid = google_uid || email;
      const now = new Date();

      // Generate unique student_id
      const timestamp = now.getTime().toString().slice(-6);
      const student_id = `MSA_${now.getMonth() + 1}${now.getFullYear()}_${timestamp}`;

      // Check for existing student (search by google_uid or email)
      let existingStudent = null;
      if (google_uid) {
        existingStudent = await StudentModel.findOne({ google_uid });
      }
      if (!existingStudent) {
        existingStudent = await StudentModel.findOne({ email: email.toLowerCase() });
      }

      if (existingStudent) {
        return res.status(409).json({
          error: "Student already registered with this email or account",
          student_id: existingStudent.student_id,
        });
      }

      const studentData = {
        uid,
        student_id,
        first_name: first_name.trim(),
        middle_name: middle_name?.trim() || "",
        last_name: last_name.trim(),
        date_of_birth,
        contact_number_1,
        contact_number_2: contact_number_2 || "",
        student_class,
        school_or_college_name: school_or_college_name?.trim() || "",
        board_or_university_name: board_or_university_name?.trim() || "",
        address: address?.trim() || "",
        city: city?.trim() || "",
        district: district?.trim() || "",
        state: state?.trim() || "",
        pin: pin?.trim() || "",
        notes: notes?.trim() || "",
        email: email.toLowerCase().trim(),
        google_uid: google_uid || null,
        google_photo_url: google_photo_url || null,
        student_photo_path: student_photo_path || null,
        is_verified: false,
        is_registered: true, // ✅ Mark registration complete
        registered_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      const createdStudent = await StudentModel.create(studentData);

      res.status(201).json({
        message: "Student registered successfully",
        student_id,
        student: {
          uid: createdStudent.uid,
          student_id: createdStudent.student_id,
          email: createdStudent.email,
          first_name: createdStudent.first_name,
          last_name: createdStudent.last_name,
        },
      });
    } catch (err) {
      console.error("Error registering student:", err);

      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  },

  // =============================================
  // Get all students
  // =============================================
  async getAll(req, res) {
    try {
      const students = await StudentModel.getAll();
      res.json(students);
    } catch (err) {
      console.error("Error getting students:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Get all verified students
  // =============================================
  async getVerified(req, res) {
    try {
      const students = await StudentModel.getVerified();
      res.json(students);
    } catch (err) {
      console.error("Error getting verified students:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Get student by UID
  // =============================================
  async getById(req, res) {
    try {
      const student = await StudentModel.getById(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (err) {
      console.error("Error getting student by ID:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Update student by UID
  // =============================================
  async update(req, res) {
    try {
      const updateData = {
        ...req.body,
        updated_at: new Date().toISOString(),
      };

      const updated = await StudentModel.update(req.params.id, updateData);
      res.json({ message: "Student updated successfully", student: updated });
    } catch (err) {
      console.error("Error updating student:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Check if student exists and registration complete
  // =============================================
  async checkRegistration(req, res) {
    try {
      const { google_uid, email } = req.query;

      console.log("🔍 Checking student registration:", { google_uid, email });

      if (!google_uid && !email) {
        return res.status(400).json({
          error: "Either google_uid or email parameter is required",
        });
      }

      // Look up student
      let student = null;
      if (google_uid) {
        student = await StudentModel.findOne({ google_uid });
      }
      if (!student && email) {
        student = await StudentModel.findOne({ email: email.toLowerCase() });
      }

      if (!student) {
        return res.json({
          exists: false,
          is_registered: false,
          message: "Student not found",
        });
      }

      // ✅ Compute registration status
      const isRegistrationComplete = !!(
        student.first_name &&
        student.last_name &&
        student.email &&
        student.student_class
      );

      const is_registered = student.is_registered ?? isRegistrationComplete;

      console.log("📋 Registration complete:", is_registered);

      return res.json({
        exists: true,
        is_registered,
        student_id: student.student_id,
        student_data: {
          uid: student.uid,
          student_id: student.student_id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          student_class: student.student_class,
          is_verified: student.is_verified,
        },
        message: is_registered
          ? "Student is fully registered"
          : "Student exists but registration incomplete",
      });
    } catch (err) {
      console.error("🚨 Error checking student registration:", err);
      res.status(500).json({
        error: "Server error while checking registration status",
      });
    }
  },

  // =============================================
  // Legacy checkExists
  // =============================================
  async checkExists(req, res) {
    try {
      const { google_uid, email } = req.query;
      if (!google_uid && !email) {
        return res.status(400).json({ error: "google_uid or email required" });
      }

      let student = null;
      if (google_uid) student = await StudentModel.findOne({ google_uid });
      if (!student && email) student = await StudentModel.findOne({ email: email.toLowerCase() });

      res.json({ exists: !!student, studentId: student?.student_id });
    } catch (err) {
      console.error("Error checking student existence:", err);
      res.status(500).json({ error: "Server error" });
    }
  },

  // =============================================
  // Get student profile (dashboard)
  // =============================================
  async getProfile(req, res) {
    try {
      const { uid } = req.params;
      const student = await StudentModel.getById(uid);

      if (!student) {
        return res.status(404).json({ error: "Student profile not found" });
      }

      // Remove sensitive data
      const profile = { ...student };
      delete profile.google_uid;

      res.json(profile);
    } catch (err) {
      console.error("Error getting student profile:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Debug endpoint (dev only)
  // =============================================
  async debugStudent(req, res) {
    try {
      const { google_uid, email } = req.query;
      const allStudents = await StudentModel.getAll();

      const matchingByUid = allStudents.filter((s) => s.google_uid === google_uid);
      const matchingByEmail = allStudents.filter((s) => s.email === email);

      res.json({
        total_students: allStudents.length,
        matching_by_uid: matchingByUid.length,
        matching_by_email: matchingByEmail.length,
        sample_student_keys: allStudents.length > 0 ? Object.keys(allStudents[0]) : [],
        matching_student: matchingByUid[0] || matchingByEmail[0] || null,
        first_few_students: allStudents.slice(0, 3).map((s) => ({
          uid: s.uid,
          google_uid: s.google_uid,
          email: s.email,
          student_id: s.student_id,
        })),
      });
    } catch (err) {
      console.error("🐛 Debug error:", err);
      res.status(500).json({ error: err.message });
    }
  },
};
