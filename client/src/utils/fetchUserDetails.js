import api from "./Axios";
import SummaryApi from "../common/summaryApi";

const fetchUserDetails = async() => {
  try {
      const response = await api({
          ...SummaryApi.userDetails,
      });
      return response.data;
  } catch (error) {
    console.log("Error while fetching the user details: ",error); 
  }
}

export default fetchUserDetails;
