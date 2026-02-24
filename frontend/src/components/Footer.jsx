import { InstagramLogoIcon, LinkedinLogoIcon, MetaLogoIcon, NoteIcon, XLogoIcon } from '@phosphor-icons/react'

const Footer = () => {
  return (
    <div className="bg-[#3f0219c4] rounded-t-2xl text-center text-[16px] text-neutral-400 tracking-wide py-2 shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
      <div className='flex items-center justify-between md:px-20 px-4 mb-2.5'>
        <img className='md:w-40 w-38 h-11' src="logo.png" alt="" />
        <svg width="0" height="0">
          <linearGradient id="metaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="instaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#833ab4" />
            <stop offset="50%" stopColor="#fd1d1d" />
            <stop offset="100%" stopColor="#fcb045" />
          </linearGradient>
          <linearGradient id="linkedinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </svg>
        <div className='flex items-center md:gap-8 gap-5'>
          <MetaLogoIcon size={29} weight='duotone' style={{ fill: "url(#metaGradient)" }} />
          <XLogoIcon size={27} weight='duotone' style={{ fill: "url(#xGradient)" }} />
          <InstagramLogoIcon size={28} weight='duotone' style={{ fill: "url(#instaGradient)" }} />
          <LinkedinLogoIcon size={28} weight='duotone' style={{ fill: "url(#linkedinGradient)" }} />
        </div>
      </div>
      <p className='tracking-wider'>© {new Date().getFullYear()} Notes App. All rights reserved.</p>
    </div>
  )
}

export default Footer