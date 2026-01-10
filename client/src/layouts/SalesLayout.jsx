const SalesLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative text-white font-semibold">
      {/* Starfield Background */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 starfield" />
      </div>

      {/* Page Content */}
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default SalesLayout;
