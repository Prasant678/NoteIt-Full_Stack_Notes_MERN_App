import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { EnvelopeIcon, ListIcon, SealCheckIcon, SignOutIcon, UserIcon, XIcon } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";
import { clearNotes } from "../redux/features/noteSlice";

const Navbar = ({ openAuth }) => {
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();

    const { user, loading } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            dispatch(clearNotes());
        } catch (error) {
            toast.error(error?.message || "Logout Failed");
        }
    }

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#3f0219] text-neutral-200 tracking-widest">
            <div className="flex justify-between items-center px-4 md:px-14 md:py-2 py-3">
                <div className="flex items-center gap-4">
                    <button
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-neutral-300"
                    >
                        {isOpen ? <XIcon size={25} /> : <ListIcon size={25} />}
                    </button>
                    <Link to={"/"}>
                        <img
                            className="md:w-40 w-38 h-11"
                            src="logo.png"
                            alt="NOTEAPP"
                        />
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 font-bold">
                    <NavLink to="/" end className={({ isActive }) => isActive ? "text-yellow-400" : ""}>HOME</NavLink>
                    <NavLink to="/archived-notes" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>ARCHIVED</NavLink>
                    <NavLink to="/deleted-notes" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>DELETED</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "text-yellow-400" : ""}>ABOUT</NavLink>
                </div>

                <div className="hidden md:flex gap-3">
                    {user && (
                        <>
                            <div className="flex items-center justify-center gap-1">
                                <UserIcon size={18} color="#3B71CA" weight="fill" />
                                <p className="text-[13px] mt-1">{user.name}</p>
                            </div>
                            <div className="flex items-center justify-center gap-1">
                                <EnvelopeIcon size={18} color="#E4A11B" weight="fill" />
                                <p className="text-[13px]">{user.email}</p>
                                <SealCheckIcon weight="fill" size={22} color="#14A44D" />
                            </div>
                        </>
                    )}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className={`flex items-center gap-2 md:px-4 px-3 py-1 rounded font-bold text-black transition
                                ${loading
                                    ? "bg-red-400 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600 cursor-pointer"}`}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                                    <p>Logging out...</p>
                                </>
                            ) : (
                                <>
                                    <p className="mt-0.5">LOGOUT</p>
                                    <SignOutIcon size={20} weight="fill" aria-hidden="true" />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={openAuth}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 transition md:px-4 px-3 py-1 rounded font-bold text-black cursor-pointer"
                        >
                            <UserIcon size={20} weight="fill" aria-hidden="true" />
                            <p className="mt-0.5">LOGIN</p>
                        </button>
                    )}
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden flex flex-col p-6 justify-between font-bold bg-[#1a1a1a]/70 border-t border-[#1a1a1a]/10 rounded-t-lg fixed inset-x-0 top-14 bottom-0 backdrop-blur-sm animate-in slide-in-from-left fade-in duration-500 mt-1">
                    <div className="flex flex-col justify-center items-center gap-6">
                        <NavLink to="/" end className={({ isActive }) => `text-[19px] ${isActive ? "text-yellow-400 border-b-2 border-yellow-400 pb-1" : ""}`} onClick={closeMenu}>HOME</NavLink>
                        <NavLink to="/archived-notes" className={({ isActive }) => `text-[19px] ${isActive ? "text-yellow-400 border-b-2 border-yellow-400 pb-1" : ""}`} onClick={closeMenu}>ARCHIVED</NavLink>
                        <NavLink to="/deleted-notes" className={({ isActive }) => `text-[19px] ${isActive ? "text-yellow-400 border-b-2 border-yellow-400 pb-1" : ""}`} onClick={closeMenu}>DELETED</NavLink>
                        <NavLink to="/about" className={({ isActive }) => `text-[19px] ${isActive ? "text-yellow-400 border-b-2 border-yellow-400 pb-1" : ""}`} onClick={closeMenu}>ABOUT</NavLink>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        {user && (
                            <>
                                <div className="flex items-center justify-center gap-2">
                                    <UserIcon size={25} color="#3B71CA" weight="fill" />
                                    <p className="text-[17px] mt-0.5">{user.name}</p>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <EnvelopeIcon size={25} color="#E4A11B" weight="fill" />
                                    <p className="text-[17px]">{user.email}</p>
                                    <SealCheckIcon weight="fill" size={22} color="#14A44D" />
                                </div>
                            </>
                        )}
                        {user ?
                            <button
                                onClick={handleLogout}
                                className={`flex items-center justify-center gap-1 w-full px-4 py-2 rounded text-black transition
                                    ${loading
                                    ? "bg-red-400 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-600 cursor-pointer"}`}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                                        <p>Logging out...</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="mt-0.5">LOGOUT</p>
                                        <SignOutIcon size={20} weight="fill" aria-hidden="true" />
                                    </>
                                )}
                            </button>
                            :
                            <button
                                onClick={() => {
                                    openAuth();
                                    setIsOpen(false);
                                }}
                                className="flex items-center w-full justify-center gap-1 bg-blue-500 px-4 py-2 rounded text-black"
                            >
                                <UserIcon size={20} weight="fill" aria-hidden="true" />
                                <p className="text-lg mt-0.5">LOGIN</p>
                            </button>
                        }
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;