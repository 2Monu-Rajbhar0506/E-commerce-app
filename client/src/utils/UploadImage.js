import api from "./Axios";
import SummaryApi from "../common/summaryApi";
import AxiosToastError from "./AxiosToastError";

const uploadImage = async (image) => {
    try {
        const formData = new FormData();
         formData.append("image", image);

        const response = await api({
          ...SummaryApi.uploadImage,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;

    } catch (error) {
        AxiosToastError(error);
        throw error;
    }
}

export default uploadImage;


