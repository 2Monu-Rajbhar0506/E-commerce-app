import axios from "axios";
import SummaryApi, { baseURL } from "../common/summaryApi.js";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// REQUEST INTERCEPTOR — attach access token
api.interceptors.request.use(
  //Inside an Axios request interceptor, config represents the HTTP request configuration object that Axios will send to the server.You are modifying the outgoing request before it is sent.
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR — handle token expiry and refresh
api.interceptors.response.use(
  (response) => response, // if success, return it
  async (error) => {
    const originalRequest = error.config;

    // if unauthorized and retry flag not set
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // retry original failed request
        }
      }
    }
    return Promise.reject(error);
  }
);

// refresh token function
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await api({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const newAccessToken = response.data?.data?.accessToken;
    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }

    return newAccessToken;
  } catch (erorr) {
    console.log("Refresh token failed", error);
    // optional: logout user here
    return null;
  }
};



export default api;

/**error.response?.status === 401
 * 
This checks if the API request failed because the access token is expired or invalid.
401 = Unauthorized
Typically happens when JWT access token expires

So this condition tells us:
“The user is authenticated, but their token is no longer valid — we may need to refresh it.”

2️⃣ !originalRequest._retry
This checks whether this request has already attempted token refresh.
originalRequest is the same request config that failed
_retry is a custom flag we attach to avoid infinite retry loops
If _retry is false or undefined, it means:
We have not tried refreshing the token for this request yet.

So we set:
originalRequest._retry = true;


Meaning:
“We’re going to refresh the token and retry this request only once.”

🧠 Why is this necessary?
Without _retry, the logic could enter an infinite loop like:
Token expires → 401
Refresh attempt fails OR refresh token also expired → again 401
Interceptor tries refresh again
Repeat forever → browser hangs or crashes

_retry ensures:
✔ refresh is attempted only once per failed request
✔ prevents infinite looping
✔ keeps app stable */

/**

 ┌──────────────────────────────────────┐
 │          User makes request          │
 └──────────────────────────────────────┘
                   │
                   ▼
       Axios attaches Access Token
                   │
                   ▼
         Server returns response?
         ┌───────────────────────────────┐
         │ 200 OK → return data          │
         └───────────────────────────────┘
                   │
                   ▼
         Request completed successfully


            If token expired:
                   │
                   ▼
      Server returns 401 Unauthorized
                   │
                   ▼
     Axios Response Interceptor detects error
                   │
                   ▼
  Check → Do we have Refresh Token available?
                   │
          ┌────────┴────────┐
          ▼                 ▼
     No → Logout       Yes → Call /refresh-token API
                               │
                               ▼
               New Access Token received?
                      │
              ┌───────┴────────┐
              ▼                 ▼
         No → Logout      Yes → Save new token
                               │
                               ▼
                  Retry original request




 */
