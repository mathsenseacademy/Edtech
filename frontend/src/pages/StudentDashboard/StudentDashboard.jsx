import { useState, useEffect } from 'react';
export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("studentProfile");
    if (raw) setProfile(JSON.parse(raw));
  }, []);

  if (!profile) {
    return <p>Loading profile…</p>;
  }

  const {
    first_name, middle_name, last_name,
    student_id, student_class,
    school_or_college_name,
    date_of_birth, contact_number_1, email
  } = profile;

  return (
    <div className="dashboard">
      <section className="profile-card">
        <h1>
          Welcome, {first_name} {middle_name} {last_name}
        </h1>
        <div className="info-grid">
          <div>
            <h4>ID</h4>
            <p>{student_id}</p>
          </div>
          <div>
            <h4>Class</h4>
            <p>{student_class}</p>
          </div>
          <div>
            <h4>School</h4>
            <p>{school_or_college_name}</p>
          </div>
          <div>
            <h4>DOB</h4>
            <p>{new Date(date_of_birth).toLocaleDateString()}</p>
          </div>
          <div>
            <h4>Contact</h4>
            <p>{contact_number_1}</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>{email}</p>
          </div>
        </div>
      </section>

      {/* … rest of your dashboard (timetable, etc.) … */}
    </div>
  );
}
