import { set } from "mongoose";
import { useState } from "react";

function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [isImageUploadError, setIsImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageSubmit = async (e) => {
    console.log("Files in the handleImageSubmit:", files);
    setUploading(true);
    setIsImageUploadError(false);

    if (files.length > 0 && files.length < 7) {
      const promises = [];
      const imgArr = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((imageUrls) => {
          console.log(
            "Uploaded Image URLs:",
            imageUrls.forEach((url) => {
              console.log(url.secure_url);
            })
          );

          imageUrls.forEach((url) => {
            imgArr.push(url.secure_url);
          });
          // You can now store imageUrls in state to submit with the form later
          setFormData({
            ...formData,
            imageUrls: imgArr,
          });
          setIsImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          // console.error("Image upload failed", err);
          setIsImageUploadError("Image upload failed");
          setUploading(false);
        });

      //   try {
      //     const uploadedImages = await Promise.all(promises);
      //     const imageUrls = uploadedImages.map((img) => img.secure_url);
      //     console.log("Uploaded Image URLs:", imageUrls);
      //     // You can now store imageUrls in state to submit with the form later
      //   } catch (err) {
      //     console.error("Image upload failed", err);
      //   }
      // } else {
      //   alert("Please upload between 1 and 6 images.");
      // }
    } else {
      if (files.length === 0) {
        setIsImageUploadError("Please upload at least one image");
        setUploading(false);
      } else {
        setIsImageUploadError("you can upload maximum 6 images");
        setUploading(false);
      }
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // ⬅️ Replace with your Cloudinary cloud name
      const UPLOAD_PRESET = "demoxv"; // ⬅️ Replace with your unsigned upload preset
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", UPLOAD_PRESET);
      data.append("cloud_name", CLOUD_NAME);

      fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="border p-3 rounded-lg"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking Spot</span>
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedroom"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg bg-white"
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bats"
                min="1"
                max="5"
                required
                className="p-3 border-gray-300 rounded-lg bg-white"
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg bg-white"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg bg-white"
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-700 ml-2">
              the first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded w-full bg-blue-50"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {isImageUploadError && isImageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => {
              return (
                <div
                  key={url}
                  className="flex justify-between p-3  items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
