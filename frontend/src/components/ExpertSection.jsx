const experts = [
  {
    name: 'Ms. Olivia James',
    qualification: 'M.Sc. in Mathematics, 10+ Years Teaching',
    image: 'https://via.placeholder.com/200x200?text=Olivia',
  },
  {
    name: 'Mr. Ravi Patel',
    qualification: 'B.Ed, Math Olympiad Coach',
    image: 'https://via.placeholder.com/200x200?text=Ravi',
  },
  {
    name: 'Dr. Lisa Chen',
    qualification: 'Ph.D. in Math Education',
    image: 'https://via.placeholder.com/200x200?text=Lisa',
  },
];

const ExpertSection = () => {
  return (
    <section className="bg-white py-16 px-6 text-center">
      <h2 className="text-3xl font-bold text-indigo-900 mb-12">
        Meet Our Experts
      </h2>

      <div className="flex justify-center flex-wrap gap-8">
        {experts.map((expert, idx) => (
          <div
            key={idx}
            className="bg-indigo-50 p-8 rounded-xl w-64 shadow-md transition-transform duration-300 hover:-translate-y-2"
          >
            <img
              src={expert.image}
              alt={expert.name}
              className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              {expert.name}
            </h3>
            <p className="text-gray-700 text-sm">{expert.qualification}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpertSection;
