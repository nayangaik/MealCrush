import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


// --- FIX 1: Corrected Environment Variable Names ---
// It's very likely your .env file uses CLOUDINARY, not CLODINARY. Please double-check this.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

const uploadImageClodinary = async (image) => {
    const buffer = image.buffer;

    // --- FIX 2: Added Proper Error Handling for the Upload ---
    const uploadImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "MealCrush" }, (error, uploadResult) => {
            if (error) {
                // If Cloudinary returns an error, we reject the promise
                return reject(error);
            }
            // If the upload is successful, we resolve with the result
            resolve(uploadResult);
        });
        stream.end(buffer);
    });

    return uploadImage;
};

export default uploadImageClodinary;