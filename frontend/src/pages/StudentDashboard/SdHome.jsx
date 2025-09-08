import { useEffect, useState } from "react";
import StudentSidebar from "./components/StudentSidebar";
import AttendanceSection from "./components/AttendanceSection";
import Timetable from "./components/Timetable";
import Announcements from "./components/Announcements";
import TeachersOnLeave from "./components/TeachersOnLeave";

export const SdHome = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const profileData = localStorage.getItem("studentProfile");

    if (!token || !profileData) {
      window.location.href = "/login";
      return;
    }

    setStudent(JSON.parse(profileData));
  }, []);

  if (!student) return <p>Loading student data...</p>;

  return (
    
    <div className="container-student studentDashboardMain" style={{ margin: 0 }}>
        {/* hello student  */}
      <aside>
        <StudentSidebar student={student} />
      </aside>

      <main>
        <h1>Attendance</h1>
        <AttendanceSection />
        <Timetable />
      </main>

      <div className="right">
        <Announcements />
        <TeachersOnLeave />
      </div>
    </div>
  );
};