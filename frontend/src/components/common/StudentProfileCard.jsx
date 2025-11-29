import { useState, useEffect } from "react";
import api from "../../api/api";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("access");
        const res = await api.post(
          "student/verify_student_login_otp/",
          { otp: "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("🔥 FULL STUDENT DATA:", res.data);

        setStudent(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center">Loading…</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Debug: Show all keys and detect objects
  console.log("🟢 Student Keys:", Object.keys(student));

  Object.entries(student).forEach(([key, value]) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      console.log(`⚠ Object detected in field: ${key}`, value);
    }
  });

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
    email,
    student_type,
    student_photo_path,
  } = student;

  return (
    <div className="flex justify-center p-8 font-[Poppins]">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg max-w-4xl w-full overflow-hidden">
        
        {/* PHOTO */}
        <div className="flex justify-center items-center bg-gray-100 p-6 md:p-0 md:w-60">
          <img
            src={student_photo_path?.url || "https://via.placeholder.com/150"}
            alt={`${first_name} ${last_name}`}
            className="w-48 h-48 object-cover rounded-full border-4 border-gray-300"
          />
        </div>

        {/* INFO */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {`${first_name} ${middle_name} ${last_name}`.replace(/\s+/g, " ")}
          </h2>

          <p className="text-gray-600 mb-2">
            <strong>Date of Birth:</strong>{" "}
            {new Date(date_of_birth).toLocaleDateString()}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Class:</strong> {student_class}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Type:</strong> {student_type}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Contact:</strong> {contact_number_1}
            {contact_number_2 && `, ${contact_number_2}`}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Email:</strong> {email}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>School/College:</strong> {school_or_college_name}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Board/University:</strong> {board_or_university_name}
          </p>

          <p className="text-gray-600 mb-2">
            <strong>Address:</strong> {`${address}, ${city}, ${district}, ${state} - ${pin}`}
          </p>
        </div>
      </div>
    </div>
  );
}
