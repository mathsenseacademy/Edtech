// src/components/StudentRegister.jsx
import React, { useState, useEffect, useMemo } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { uploadToFirebase } from "../utils/uploadToFirebase";

export default function StudentRegister({ onClose, googleAuthData = null }) {
  const navigate = useNavigate();
  // Memoized Google auth data from props or session storage
  const authData = useMemo(() => {
    if (googleAuthData) return googleAuthData;
    
    const storedData = sessionStorage.getItem("googleAuthData");
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error("Error parsing Google auth data:", error);
        return null;
      }
    }
    return null;
  }, [googleAuthData]); // Only recalculate when googleAuthData prop changes

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userType = localStorage.getItem("userType");
    const studentUid = localStorage.getItem("studentUid");

    // If not authenticated or not a student, redirect to login
    if (!accessToken || userType !== "student" || !studentUid) {
      console.log("User not authenticated, redirecting to login...");
      navigate("/student/login");
      return;
    }

    // If authenticated but no Google auth data, it means they accessed directly
    // Still allow registration but show a warning
    const storedData = sessionStorage.getItem("googleAuthData");
    if (!storedData) {
      console.log("User authenticated but no Google data found");
      // Optional: You can redirect to login here too if you want to force the Google flow
      // navigate("/student/login");
    }
  }, [navigate]); // Remove authData from dependencies

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

  // Helper function to parse Google display name into first and last name
  const parseGoogleName = (displayName) => {
    if (!displayName) return { firstName: "", lastName: "" };
    
    const nameParts = displayName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    
    return { firstName, lastName };
  };

  const [formData, setFormData] = useState(() => {
    // Initialize form data with Google auth data if available
    const initialData = allFields.reduce(
      (acc, f) => {
        acc[f.name] = f.type === "checkbox" ? false : "";
        return acc;
      },
      {
        country_code_1: "",
        country_code_2: "",
      }
    );

    // Auto-fill Google data if available
    if (authData) {
      const { firstName, lastName } = parseGoogleName(authData.displayName);
      
      initialData.email = authData.email || "";
      initialData.first_name = firstName;
      initialData.last_name = lastName;
    }

    return initialData;
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  const [codesLoading, setCodesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json",
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const list = await res.json();
        
        // Remove duplicates and create unique keys
        const uniqueCodes = new Map();
        list.forEach((country, index) => {
          const key = `${country.dial_code}-${country.code}`;
          if (!uniqueCodes.has(key)) {
            uniqueCodes.set(key, {
              code: country.dial_code,
              label: `${country.name} (${country.dial_code})`,
              uniqueKey: key,
              index: index
            });
          }
        });
        
        const codes = Array.from(uniqueCodes.values())
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


  // Show toast notification about auto-filled data (only once)
  useEffect(() => {
    if (authData) {
      showToast("Email and name auto-filled from Google account", "success");
    }
  }, []); // Empty dependency array to run only once on mount

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleChange = async (e) => {
    const { name, type, files, value, checked } = e.target;

    
    if (type === "file" && files?.[0]) {
  const file = files[0];
  try {
    showToast("Uploading image to Firebase...", "success");
    const downloadURL = await uploadToFirebase(file, "students");
    setFormData((prev) => ({ ...prev, [name]: downloadURL }));
    showToast("Image uploaded successfully ✅", "success");
  } catch (err) {
    console.error("Firebase upload failed:", err);
    showToast("Image upload failed ❌", "danger");
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
    // Validate all required fields
    for (const f of allFields) {
      const val = formData[f.name];
      if (f.required && (val === "" || val === false)) {
        return showToast(`${f.label} is required.`, "danger");
      }
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      contact_number_1: `${formData.country_code_1}${formData.contact_number_1}`,
      contact_number_2: formData.contact_number_2
        ? `${formData.country_code_2}${formData.contact_number_2}`
        : "",
      // Include Google auth data if available
      google_uid: authData?.uid || null,
      google_photo_url: authData?.photoURL || null,
    };

    delete payload.country_code_1;
    delete payload.country_code_2;

    try {
      await api.post("student/register/", payload);
      showToast("Registration successful! 🎉", "success");
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.error || "Registration failed. Please try again.",
        "danger"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    // Clear Google auth data from session storage
    sessionStorage.removeItem("googleAuthData");
    setShowSuccessModal(false);
    
    // Navigate to dashboard instead of calling onClose
    navigate("/student/dashboard");
  };

  const promptExit = () => setShowConfirmExit(true);
  const confirmExit = (yes) => {
    setShowConfirmExit(false);
    if (yes) {
      // Clear session data and redirect to login
      sessionStorage.removeItem("googleAuthData");
      navigate("/login/student");
    }
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
          <h5 className="text-lg font-semibold">
            Student Registration
            {authData && (
              <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded">
                Google Account
              </span>
            )}
          </h5>
          <button className="bg-transparent border-none text-2xl text-white cursor-pointer hover:opacity-80" onClick={promptExit}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Warning message if no Google auth data */}
          {!authData && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Manual Registration</h4>
                  <p className="text-xs text-yellow-700 mb-2">
                    You're registering manually. For a better experience with auto-filled information, please use Google login from the login page.
                  </p>
                  <button
                    onClick={() => navigate("/student/login")}
                    className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition-colors"
                  >
                    Go to Login Page
                  </button>
                </div>
              </div>
            </div>
          )}
          
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
                              <option key={c.uniqueKey} value={c.code}>
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
                  const classes = [
                    { value: "1", label: "Class 1" },
                    { value: "2", label: "Class 2" },
                    { value: "3", label: "Class 3" },
                    { value: "4", label: "Class 4" },
                    { value: "5", label: "Class 5" },
                    { value: "6", label: "Class 6" },
                    { value: "7", label: "Class 7" },
                    { value: "8", label: "Class 8" },
                    { value: "9", label: "Class 9" },
                    { value: "10", label: "Class 10" },
                    { value: "11", label: "Class 11" },
                    { value: "12", label: "Class 12" },
                  ];

                  return (
                    <div key={f.name} className="w-full sm:w-[48%] lg:w-[30%]">
                      <label className="block mb-1 text-cyan-700 font-medium text-sm">{f.label}</label>
                      <select
                        name="student_class"
                        value={formData.student_class}
                        onChange={handleChange}
                        required={f.required}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select a class</option>
                        {classes.map((cls) => (
                          <option key={cls.value} value={cls.value}>
                            {cls.label}
                          </option>
                        ))}
                      </select>
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
                        <label className="block mb-1 text-cyan-700 font-medium text-sm">
                          {f.label}
                          {authData && (f.name === "email" || f.name === "first_name" || f.name === "last_name") && (
                            <span className="ml-1 text-xs text-green-600">(Auto-filled)</span>
                          )}
                        </label>

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
                            className={`w-full p-2 mb-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                              authData && (f.name === "email" || f.name === "first_name" || f.name === "last_name") 
                                ? "bg-green-50" 
                                : ""
                            }`}
                            readOnly={f.name === "email" && authData}
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
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button 
              className="border-none rounded px-4 py-2 text-sm cursor-pointer bg-cyan-700 text-white hover:bg-cyan-800 transition-colors"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </button>
          ) : (
            <button 
              className={`border-none rounded px-4 py-2 text-sm cursor-pointer transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-yellow-400 text-black hover:bg-yellow-500'
              }`}
              onClick={handleRegisterSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
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

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000]" />
          <div className="fixed top-1/2 left-1/2 w-[90%] max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg overflow-hidden z-[1001] shadow-xl">
            <div className="flex justify-between items-center bg-green-600 px-4 py-3 text-white">
              <h5 className="text-lg font-semibold">Registration Successful! 🎉</h5>
            </div>
            <div className="p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h6 className="text-lg font-semibold text-gray-900 mb-2">Welcome to our institute!</h6>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your registration has been completed successfully. Your Google account has been linked and you can now access your student dashboard.
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-blue-800 text-xs">
                  <strong>Account Linked:</strong> You can now login anytime using your Google account to access your student portal and course materials.
                </p>
              </div>
            </div>
            <div className="flex justify-center px-4 py-3 bg-gray-50">
              <button 
                className="border-none rounded px-6 py-2 text-sm cursor-pointer bg-cyan-700 text-white hover:bg-cyan-800 transition-colors"
                onClick={handleSuccessModalClose}
              >
                Go to Dashboard
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