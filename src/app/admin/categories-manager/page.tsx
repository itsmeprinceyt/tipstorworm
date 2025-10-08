"use client";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../../services/baseApi.service";
import getAxiosErrorMessage from "../../../utils/Variables/getAxiosError.util";
import { CategoriesResponse } from "../../../types/Category/Category.type";

import CategoriesList from "../../(components)/Categories/Categories.component";
import CreateCategoryForm from "../../(components)/Categories/CreateCategories.component";

export default function CategoryManager() {
    const [categoriesData, setCategoriesData] = useState<CategoriesResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit] = useState<number>(10);

    const fetchCategories = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(
                `/admin/category-manager?page=${page}&limit=${limit}&include_creator=true`
            );
            setCategoriesData(response.data);
        } catch (err) {
            toast.error(getAxiosErrorMessage(err, "Failed to fetch categories"));
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchCategories(currentPage);
    }, [fetchCategories, currentPage]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 space-y-8">
                <CreateCategoryForm onCategoryCreated={() => fetchCategories(currentPage)} />
                <CategoriesList
                    categoriesData={categoriesData}
                    loading={loading}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
