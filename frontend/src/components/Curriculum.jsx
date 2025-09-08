import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicCourseDetails } from "../api/courseApi";
import curriculumIcon from "../assets/bookIcon.png";
import logoVideo from "../assets/logo.mp4";
import StudentRegister from "../pages/StudentRegister";

export default function Curriculum() {
  const { id } = useParams();
  const [curriculums, setCurriculums] = useState([]);
  const [mediaSrc, setMediaSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    getPublicCourseDetails(id)
      .then((res) => {
        setCurriculums(res.data.curriculums || []);

        const vid = res.data.course_video_path;
        const isYouTube =
          typeof vid === "string" && vid.includes("youtube.com");
        const isMathsense =
          isYouTube &&
          (vid.includes("@Mathsenseacademy") || vid.includes("/shorts/"));
        setMediaSrc(isMathsense ? vid : logoVideo);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center my-5">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const getYouTubeEmbedUrl = (url) => {
    let match = url.match(/youtube\.com\/shorts\/([^?]+)/);
    if (match) {
      const id = match[1];
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=1`;
    }
    match = url.match(/v=([^&]+)/);
    const id = match ? match[1] : "";
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&controls=1`;
  };

  const renderMedia = () => {
    if (mediaSrc.includes("youtube.com")) {
      const embedUrl = getYouTubeEmbedUrl(mediaSrc);
      return (
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title="Course video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <video controls src={mediaSrc} className="absolute top-0 left-0 w-full h-full object-cover" />
    );
  };

  return (
    <div className="px-4">
      {/* Header */}
      <div className="text-center my-8">
        <div className="inline-flex items-center bg-yellow-400 border-2 border-black rounded px-4 py-2">
          <div className="flex items-center justify-center w-10 h-10 mr-3 bg-pink-300 border-2 border-black rounded">
            <img src={curriculumIcon} alt="Curriculum Icon" className="max-w-full max-h-full" />
          </div>
          <h2 className="m-0 font-bold text-2xl tracking-wider font-[anton]">CURRICULUM</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Media */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative aspect-[9/16] w-2/3 md:w-full rounded-lg overflow-hidden">
              {renderMedia()}
            </div>
          </div>

          {/* List */}
          <div className="w-full md:w-1/2">
            <ul className="list-none p-0 m-0">
              {curriculums.map((item, idx) => (
                <li
                  key={item.curriculum_id}
                  className="border-2 border-black py-3 px-4 mb-2 rounded text-center font-medium text-black"
                  style={{
                    backgroundColor: [
                      "#5DD3F3",
                      "#FB923C",
                      "#F9A8D4",
                      "#C4B5FD",
                      "#34D399",
                    ][idx % 5],
                  }}
                >
                  {item.curriculum_name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Button */}
        <div className="text-center mt-6">
          <button
            className="inline-block bg-white text-black border border-black rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-gray-100 transition"
            onClick={() => setShowRegisterModal(true)}
          >
            Detailed Curriculum
          </button>
        </div>
      </div>

      {/* Modal */}
      {showRegisterModal && (
        <StudentRegister onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
}
