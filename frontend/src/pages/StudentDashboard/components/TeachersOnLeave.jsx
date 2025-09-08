export default function TeachersOnLeave() {
  const teachers = [
    { name: "The Professor", status: "Full Day", photo: "../../../assets/images/profile-2.jpeg" },
    { name: "Lisa Manobal", status: "Half Day", photo: "../../../assets/images/profile-3.jpg" },
    { name: "Himanshu Jindal", status: "Full Day", photo: "../../../assets/images/profile-4.jpg" },
  ];

  return (
    <div className="leaves">
      <h2>Teachers on leave</h2>
      {teachers.map((t, i) => (
        <div className="teacher" key={i}>
          <div className="profile-photo">
            <img src={t.photo} alt="" />
          </div>
          <div className="info">
            <h3>{t.name}</h3>
            <small className="text-muted">{t.status}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
