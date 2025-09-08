// src/components/ClassroomEssentials.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

export default function ClassroomEssentials({ items }) {
  const [openKey, setOpenKey] = useState(null);
  const toggle = (key) =>
    setOpenKey((current) => (current === key ? null : key));

  if (!items || items.length === 0) {
    return (
      <section className="max-w-[700px] mx-auto mt-8 px-4 font-serif">
        <h2 className="text-center text-3xl font-bold mb-2">
          Classroom essentials
        </h2>
        <div className="inline-block mx-auto my-4 px-6 py-2 border border-black rounded-full text-sm text-center">
          A 360° approach for excellence in school & beyond
        </div>
        <p className="text-center text-gray-500">No essentials available yet.</p>
      </section>
    );
  }

  return (
    <section className="max-w-[700px] mx-auto mt-8 px-4 font-serif">
      <h2 className="text-center text-3xl font-bold mb-4">
        Classroom essentials
      </h2>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => {
          const key = item.classroom_essential_id ?? i;
          const isOpen = openKey === key;
          const svgIndex = i % 3;

          // pick background image
          const bgMap = [
            "bg-[url('/assets/classEssential.svg')]",
            "bg-[url('/assets/classEssential1.svg')]",
            "bg-[url('/assets/classEssential2.svg')]",
          ];

          return (
            <div
              key={key}
              className="rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 shadow"
            >
              <div
                onClick={() => toggle(key)}
                className={`flex justify-between items-center px-5 py-4 cursor-pointer text-black ${bgMap[svgIndex]} bg-cover bg-center`}
              >
                <span className="font-medium text-lg">
                  {item.classroom_essentials_name}
                </span>
                {isOpen ? (
                  <AiOutlineUp className="text-2xl" />
                ) : (
                  <AiOutlineDown className="text-2xl" />
                )}
              </div>
              {isOpen && (
                <div className="px-5 py-4 bg-gray-200 text-sm leading-relaxed">
                  <p>{item.classroom_essentials_description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

ClassroomEssentials.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      classroom_essential_id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      classroom_essentials_name: PropTypes.string.isRequired,
      classroom_essentials_description: PropTypes.string.isRequired,
    })
  ),
};
