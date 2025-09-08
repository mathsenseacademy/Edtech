import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const StudentRegister = ({ onClose }) => {
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Your Name',
      fields: [
        { name: 'first_name', label: 'First Name', type: 'text', required: true },
        { name: 'middle_name', label: 'Middle Name', type: 'text', required: false },
        { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      ],
    },
    {
      title: 'Date of Birth',
      fields: [
        { name: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
      ],
    },
    {
      title: 'Contact Numbers',
      fields: [
        { name: 'contact_number_1', label: 'Primary Contact', type: 'text', required: true },
        { name: 'contact_number_2', label: 'Alternate Contact', type: 'text', required: false },
      ],
    },
    {
      title: 'Education',
      fields: [
        { name: 'student_class', label: 'Class', type: 'text', required: true },
        { name: 'school_or_college_name', label: 'School', type: 'text', required: true },
        { name: 'board_or_university_name', label: 'Board', type: 'text', required: true },
      ],
    },
    {
      title: 'Address',
      fields: [
        { name: 'address', label: 'Address', type: 'textarea', required: true },
        { name: 'city', label: 'City', type: 'text', required: true },
        { name: 'district', label: 'District', type: 'text', required: true },
        { name: 'state', label: 'State', type: 'text', required: true },
        { name: 'pin', label: 'PIN Code', type: 'text', required: true },
      ],
    },
    {
      title: 'Additional Info',
      fields: [
        { name: 'notes', label: 'Notes (optional)', type: 'textarea', required: false },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
    },
  ];

  const allFields = steps.flatMap(s => s.fields);
  const [formData, setFormData] = useState(
    allFields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {})
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    for (let f of steps[currentStep].fields) {
      if (f.required && !formData[f.name].trim()) {
        return showToast(`${f.label} is required.`, 'danger');
      }
    }
    setCurrentStep(s => s + 1);
  };

  const handleBack = () => setCurrentStep(s => Math.max(0, s - 1));

  const handleRegisterSubmit = async () => {
    const missing = allFields.find(f => f.required && !formData[f.name].trim());
    if (missing) {
      return showToast(`${missing.label} is required.`, 'danger');
    }
    try {
      await api.post('student/register/', formData);
      showToast('Registered successfully! Please enter OTP.', 'success');
      setShowOtpModal(true);
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || 'Registration failed. Please try again.',
        'danger'
      );
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim()) return showToast('OTP is required.', 'danger');
    try {
      await api.post('student/otpverify/', { email: formData.email, otp });
      showToast('OTP Verified! 🎉', 'success');
      setShowOtpModal(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.student_username[0] || 'OTP verification failed.', 'danger');
    }
  };

  const { title, fields } = steps[currentStep];

  return (
    <>
      {/* dark overlay */}
      <div className="sr-overlay" onClick={onClose} />

      {/* registration modal */}
      <div className="sr-modal">
        <div className="sr-header">
          <h5>Student Registration</h5>
          <button className="sr-close" onClick={onClose}>×</button>
        </div>

        <div className="sr-body">
          <h6 className="sr-step-title">{title}</h6>

          {title === 'Address' ? (
            <>
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <div className="sr-row">
                {fields.slice(1).map(f => (
                  <div className="sr-col-6" key={f.name}>
                    <label>{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : fields.length > 1 ? (
            <div className="sr-row">
              {fields.map(f => (
                <div
                  key={f.name}
                  className={fields.length === 2 ? 'sr-col-6' : 'sr-col-4'}
                >
                  <label>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      type={f.type}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <input
              type={fields[0].type}
              name={fields[0].name}
              placeholder={fields[0].label}
              value={formData[fields[0].name]}
              onChange={handleChange}
            />
          )}
        </div>

        <div className="sr-footer">
          {currentStep > 0 && (
            <button className="btn-back" onClick={handleBack}>
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button className="btn-next" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="btn-submit" onClick={handleRegisterSubmit}>
              Submit
            </button>
          )}
        </div>
      </div>

      {/* toast notification */}
      {toast.show && (
        <div className={`sr-toast sr-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <>
          <div className="sr-otp-overlay" />
          <div className="sr-otp-modal">
            <div className="sr-header">
              <h5>Enter OTP</h5>
              <button className="sr-close" onClick={() => setShowOtpModal(false)}>
                ×
              </button>
            </div>
            <div className="sr-body">
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </div>
            <div className="sr-footer">
              <button className="btn-back" onClick={() => setShowOtpModal(false)}>
                Cancel
              </button>
              <button className="btn-next" onClick={handleOtpSubmit}>
                Verify
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentRegister;
