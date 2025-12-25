import Swal from "sweetalert2";
const successAlert = (title) => {
  return Swal.fire({
    title: title,
    icon: "success",
    confirmButtonColor: '#00b050',
  });
};

//name export ----> export {successAlert}; //or

export default successAlert;
