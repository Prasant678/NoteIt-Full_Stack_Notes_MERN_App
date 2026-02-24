import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotes, updateNote } from "../redux/features/noteSlice";

const EditNoteModal = ({ isOpen, onClose, note, onRefresh }) => {
    const dispatch = useDispatch();
    const { actionLoadingId, actionType } = useSelector((state) => state.notes);

    const modalRef = useRef();

    const [form, setForm] = useState({
        title: "",
        content: "",
        category: "personal",
    });

    useEffect(() => {
        if (note) {
            setForm({
                title: note.title || "",
                content: note.content || "",
                category: note.category?.toLowerCase() || "personal",
            });
        }
    }, [note]);

    const isUpdating = actionType === "update" && actionLoadingId && actionLoadingId === note?._id;

    const categories = ["personal", "professional", "important"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    const handleUpdate = async () => {
        if (!note?._id) return;

        await dispatch(updateNote({
            noteId: note._id,
            data: form
        })).unwrap();

        onClose();
        onRefresh();
    };

    return (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
            <div
                ref={modalRef}
                className="bg-[#1a1a1ae3] p-6 rounded-md w-[90%] max-w-md shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
            >
                <h2 className="text-xl font-bold mb-4 text-neutral-200 text-center tracking-widest">
                    UPDATE NOTE
                </h2>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="p-2.5 md:text-sm border border-[#3a3a3a] rounded outline-none focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none tracking-wider w-full mb-3 text-neutral-300"
                />
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Content"
                    rows={5}
                    className="p-2.5 md:text-sm border border-[#3a3a3a] rounded outline-none focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none tracking-wider w-full mb-3 text-neutral-300"
                />
                <div className="flex flex-col items-center gap-3">
                    <label className="md:text-sm text-md tracking-widest text-neutral-300 font-semibold">
                        CHANGE CATEGORY
                    </label>
                    <div className="flex flex-wrap md:flex-nowrap gap-2 py-1 rounded w-full md:w-auto justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() =>
                                    handleChange({ target: { name: "category", value: cat } })
                                }
                                className={`px-2 py-1.5 rounded text-[12px] font-bold tracking-wide md:tracking-widest transition-all duration-200 mb-3 ${form.category === cat
                                    ? "bg-[#3B71CA] text-black"
                                    : "text-neutral-300 hover:bg-neutral-700"
                                    }`}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-black tracking-widest w-full py-2 rounded font-bold transition"
                >
                    {isUpdating ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                            Updating...
                        </span>
                    ) : (
                        "UPDATE"
                    )}
                </button>
            </div>
        </div>
    );
};

export default EditNoteModal;