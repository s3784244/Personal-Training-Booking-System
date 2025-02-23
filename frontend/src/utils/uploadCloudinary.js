// Import environment variables for Cloudinary
const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const cloud_name = import.meta.env.VITE_CLOUD_NAME;

// Function to upload an image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  // Create a new FormData object to store the file and other parameters
  const uploadData = new FormData();

  // Append the image file to the FormData object
  uploadData.append("file", file);

  // Append the upload preset (used for unsigned uploads in Cloudinary)
  uploadData.append("upload_preset", upload_preset);

  // Append the Cloudinary cloud name
  uploadData.append("cloud_name", cloud_name);

  // Send the request to Cloudinary's API
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, // Cloudinary upload URL
    {
      method: "post", // HTTP POST method for uploading
      body: uploadData, // Attach the FormData containing the file and preset
    }
  );

  // Parse the response as JSON
  const data = await res.json();

  // Return the uploaded image's response data
  return data;
};

// Export the function for use in other parts of the application
export default uploadImageToCloudinary;
