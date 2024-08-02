"use client";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function AddingData() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        const result = await res.json();
        // Redirect to success page with the submitted data
        router.push({
          pathname: '/success',
          query: result,
        });
      } else {
        console.error('Failed to submit the form');
      }
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-red-400 p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Form fields */}
        <div>
          <input
            placeholder="Title"
            {...register("Title", {
              required: {
                value: true,
                message: "Enter Title"
              }
            })}
            type="text"
            className="block mb-2 p-2 border border-gray-300 rounded"
          />
          {errors.Title && <p className="text-red-600">{errors.Title.message}</p>}
        </div>

        <div>
          <input
            placeholder="Description"
            {...register("Description", {
              required: {
                value: true,
                message: "Enter Description"
              }
            })}
            type="text"
            className="block mb-2 p-2 border border-gray-300 rounded"
          />
          {errors.Description && <p className="text-red-600">{errors.Description.message}</p>}
        </div>

        <div>
          <input
            placeholder="Photo Title"
            {...register("PhotoTitle", {
              required: {
                value: true,
                message: "Photo Title Required"
              }
            })}
            type="text"
            className="block mb-2 p-2 border border-gray-300 rounded"
          />
          {errors.PhotoTitle && <p className="text-red-600">{errors.PhotoTitle.message}</p>}
        </div>

        <div>
          <input
            {...register("Photo", {
              required: {
                value: true,
                message: "Photo Attachment Required"
              }
            })}
            type="file"
            accept="image/*"
            className="block mb-2 p-2 border border-gray-300 rounded"
          />
          {errors.Photo && <p className="text-red-600">{errors.Photo.message}</p>}
        </div>

        <div>
          <input
            placeholder="Link Description"
            {...register("LinkDescription", {
              required: {
                value: true,
                message: "Provide Description for the URL"
              }
            })}
            type="text"
            className="block mb-2 p-2 border border-gray-300 rounded"
          />
          {errors.LinkDescription && <p className="text-red-600">{errors.LinkDescription.message}</p>}
        </div>

        <div>
          <input
            placeholder="Link"
            {...register("Link", {
              required: {
                value: true,
                message: "Enter Link"
              },
              pattern: {
                value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                message: "Enter a valid URL"
              }
            })}
            type="url"
            className="block mb-2 p-2 border border-gray-300 rounded"
          />
          {errors.Link && <p className="text-red-600">{errors.Link.message}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block mb-2">Category</label>
          <select
            id="category"
            {...register("category", {
              required: {
                value: true,
                message: "Select a category"
              }
            })}
            className="block mb-2 p-2 border border-gray-300 rounded"
          >
            <option value="">Select a category</option>
            <option value="Websites">Websites</option>
            <option value="Applications">Applications</option>
            <option value="Tips & Tricks">Tips & Tricks</option>
            <option value="Extras">Extras</option>
          </select>
          {errors.category && <p className="text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <label htmlFor="color" className="block mb-2">Color</label>
          <select
            id="color"
            {...register("color", {
              required: {
                value: true,
                message: "Select a color"
              }
            })}
            className="block mb-2 p-2 border border-gray-300 rounded"
          >
            <option value="">Select a color</option>
            <option value="gray">Gray</option>
            <option value="red">Red</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="indigo">Indigo</option>
            <option value="purple">Purple</option>
            <option value="pink">Pink</option>
          </select>
          {errors.color && <p className="text-red-600">{errors.color.message}</p>}
        </div>

        <button
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
