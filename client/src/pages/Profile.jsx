import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
  
} from "../store/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


function Profile() {
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(file);
  console.log(currentUser);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // ⬅️ Replace with your Cloudinary cloud name
    const UPLOAD_PRESET = "demoxv"; // ⬅️ Replace with your unsigned upload preset
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      // console.log("Uploaded Image URL:", data.secure_url);

      // Now update your formData state to include this URL (assuming it's an avatar)
      setFormData((prevData) => ({
        ...prevData,
        avatar: data.secure_url,
      }));
      // console.log("Updated formData:", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log("updated form data is ",formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch("/api/user/update/"+currentUser._id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),      
      });

      const data = await res.json();
      if(data.success === false){ 
        dispatch(updateUserFailure(data.message));
        return;
      }  
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch("/api/user/delete/"+currentUser._id, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/signin");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 ">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          hidden
          accept="image/*"
          type="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser?.avatar}
          alt="avatar"
          className="rounded-full h-24 w-24 object-cover hover:cursor-pointer self-center mt-2"
        />
        <input
          type="text"
          id="username"
          placeholder="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="change password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button disabled={isLoading} className="bg-slate-700 text-white p-3 rounded-lg mt-4 uppercase hover:opacity-95 disabled:opacity-80">
          {isLoading ? "Updating..." : "Update"}
        </button>
      </form>

      <div className="flex justify-between items-center mt-4">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete account</span>
        <span className="text-red-700 cursor-pointer">sign out</span>
      </div>

      <p className="text-red-700 mt-5">
        {error ? error : ""}
      </p>
      <p className="text-green-700 mt-5 ">
        {updateSuccess ? "updated successfully" : ""}
      </p>
    </div>
  );
}

export default Profile;
