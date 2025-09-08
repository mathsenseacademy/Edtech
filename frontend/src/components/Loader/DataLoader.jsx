const Loader = ({ size = 48, color = "#0d6efd" }) => (
  <span
    className="inline-block animate-spin rounded-full border-4 border-gray-300 border-t-[4px]"
    style={{
      width: size,
      height: size,
      borderTopColor: color, // dynamic color
    }}
  />
);

export default Loader;
