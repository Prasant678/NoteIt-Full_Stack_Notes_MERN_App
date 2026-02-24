import { useEffect, useRef, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import NoteCard from '../components/NoteCard'
import EditNoteModal from '../components/EditNoteModal';
import { useSearchParams } from 'react-router-dom';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotes, softDelete, toggleArchive, togglePin } from '../redux/features/noteSlice';

const AllNotes = () => {
    const dispatch = useDispatch();
    const { notes, pagination, getLoading } = useSelector((state) => state.notes);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [searchParams, setSearchParams] = useSearchParams();
    const [openModal, setOpenModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [period, setPeriod] = useState(searchParams.get("period") || "all");
    const [selectedDate, setSelectedDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [notesPerPage, setNotesPerPage] = useState(12);
    const [showPagination, setShowPagination] = useState(true);

    const totalPages = pagination?.totalPages || 1;
    const notesRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        const handleScroll = () => {
            if (!notesRef.current) return;
            const navbarHeight = 80;
            const notesTop = notesRef.current.getBoundingClientRect().top - navbarHeight;
            if (notesTop >= 0) {
                setShowPagination(false);
            } else {
                setShowPagination(true);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setNotesPerPage(9);
            } else {
                setNotesPerPage(12);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        notesRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        if (notes?.length > 0) {
            notesRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }, [currentPage]);

    const getVisiblePages = () => {
        if (totalPages <= 3) {
            return Array.from({
                length: totalPages
            }, (_, i) => i + 1);
        }
        if (currentPage === 1) return [1, 2, 3];
        if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages,];
        return [currentPage - 1, currentPage, currentPage + 1];
    };

    useEffect(() => {
        const params = {};
        if (currentPage > 1) {
            params.page = currentPage;
        }
        if (period !== "all" && period !== "custom") {
            params.period = period;
        }
        if (selectedCategory !== "all") {
            params.category = selectedCategory;
        }
        if (search.trim() !== "") {
            params.search = search;
        }
        if (selectedDate) {
            params.month = selectedDate.getMonth() + 1;
            params.year = selectedDate.getFullYear();
        }
        setSearchParams(params);
    }, [currentPage, period, selectedCategory, search, selectedDate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        dispatch(getAllNotes({
            page: currentPage,
            limit: notesPerPage,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            search: search || undefined,
            period: period !== "all" ? period : undefined,
            month: selectedDate ? selectedDate.getMonth() + 1 : undefined,
            year: selectedDate ? selectedDate.getFullYear() : undefined
        }));

    }, [dispatch, isAuthenticated, currentPage, selectedCategory, search, period, selectedDate, notesPerPage]);

    useEffect(() => {
        const month = searchParams.get("month");
        const year = searchParams.get("year");

        if (month && year) {
            const date = new Date(year, month - 1);
            setSelectedDate(date);
            setPeriod("custom");
        }
    }, []);

    const handlePin = async (noteId) => {
        await dispatch(togglePin(noteId)).unwrap();

        dispatch(getAllNotes({
            page: currentPage,
            limit: notesPerPage,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            search: search || undefined,
            period: period !== "all" ? period : undefined,
            month: selectedDate ? selectedDate.getMonth() + 1 : undefined,
            year: selectedDate ? selectedDate.getFullYear() : undefined
        }));
    };

    const handleArchive = async (noteId) => {
        await dispatch(toggleArchive(noteId)).unwrap();

        dispatch(getAllNotes({
            page: currentPage,
            limit: notesPerPage,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            search: search || undefined,
            period: period !== "all" ? period : undefined,
            month: selectedDate ? selectedDate.getMonth() + 1 : undefined,
            year: selectedDate ? selectedDate.getFullYear() : undefined
        }));
    };

    const handleDelete = async (noteId) => {
        await dispatch(softDelete(noteId)).unwrap();

        dispatch(getAllNotes({
            page: currentPage,
            limit: notesPerPage,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            search: search || undefined,
            period: period !== "all" ? period : undefined,
            month: selectedDate ? selectedDate.getMonth() + 1 : undefined,
            year: selectedDate ? selectedDate.getFullYear() : undefined
        }));
    };

    const handleUpdate = (note) => {
        setSelectedNote(note);
        setOpenModal(true);
    };

    const handlePeriodChange = (e) => {
        const value = e.target.value;

        if (value === "custom") {
            setPeriod(value);
            setShowPicker(true);
        } else {
            setPeriod(value);
            setShowPicker(false);
            setSelectedDate(null);
        }
    };

    useEffect(() => {

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setCurrentPage(1);

    }, [search, selectedCategory, period, selectedDate]);

    const isResetDisabled =
        selectedCategory === "all" &&
        search === "" &&
        period === "all" &&
        selectedDate === null;

    const refreshNotes = () => {
        dispatch(getAllNotes({
            page: currentPage,
            limit: notesPerPage,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            search: search || undefined,
            period: period !== "all" ? period : undefined,
            month: selectedDate ? selectedDate.getMonth() + 1 : undefined,
            year: selectedDate ? selectedDate.getFullYear() : undefined
        }));
    };

    return (
        <div ref={notesRef} className='md:px-32 px-6 pt-12 pb-18'>
            <h1 className='text-3xl font-bold tracking-widest mb-6 text-center'>Your All Notes</h1>
            <div className='flex justify-between items-center md:mb-7 mb-5 flex-wrap gap-3'>
                <div className='flex items-center w-full md:w-82'>
                    <label htmlFor="category" className='text-md tracking tracking-widest md:w-62 w-full'>
                        Filter by Category:
                    </label>
                    <select
                        id='category'
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none bg-[#161313] w-full md:w-52 px-2 py-1.5 rounded border-none outline-none shadow-[0_4px_12px_rgba(0,0,0,0.45)] text-center text-neutral-300 text-sm tracking-widest cursor-pointer"
                    >
                        <option value="all">All</option>
                        <option value="personal">Personal</option>
                        <option value="professional">Professional</option>
                        <option value="important">Important</option>
                    </select>
                </div>
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-[#161313] px-3 py-1.5 rounded text-neutral-300 text-sm outline-none shadow-[0_4px_12px_rgba(0,0,0,0.45)] w-full md:w-72 tracking-widest"
                />
                <div className="flex items-center gap-3 w-full md:w-82">
                    <label className="tracking-wider">Filter:</label>
                    <select
                        value={period}
                        onChange={handlePeriodChange}
                        className="bg-[#161313] appearance-none px-3 py-1.5 rounded border-none outline-none shadow-[0_4px_12px_rgba(0,0,0,0.45)] text-center text-neutral-300 text-sm tracking-widest cursor-pointer w-full"
                    >
                        <option value="all">All</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="15days">Last 15 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="year">Last 1 Year</option>
                    </select>
                    <button
                        onClick={() => setShowPicker(true)}
                        className="bg-[#161313] px-3 py-1 w-full rounded text-neutral-300 md:tracking-widest tracking-wider shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
                    >
                        {selectedDate
                            ? `${selectedDate.toLocaleString("default", { month: "short" })} ${selectedDate.getFullYear()}`
                            : "Month/Year"}
                    </button>
                </div>

                <button
                    disabled={isResetDisabled}
                    onClick={() => {
                        setSelectedCategory("all");
                        setSearch("");
                        setPeriod("all");
                        setSelectedDate(null);
                        setCurrentPage(1);
                        setSearchParams({});
                    }}
                    className={`px-3 py-1 rounded w-full tracking-widest md:text-sm text-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.45)] 
                        ${isResetDisabled
                            ? "bg-gray-400/25 text-gray-200/25 cursor-not-allowed"
                            : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg active:scale-95"
                        }`}
                >
                    Reset Filters
                </button>

                {showPicker && (
                    <div
                        className="fixed inset-0 flex items-center justify-center bg-black/25 backdrop-blur-sm z-60 shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
                        onClick={() => setShowPicker(false)}
                    >
                        <div
                            className="bg-[#1a1a1a] pt-1.5 px-1.5 rounded-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                    setPeriod("custom");
                                    setShowPicker(false);
                                }}
                                showMonthYearPicker
                                inline
                                calendarClassName="custom-datepicker" />
                        </div>
                    </div>
                )}
            </div>
            {getLoading ?
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div> :
                <div className='grid md:grid-cols-3 grid-cols-1 items-center justify-center gap-3.5'>
                    {notes?.map(note => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            screen="all"
                            onPinToggle={handlePin}
                            onArchive={handleArchive}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>}
            {totalPages > 1 && (
                <div className={`fixed bottom-25 left-1/2 -translate-x-1/2 bg-[#161616bb] backdrop-blur-xs p-2 rounded-full z-40 flex justify-center items-center mt-8 gap-2 whitespace-nowrap overflow-x-auto max-w-[90vw] transition-all duration-300 ease-out ${showPagination ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}`}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-2 bg-[#07bcc2b6] disabled:opacity-40 rounded-full transition ease-in-out duration-700"
                    >
                        <CaretLeftIcon size={22} />
                    </button>

                    {getVisiblePages().map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3.25 py-1.75 rounded transition-all ease-in-out duration-600 ${currentPage === page
                                ? "bg-linear-to-r from-amber-500 to-pink-500 text-black font-bold rounded-full text-sm"
                                : "hover:bg-linear-to-r from-amber-500 to-pink-500 rounded-full font-semibold text-sm hover:text-black hover:font-bold border border-[#242424]"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-2 bg-[#07bcc2b6] rounded-full disabled:opacity-40 transition ease-in-out duration-700"
                    >
                        <CaretRightIcon size={22} />
                    </button>
                </div>
            )}
            <EditNoteModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                note={selectedNote}
                screen="all"
                onRefresh={refreshNotes}
            />
        </div>
    )
}

export default AllNotes