import toast from "react-hot-toast";

const AxiosToastError = (error) => {
  // Extract message safely with multiple fallbacks
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong, please try again!";

  toast.error(message);

  //also log full error in console for debugging
  console.error("Axios Error:", error);
};

export default AxiosToastError;
