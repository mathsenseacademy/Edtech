export default function AttendanceSection() {
  const subjects = [
    { icon: "architecture", name: "Engineering Graphics", count: "12/14", percent: "86%" },
    { icon: "functions", name: "Mathematical Engineering", count: "27/29", percent: "93%" },
    { icon: "computer", name: "Computer Architecture", count: "27/30", percent: "81%" },
    { icon: "dns", name: "Database Management", count: "24/25", percent: "96%" },
    { icon: "router", name: "Network Security", count: "25/27", percent: "92%" },
  ];

  return (
    <div className="subjects">
      {subjects.map((s, i) => (
        <div className={s.icon.slice(0, 2)} key={i}>
          <span className="material-icons-sharp">{s.icon}</span>
          <h3>{s.name}</h3>
          <h2>{s.count}</h2>
          <div className="progress">
            <svg><circle cx="38" cy="38" r="36"></circle></svg>
            <div className="number"><p>{s.percent}</p></div>
          </div>
          <small className="text-muted">Last 24 Hours</small>
        </div>
      ))}
    </div>
  );
}


