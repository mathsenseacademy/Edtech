// src/components/StudentRegister/StudentRegister.jsx
import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function StudentRegister({ onClose }) {

  const steps = [
    {
      title: "Your Name",
      fields: [
        {
          name: "first_name",
          label: "First Name",
          type: "text",
          required: true,
        },
        {
          name: "middle_name",
          label: "Middle Name",
          type: "text",
          required: false,
        },
        { name: "last_name", label: "Last Name", type: "text", required: true },
        {
          name: "student_photo_path",
          label: "Upload Image",
          type: "file",
          required: true,
        },
      ],
    },
    {
      title: "Date of Birth",
      fields: [
        {
          name: "date_of_birth",
          label: "Date of Birth",
          type: "date",
          required: true,
        },
      ],
    },
    {
      title: "Contact Numbers",
      fields: [
        {
          name: "contact_number_1",
          label: "Primary Contact",
          type: "text",
          required: true,
        },
        {
          name: "contact_number_2",
          label: "Alternate Contact",
          type: "text",
          required: false,
        },
      ],
    },
    {
      title: "Education",
      fields: [
        { name: "student_class", label: "Class", type: "text", required: true },
        {
          name: "school_or_college_name",
          label: "School",
          type: "text",
          required: true,
        },
        {
          name: "board_or_university_name",
          label: "Board",
          type: "text",
          required: true,
        },
      ],
    },
    {
      title: "Address",
      fields: [
        { name: "address", label: "Address", type: "textarea", required: true },
        { name: "city", label: "City", type: "text", required: true },
        { name: "district", label: "District", type: "text", required: true },
        { name: "state", label: "State", type: "text", required: true },
        { name: "pin", label: "PIN Code", type: "text", required: true },
      ],
    },
    {
      title: "Additional Info",
      fields: [
        {
          name: "notes",
          label: "Notes (optional)",
          type: "textarea",
          required: false,
        },
        { name: "email", label: "Email", type: "email", required: true },
      ],
    },
    {
      title: "Terms And Conditions",
      description:
        "1. Fees once paid is non-refundable/adjustable under any circumstances. Fee installments must be paid on or before the due date.\n" +
        "2. Monthly fees should be paid by latest 10th of the month.\n" +
        "3. Disciplinary actions will be taken against students found guilty of disrupting the classroom.\n" +
        "4. Institute management will have full authority to change the terms and conditions without any prior information.\n" +
        "5. Institute reserves the right to publish the photo and name of the successful candidates for portfolio development of the institute.\n",
      fields: [
        {
          name: "conditions",
          label: "I agree with the terms and conditions.",
          type: "checkbox",
          required: true,
        },
        {
          name: "terms",
          type: "checkbox",
          label:
            "I/We, hereby declare that the information given above is the best of knowledge/belief and nothing has been concealed or distorted. If at any stage I am found to have distorted any information or violated institution's Terms & Conditions, the management will have full authority to restrict the admission",
          required: true,
        },
      ],
    },
  ];

  const allFields = steps.flatMap((s) => s.fields);

  const [formData, setFormData] = useState(
    allFields.reduce(
      (acc, f) => {
        acc[f.name] = f.type === "checkbox" ? false : "";
        return acc;
      },
      {
        country_code_1: "",
        country_code_2: "",
      }
    )
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  const [codesLoading, setCodesLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json",
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const list = await res.json();
        const codes = list
          .map((c) => ({
            code: c.dial_code,
            label: `${c.name} (${c.dial_code})`,
          }))
          .sort((a, b) => a.code.localeCompare(b.code));

        setCountryCodes(codes);

        const india = codes.find((c) => c.code === "+91");
        const defaultCode = india ? india.code : "+91";

        setFormData((f) => ({
          ...f,
          country_code_1: defaultCode,
          country_code_2: defaultCode,
        }));
      } catch (err) {
        console.error("Could not load country codes:", err);
        setFormData((f) => ({
          ...f,
          country_code_1: "+91",
          country_code_2: "+91",
        }));
      } finally {
        setCodesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(
          "coursemanegment/all_courses_show_public/"
        );
        setCourses(data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    })();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const imageToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleChange = async (e) => {
    const { name, type, files, value, checked } = e.target;

    if (type === "file" && files?.[0]) {
      try {
        const rawBase64 = await imageToBase64(files[0]);
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 200;
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let quality = 0.7;
          let compressed = canvas.toDataURL("image/jpeg", quality);
          let blob = await (await fetch(compressed)).blob();
          let sizeKB = blob.size / 1024;

          while (sizeKB > 150 && quality > 0.1) {
            quality -= 0.1;
            compressed = canvas.toDataURL("image/jpeg", quality);
            blob = await (await fetch(compressed)).blob();
            sizeKB = blob.size / 1024;
          }

          setFormData((prev) => ({ ...prev, [name]: compressed }));
          showToast("Image uploaded and compressed", "success");
        };
        img.src = rawBase64;
      } catch (err) {
        console.error("Image upload error", err);
        showToast("Failed to upload image", "danger");
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    for (let f of steps[currentStep].fields) {
      const val = formData[f.name];
      if (f.required && (val === "" || val === false)) {
        return showToast(`${f.label} is required.`, "danger");
      }
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => setCurrentStep((s) => Math.max(0, s - 1));

  const handleRegisterSubmit = async () => {
    for (const f of allFields) {
      const val = formData[f.name];
      if (f.required && (val === "" || val === false)) {
        return showToast(`${f.label} is required.`, "danger");
      }
    }

    const payload = {
      ...formData,
      contact_number_1: `${formData.country_code_1}${formData.contact_number_1}`,
      contact_number_2: formData.contact_number_2
        ? `${formData.country_code_2}${formData.contact_number_2}`
        : "",
    };

    delete payload.country_code_1;
    delete payload.country_code_2;

    try {
      await api.post("student/register/", payload);
      showToast("Registered successfully! Please enter OTP.", "success");
      setShowOtpModal(true);
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.error || "Registration failed.",
        "danger"
      );
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim()) return showToast("OTP is required.", "danger");
    try {
      await api.post("student/otpverify/", { email: formData.email, otp });
      showToast("OTP Verified! 🎉", "success");
      setShowOtpModal(false);
      onClose();
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.student_username?.[0] || "OTP verification failed.",
        "danger"
      );
    }
  };

  const promptExit = () => setShowConfirmExit(true);
  const confirmExit = (yes) => {
    setShowConfirmExit(false);
    if (yes) onClose();
  };

  const { title, description, fields } = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000]" onClick={promptExit} />

      {/* Main Modal */}
      <div className="fixed top-1/2 left-1/2 w-[90%] max-w-md xl:max-w-lg 2xl:max-w-xl transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg overflow-hidden z-[1001] shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center bg-cyan-700 px-4 py-3 text-white">
          <h5 className="text-lg font-semibold">Student Registration</h5>
          <button className="bg-transparent border-none text-2xl text-white cursor-pointer hover:opacity-80" onClick={promptExit}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <h6 className="mb-2 text-amber-700 text-base font-medium">{title}</h6>
          {description && (
            <p
              className="mb-4 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: description.replace(/\n/g, "<br>"),
              }}
            />
          )}

          {fields.length > 1 ? (
            <div className="flex flex-wrap gap-3 mb-4">
              {fields.map((f) => {
                // Phone fields with country code
                if (f.name === "contact_number_1" || f.name === "contact_number_2") {
                  const codeField = f.name === "contact_number_1" ? "country_code_1" : "country_code_2";

                  return (
                    <div key={f.name} className="w-full sm:w-[48%] lg:w-[48%]">
                      <label className="block mb-1 text-cyan-700 font-medium text-sm">{f.label}</label>
                      <div className="flex gap-2">
                        {codesLoading ? (
                          <select disabled className="w-32 p-2 border border-gray-300 rounded text-sm">
                            <option>Loading…</option>
                          </select>
                        ) : (
                          <select
                            name={codeField}
                            value={formData[codeField]}
                            onChange={handleChange}
                            className="w-32 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required={f.required}
                          >
                            {countryCodes.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        )}
                        <input
                          type="tel"
                          name={f.name}
                          value={formData[f.name]}
                          onChange={handleChange}
                          placeholder="1234567890"
                          required={f.required}
                          className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  );
                }

                // Student class dropdown
                if (f.name === "student_class") {
                  return (
                    <div key={f.name} className="w-full sm:w-[48%] lg:w-[30%]">
                      <label className="block mb-1 text-cyan-700 font-medium text-sm">{f.label}</label>
                      {coursesLoading ? (
                        <select disabled className="w-full p-2 border border-gray-300 rounded text-sm">
                          <option>Loading…</option>
                        </select>
                      ) : (
                        <select
                          name="student_class"
                          value={formData.student_class}
                          onChange={handleChange}
                          required={f.required}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">Select a course</option>
                          {courses.map((course) => (
                            <option key={course.ID} value={course.ID}>
                              {`${course.msa_class_level} (${course.course_name})`}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                }

                // All other fields
                const colClass = fields.length === 2 ? "w-full sm:w-[48%]" : "w-full sm:w-[48%] lg:w-[30%]";
                
                return (
                  <div key={f.name} className={colClass}>
                    {f.type === "checkbox" ? (
                      <label className="flex items-start gap-2 text-sm">
                        <input
                          type="checkbox"
                          name={f.name}
                          checked={formData[f.name]}
                          onChange={handleChange}
                          className="mt-1 accent-cyan-700"
                        />
                        <span>{f.label}</span>
                      </label>
                    ) : (
                      <>
                        <label className="block mb-1 text-cyan-700 font-medium text-sm">{f.label}</label>

                        {f.type === "textarea" ? (
                          <textarea
                            name={f.name}
                            value={formData[f.name]}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            rows="3"
                          />
                        ) : f.type === "file" ? (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              name={f.name}
                              onChange={handleChange}
                              className="w-full p-2 mb-3 border border-gray-300 rounded text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-cyan-700 file:text-white file:cursor-pointer hover:file:bg-cyan-800"
                            />
                            {formData[f.name] && (
                              <img
                                src={formData[f.name]}
                                alt="Preview"
                                className="block max-w-full h-auto mt-2 rounded border"
                              />
                            )}
                          </>
                        ) : (
                          <input
                            type={f.type}
                            name={f.name}
                            value={formData[f.name]}
                            onChange={handleChange}
                            required={f.required}
                            className="w-full p-2 mb-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <input
              type={fields[0].type}
              name={fields[0].name}
              placeholder={fields[0].label}
              value={formData[fields[0].name]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-2 bg-gray-50">
          {currentStep > 0 && (
            <button 
              className="border-none rounded px-4 py-2 text-sm cursor-pointer bg-amber-700 text-white hover:bg-amber-800 transition-colors"
              onClick={handleBack}
            >
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button 
              className="border-none rounded px-4 py-2 text-sm cursor-pointer bg-cyan-700 text-white hover:bg-cyan-800 transition-colors"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button 
              className="border-none rounded px-4 py-2 text-sm cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
              onClick={handleRegisterSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded text-white z-[1002] text-sm ${
          toast.type === "success" ? "bg-cyan-700" : "bg-amber-700"
        }`}>
          {toast.message}
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000]" />
          <div className="fixed top-1/2 left-1/2 w-[90%] max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg overflow-hidden z-[1001] shadow-xl">
            <div className="flex justify-between items-center bg-cyan-700 px-4 py-3 text-white">
              <h5 className="text-lg font-semibold">Enter OTP</h5>
              <button
                className="bg-transparent border-none text-2xl text-white cursor-pointer hover:opacity-80"
                onClick={() => setShowOtpModal(false)}
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex justify-end gap-2 px-4 py-2 bg-gray-50">
              <button
                className="border-none rounded px-4 py-2 text-sm cursor-pointer bg-amber-700 text-white hover:bg-amber-800 transition-colors"
                onClick={() => setShowOtpModal(false)}
              >
                Cancel
              </button>
              <button 
                className="border-none rounded px-4 py-2 text-sm cursor-pointer bg-cyan-700 text-white hover:bg-cyan-800 transition-colors"
                onClick={handleOtpSubmit}
              >
                Verify
              </button>
            </div>
          </div>
        </>
      )}

      {/* Confirm Exit Modal */}
      {showConfirmExit && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000]" />
          <div className="fixed top-1/2 left-1/2 w-[90%] max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg overflow-hidden z-[1001] shadow-xl">
            <div className="flex justify-between items-center bg-cyan-700 px-4 py-3 text-white">
              <h5 className="text-lg font-semibold">Quit Registration?</h5>
            </div>
            <div className="p-4">
              <p className="text-sm">All entered data will be lost. Are you sure?</p>
            </div>
            <div className="flex justify-end gap-2 px-4 py-2 bg-gray-50">
              <button 
                className="border-none rounded px-4 py-2 text-sm cursor-pointer bg-amber-700 text-white hover:bg-amber-800 transition-colors"
                onClick={() => confirmExit(false)}
              >
                No, Go Back
              </button>
              <button 
                className="border-none rounded px-4 py-2 text-sm cursor-pointer bg-yellow-400 text-black hover:bg-yellow-500 transition-colors"
                onClick={() => confirmExit(true)}
              >
                Yes, Quit
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}