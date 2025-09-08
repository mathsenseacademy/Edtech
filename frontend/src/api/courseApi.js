import api from "./api";

// admin-only: list every course (active + inactive)
export const getAllCourses = () =>
  api.get("/coursemanegment/showallcourse/");

// admin-only: create a new course
export const createCourse = (payload) =>
  api.post("/coursemanegment/create_course/", payload);

// admin-only: fetch one course by its ID
export const getCourseById = (id) =>
  api.post("/coursemanegment/showcourseid/", { id });

// admin-only: update an existing course
export const editCourse = (payload) =>
  api.post("/coursemanegment/edit_course/", payload);

// admin-only: add curriculum to a course
export const addCourseCurriculum = (payload) =>
  api.post(
    "/coursemanegment/add_course_curriculum/",
    payload
  );

// public: fetch all active courses
export const getActiveCourses = () =>
  api
    .get("/coursemanegment/all_courses_show_public/")
    .then((res) =>
      res.data.map((c) => ({
        id: c.ID,
        course_name: c.course_name,
      }))
    );

// public: fetch details for one course by ID
export const getPublicCourseDetails = (id) =>
  api.post("/coursemanegment/courses_detail_show_public/", { ID: id });

// fetch list of verified students
export const getVerifiedStudents = () =>
  api.get("/student/verified_student_list/");

// public: fetch all class levels
export const getAllClassLevels = () =>
  api.get("/coursemanegment/show_all_class_levels/");

// public: fetch all category levels
export const getAllCategoryLevels = () =>
  api.get("/coursemanegment/show_all_category_levels/");
// admin/public: fetch all classroom essentials
export const getAllClassroomEssentials = () =>
  api.get("/coursemanegment/show_all_classroom_essentials/");

/** delete one classroom essential by ID */
export const deleteClassroomEssential = (ID) =>
  api.post("/coursemanegment/delete_classroom_essential/", { ID });

// (optional) fetch one essential to prefill an edit form
export const getClassroomEssentialById = (ID) =>
  api.post("/coursemanegment/show_classroom_essential/", { ID });


// create a new essential
export const addClassroomEssential = (payload) =>
  api.post("/coursemanegment/add_classroom_essentials/", payload);

// update an existing essential
export const editClassroomEssential = (payload) =>
  api.post("/coursemanegment/edit_classroom_essentials/", payload);

/** fetch one curriculum by ID for edit */
export const getCurriculumById = payload =>
  api.post('/coursemanegment/show_curriculum_by_id/', payload);

/** update existing curriculum */
export const editCurriculum = payload =>
  api.post('/coursemanegment/edit_curriculum/', payload);


export const getEssentialsById = payload =>
  api.post('/coursemanegment/show_classroom_essentials_by_id/', payload);
