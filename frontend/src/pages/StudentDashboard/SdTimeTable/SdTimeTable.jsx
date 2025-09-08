

export const SdTimeTable = () => {
  return (
    <main style={{ margin: 0 }} className='studentDashboardMain'>
      <div className="timetable active" id="timetable">
        <div>
          <span id="prevDay">&lt;</span>
          <h2>Today's Timetable</h2>
          <span id="nextDay">&gt;</span>
        </div>
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
    </main>
  )
}
