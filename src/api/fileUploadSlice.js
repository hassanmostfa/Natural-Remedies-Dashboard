import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://api.naturalremediesapp.com/api";

const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return true;
  return new Date(tokenExpiry) <= new Date();
};

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("admin_refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch(`${baseUrl}/auth/admin/refresh?refresh_token=${refreshToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success && data.access_token) {
      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("admin_refresh_token", data.refresh_token);
      localStorage.setItem("admin_token_expires_at", data.access_token_expires_at);
      localStorage.setItem("admin_refresh_token_expires_at", data.refresh_token_expires_at);
      return data.access_token;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
    localStorage.removeItem("admin_token_expires_at");
    localStorage.removeItem("admin_refresh_token_expires_at");
    localStorage.removeItem("admin_data");
    throw error;
  }
};

 export const fileUploadApiService = createApi({
   reducerPath: "fileUploadApiService",
   baseQuery: fetchBaseQuery({
     baseUrl,
     prepareHeaders: async (headers) => {
       const token = localStorage.getItem("admin_token");
       const tokenExpiry = localStorage.getItem("admin_token_expires_at");
 
       if (token && isTokenExpired(tokenExpiry)) {
         try {
           const newToken = await refreshToken();
           headers.set("Authorization", `Bearer ${newToken}`);
         } catch (error) {
           window.location.href = "/admin/auth/sign-in";
           throw error;
         }
       } else if (token) {
         headers.set("Authorization", `Bearer ${token}`);
       }
 
       // ⚠️ Important: Do NOT set Content-Type manually
       // Let the browser set it with the correct boundary
       return headers;
     },
   }),
   endpoints: (builder) => ({
     // Custom mutation using XMLHttpRequest so we can report real upload progress
     uploadImage: builder.mutation({
       queryFn: async (
         arg,
       ) => {
         try {
           // Accept either a File or an object { file, onProgress }
           const file = arg?.file || arg;
           const onProgress = typeof arg === 'object' ? arg.onProgress : undefined;
 
           const formData = new FormData();
           formData.append("image", file);
 
           console.log('Debug - File being uploaded:', {
             name: file?.name,
             size: file?.size,
             type: file?.type
           });
           console.log('Debug - Upload URL:', `${baseUrl}/upload/image`);
 
           // Ensure we have a fresh token (mirrors baseQuery behaviour)
           let token = localStorage.getItem("admin_token");
           const tokenExpiry = localStorage.getItem("admin_token_expires_at");
           if (token && isTokenExpired(tokenExpiry)) {
             try {
               token = await refreshToken();
             } catch (error) {
               window.location.href = "/admin/auth/sign-in";
               return { error };
             }
           }
 
           const xhr = new XMLHttpRequest();
           const uploadStartTime = Date.now();

           const result = await new Promise((resolve) => {
             xhr.open('POST', `${baseUrl}/upload/image`);
             if (token) {
               xhr.setRequestHeader('Authorization', `Bearer ${token}`);
             }
 
             xhr.upload.onprogress = (event) => {
               if (event.lengthComputable && typeof onProgress === 'function') {
                 const percent = Math.round((event.loaded / event.total) * 100);
                 console.log('XHR Progress:', percent + '%');
                 onProgress(percent);
               }
             };
 
             xhr.onreadystatechange = () => {
               if (xhr.readyState === 4) {
                 try {
                   const json = JSON.parse(xhr.responseText || '{}');
                   if (xhr.status >= 200 && xhr.status < 300) {
                     // Ensure minimum upload time for better UX
                     const uploadTime = Date.now() - uploadStartTime;
                     const minUploadTime = 1500; // 1.5 seconds minimum
                     
                     if (uploadTime < minUploadTime) {
                       setTimeout(() => {
                         resolve({ data: json });
                       }, minUploadTime - uploadTime);
                     } else {
                       resolve({ data: json });
                     }
                   } else {
                     resolve({ error: { status: xhr.status, data: json } });
                   }
                 } catch (e) {
                   resolve({ error: { status: 'PARSING_ERROR', data: xhr.responseText } });
                 }
               }
             };
 
             xhr.onerror = () => {
               resolve({ error: { status: xhr.status || 0, data: xhr.responseText } });
             };
 
             xhr.send(formData);
           });
 
           return result;
         } catch (error) {
           return { error };
         }
       },
     }),
   }),
 });
 
export const { useUploadImageMutation } = fileUploadApiService;

export { refreshToken, isTokenExpired };
