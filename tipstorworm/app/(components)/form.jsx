"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const TipstorForm = () => {
  const router = useRouter();

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFile(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await fetch("/api/TipstorData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        title: formData.title, 
        description: formData.description,
        photo_description: formData.photo_description,
        photo: file, // This will be the base64 string
        hyperlink_description: formData.hyperlink_description,
        hyperlink: formData.hyperlink,
        category: formData.category,
        color: formData.color,
      }),
    });
    
    router.replace("/success");
  };

  const DefaultDummyData = {
    title: "",
    description: "",
    photo_description: "",
    hyperlink_description: "",
    hyperlink: "",
    category: "Websites",
    color: "yellow"
  }

  const [formData, setFormData] = useState(DefaultDummyData);
  const [file, setFile] = useState();

  const categories = ["Websites", "Applications", "Tips&Tricks", "Extras"];
  const colors = [
    "yellow", "green", "blue", "red", "pink", "purple", "indigo", "gray", "black", "white"
  ];
  return (
    <div>
      <form className="flex flex-col gap-3 w-1/2"
        method="post"
        onSubmit={handleSubmit}>
        <h1>Adding Data</h1>

        <label>Title</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.title}
        />

        <label>Description</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="description"
          name="description"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.description}
          row="5"
        />

        <label className="font-medium">Photo Description</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="photo_description"
          name="photo_description"
          onChange={handleChange}
          required={true}
          value={formData.photo_description}
        />

        <label className="font-medium">Photo</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="photo"
          name="photo"
          type="file"
          onChange={handleFileChange}
          required={true}
        />

        <label className="font-medium">Hyperlink Description</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="hyperlink_description"
          name="hyperlink_description"
          onChange={handleChange}
          required={true}
          value={formData.hyperlink_description}
        />
        <label className="font-medium">Hyperlink</label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="hyperlink"
          name="hyperlink"
          type="url"
          onChange={handleChange}
          required={true}
          value={formData.hyperlink}
        />

        <label className="font-medium">Category</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="category"
          name="category"
          onChange={handleChange}
          required={true}
          value={formData.category}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="font-medium">Color</label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          id="color"
          name="color"
          onChange={handleChange}
          required={true}
          value={formData.color}
        >
          {colors.map((color) => {
            const capitalizedColor = color.charAt(0).toUpperCase() + color.slice(1);
            return (
              <option key={color} value={color}>
                {capitalizedColor}
              </option>
            );
          })}
        </select>

        <input
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
          value="Submit"
        />
      </form>
    </div>
  );
}

export default TipstorForm;