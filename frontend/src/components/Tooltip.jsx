const Tooltip = ({ text, children }) => {
    return (
        <div className="relative group cursor-pointer">
            { children }
            <span
            className="absolute bottom-7 left-1/2 -translate-x-1/2 text-sm px-2.5 py-1.5 rounded max-w-52 text-center font-bold tracking-widest bg-[#1a1a1a] text-[#d1d5db] shadow-[0_4px_12px_rgba(0,0,0,0.45)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                { text }
            </span>

        </div>
    )
}

export default Tooltip