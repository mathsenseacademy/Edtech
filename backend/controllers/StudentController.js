// =============================================
// BACKEND: StudentController.js (Final Version)
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

      if (!first_name || !last_name || !email || !student_class) {
        return res.status(400).json({
          error: "Missing required fields: first_name, last_name, email, student_class",
        });
      }

      const uid = google_uid || email;
      const now = new Date();
      const timestamp = now.getTime().toString().slice(-6);
      const student_id = `MSA_${now.getMonth() + 1}${now.getFullYear()}_${timestamp}`;

      let existingStudent =
        (google_uid && (await StudentModel.findOne({ google_uid }))) ||
        (await StudentModel.findOne({ email: email.toLowerCase() }));

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
        date_of_birth: date_of_birth || null,
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
        is_registered: true,
        fees_status: "No",
        registered_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      const createdStudent = await StudentModel.create(studentData);

      return res.status(201).json({
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
      console.error("❌ Error registering student:", err);
      return res.status(500).json({ error: "Registration failed. Please try again." });
    }
  },

  // =============================================
  // Get all students
  // =============================================
  async getAll(req, res) {
    try {
      const students = await StudentModel.getAll();
      return res.json(students);
    } catch (err) {
      console.error("❌ Error getting students:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Get verified students
  // =============================================
  async getVerified(req, res) {
    try {
      const students = await StudentModel.getVerified();
      return res.json(students);
    } catch (err) {
      console.error("❌ Error getting verified students:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Get student by ID
  // =============================================
  async getById(req, res) {
    try {
      const student = await StudentModel.getById(req.params.id);
      if (!student) return res.status(404).json({ error: "Student not found" });
      return res.json(student);
    } catch (err) {
      console.error("❌ Error getting student by ID:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Update student details
  // =============================================
  async update(req, res) {
    try {
      const updateData = {
        ...req.body,
        updated_at: new Date().toISOString(),
      };

      const updated = await StudentModel.update(req.params.id, updateData);
      if (!updated) return res.status(404).json({ error: "Student not found" });

      return res.json({
        message: "Student updated successfully",
        student: updated,
      });
    } catch (err) {
      console.error("❌ Error updating student:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // =============================================
  // Check registration status
  // =============================================
  async checkRegistration(req, res) {
    try {
      const { google_uid, email } = req.query;
      if (!google_uid && !email) {
        return res.status(400).json({ error: "Either google_uid or email is required" });
      }

      let student =
        (google_uid && (await StudentModel.findOne({ google_uid }))) ||
        (await StudentModel.findOne({ email: email.toLowerCase() }));

      if (!student) {
        return res.json({
          exists: false,
          is_registered: false,
          message: "Student not found",
        });
      }

      const is_registered =
        student.is_registered ?? !!(student.first_name && student.email && student.student_class);

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
      console.error("❌ Error checking registration:", err);
      return res.status(500).json({ error: "Server error while checking registration" });
    }
  },

  // =============================================
  // Get student profile
  // =============================================
  async getProfile(req, res) {
    try {
      const { uid } = req.params;
      const student = await StudentModel.getById(uid);
      if (!student) return res.status(404).json({ error: "Profile not found" });

      const profile = { ...student };
      delete profile.google_uid;

      return res.json(profile);
    } catch (err) {
      console.error("❌ Error getting profile:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  // Get students by class number
// =============================================
// Get students by class number
// =============================================
async getByClass(req, res) {
  try {
    const { classNumber } = req.params;
    const students = await StudentModel.getByClass(classNumber);

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found for this class" });
    }

    return res.json(students);
  } catch (err) {
    console.error("🔥 Error fetching students by class:", err);
    return res.status(500).json({ message: "Error fetching students by class" });
  }
},


  // =============================================
  // Admin: Toggle Fees (Yes / No)
  // =============================================
  async toggleFees(req, res) {
    try {
      const { uid } = req.params;
      const { status } = req.body; // "Yes" or "No"

      if (!["Yes", "No"].includes(status)) {
        return res.status(400).json({ message: "Invalid fees status. Use 'Yes' or 'No'." });
      }

      const updatedStudent = await StudentModel.updateFeesStatus(uid, status);
      if (!updatedStudent)
        return res.status(404).json({ message: "Student not found while updating fees." });

      return res.status(200).json({
        message: `Fees marked as '${status}' for ${uid}`,
        student: updatedStudent,
      });
    } catch (error) {
      console.error("🔥 Error toggling fees:", error);
      return res.status(500).json({ message: "Server error while updating fees." });
    }
  },

  // =============================================
  // Reset all fees (Admin)
  // =============================================
  async resetMonthlyFees(req, res) {
    try {
      await StudentModel.resetAllFees();
      return res.status(200).json({ message: "✅ All students' fees reset to 'No'" });
    } catch (error) {
      console.error("🔥 Error resetting fees:", error);
      return res.status(500).json({ message: "Server error while resetting fees." });
    }
  },
};