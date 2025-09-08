export default function Timetable() {
  return (
    <div className="timetable" id="timetable">
      <div>
        <span id="prevDay">&lt;</span>
        <h2>Today's Timetable</h2>
        <span id="nextDay">&gt;</span>
      </div>
      <span className="closeBtn">X</span>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Room No.</th>
            <th>Subject</th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
}