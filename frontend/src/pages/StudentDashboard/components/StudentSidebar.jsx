export default function StudentSidebar({ student }) {
  return (
    <div className="profile">
      <div className="top" style={{ marginTop: "-30em" }}>
        <div className="profile-photo">
          <img
            src={student.student_photo_path || "./images/profile-1.jpg"}
            alt="student"
          />
        </div>
        <div className="info">
          <p>Hey, <b>{student.first_name}</b></p>
          <small className="text-muted">ID: {student.student_id}</small>
        </div>
      </div>
      <div className="about">
        <h5>Class</h5>
        <p>{student.student_class}</p>
        <h5>DOB</h5>
        <p>{student.date_of_birth}</p>
        <h5>Contact</h5>
        <p>{student.contact_number_1}</p>
        <h5>Email</h5>
        <p>{student.email}</p>
        <h5>Address</h5>
        <p>{student.address}, {student.city}, {student.state} - {student.pin}</p>
      </div>
    </div>
  );
}