const PaymentBadge = ({ type }) => {
  const colors = {
    cash: "bg-green-500/20 text-green-400 border-green-500/30",
    upi: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    card: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs border ${
        colors[type?.toLowerCase()] ||
        "bg-gray-500/20 text-gray-400 border-gray-500/30"
      }`}
    >
      {type}
    </span>
  );
};

export default PaymentBadge;
