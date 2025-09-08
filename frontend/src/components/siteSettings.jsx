import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SiteSettings = () => {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();

  const togglePanel = () => setOpen(!open);

  const handleLangChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const handleThemeChange = (e) => {
    document.documentElement.style.setProperty('--theme-color', e.target.value);
  };

  const handleFontChange = (e) => {
    document.body.style.fontFamily = e.target.value;
  };

  return (
    <div className="fixed bottom-5 right-5 z-[2000]">
      <button
        onClick={togglePanel}
        className="bg-[var(--theme-color,#1a237e)] text-white text-xl w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:scale-105 transition"
      >
        ⚙️
      </button>

      {open && (
        <div className="mt-3 w-56 bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3">
          <label className="flex flex-col text-sm gap-1">
            🌐 Language:
            <select
              onChange={handleLangChange}
              value={i18n.language}
              className="border rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
            </select>
          </label>

          <label className="flex flex-col text-sm gap-1">
            🎨 Theme:
            <input
              type="color"
              onChange={handleThemeChange}
              className="w-10 h-10 border rounded cursor-pointer"
            />
          </label>

          <label className="flex flex-col text-sm gap-1">
            🔤 Font:
            <select
              onChange={handleFontChange}
              className="border rounded px-2 py-1"
            >
              <option value="Arial">Arial</option>
              <option value="'Segoe UI'">Segoe UI</option>
              <option value="'Comic Sans MS'">Comic Sans</option>
              <option value="'Courier New'">Courier</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
};

export default SiteSettings;
