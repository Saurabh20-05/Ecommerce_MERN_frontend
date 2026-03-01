export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500 text-white";
    case "processing":
      return "bg-blue-500 text-white";
    case "shipped":
      return "bg-indigo-500 text-white";
    case "delivered":
      return "bg-green-600 text-white";
    case "cancelled":
      return "bg-red-600 text-white";
    case "returned":
      return "bg-purple-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};