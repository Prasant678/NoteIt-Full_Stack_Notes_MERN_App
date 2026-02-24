import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNote } from '../redux/features/noteSlice';

const AddNote = () => {
  const dispatch = useDispatch();
  const { addLoading } = useSelector((state) => state.notes);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "personal",
    isPinned: false
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addNote(form)).unwrap();
      setForm({
        title: "",
        content: "",
        category: "personal",
        isPinned: false
      });
    } catch (error) {
      console.log("Error:", error.message);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center pt-25 p-6'>
      <h1 className='flex justify-center text-2xl font-bold'>ADD NOTE</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-lg mt-8'>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder='Enter Title' className='p-2.5 border border-[#494949] rounded outline-none focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none' />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder='Enter Content of this Title' rows={6} cols={50} className='p-2.5 border border-[#494949] rounded outline-none focus:ring-[1.25px] focus:ring-[#47ffff] focus:outline-none' />
        <div className="flex flex-col items-center gap-3 w-full">
          <label className="md:text-sm text-md tracking-widest text-neutral-300 font-semibold">
            SELECT A CATEGORY
          </label>
          <div className="flex flex-wrap md:flex-nowrap gap-2 py-1 rounded w-full md:w-auto justify-center">
            {["personal", "professional", "important"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  handleChange({ target: { name: "category", value: cat } })
                }
                className={`px-2 py-1.5 rounded text-sm font-bold tracking-wide md:tracking-wider transition-all duration-200 ${form.category === cat
                  ? "bg-[#3B71CA] text-black"
                  : "text-neutral-300 hover:bg-neutral-700"
                  }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <button className={`w-full border-none outline-none p-2.5 rounded text-black tracking-wider font-bold transition-colors duration-200
          ${addLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[tomato] hover:bg-red-500 cursor-pointer"}`}
        >
          {addLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              Adding...
            </span>
          ) : (
            "ADD NOTE"
          )}
        </button>
      </form>
    </div>
  )
}
export default AddNote