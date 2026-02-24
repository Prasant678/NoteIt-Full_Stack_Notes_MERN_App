const About = () => {
  return (
    <div className="min-h-screen bg-transparent px-6 md:pt-21 pt-25 pb-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center md:tracking-widest tracking-wider">
          About Notes App
        </h1>

        <p className="text-lg text-neutral-300 text-center mb-7 tracking-wider">
          This Notes App helps you organize ideas, manage daily tasks, and keep important notes securely in one place. Built with modern MERN stack technologies, it focuses on performance, simplicity, and usability.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              image: "about-ui.jpg",
              title: "Fast & Responsive",
              desc: "Optimized React UI with pagination, filters, and responsive design.",
            },
            {
              image: "about-security.jpg",
              title: "Secure Storage",
              desc: "Notes stored safely with backend authentication and database support.",
            },
            {
              image: "about-developer.jpg",
              title: "Developer Friendly",
              desc: "Clean architecture, scalable structure, and modern best practices.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#161313bb] shadow-[0_4px_12px_rgba(0,0,0,0.45)] rounded-2xl">
              <img className='rounded-t-2xl object-cover' src={item.image} alt="" />
              <div className='p-4'>
                <h3 className="text-xl font-semibold mb-2 tracking-widest">{item.title}</h3>
              <p className="text-neutral-400 tracking-wide">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-neutral-400 text-sm tracking-widest">
          © {new Date().getFullYear()} Notes App — Built with React, Tailwind,
          Node.js & MongoDB.
        </div>
      </div>
    </div>
  )
}

export default About