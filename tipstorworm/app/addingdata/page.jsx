"use client"
import {useForm} from "react-hook-form";
import {useState} from "react";

export default function AddingData() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async(data) => {
        let r = await fetch("http://localhost:3000/",
            {method: "POST", headers: {
                "Content-Type": "application/json"}, body: JSON.stringify(data)}
        )
        let res = await r.text()
        console.log(data,res);
        // Add your submission logic here
    };

    return (
        <div className="bg-red-400 p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
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

                <input
                    className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
                    disabled={isSubmitting}
                    type="submit"
                    value="Submit"
                />
            </form>
        </div>
    );
};
