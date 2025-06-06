
export default function Home() {
    return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#232946] via-[#121629] to-[#181823] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Glowing background elements */}
      
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600 opacity-30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 opacity-20 rounded-full blur-2xl animate-pulse" />

      {/* Hero Card */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-12 mb-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            SketchForge
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-6">
            The open-source, collaborative, and lightning-fast online whiteboard for teams and creators.<br />
            <span className="text-indigo-300 font-semibold">Draw, brainstorm, and visualize your ideas—together.</span>
          </p>
          <a
            href="/app"
            className="mt-4 px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xl font-bold shadow-lg hover:scale-105 hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            🚀 Launch SketchForge
          </a>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:bg-white/10 transition">
          <span className="text-3xl mb-2 font-bold text-indigo-400">🖊️</span>
          <h3 className="text-xl font-semibold text-white mb-1">Infinite Canvas</h3>
          <p className="text-gray-300">Draw, zoom, and pan without limits. Perfect for brainstorming and mind maps.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:bg-white/10 transition">
          <span className="text-3xl mb-2 font-bold text-pink-400">🤝</span>
          <h3 className="text-xl font-semibold text-white mb-1">Real-time Collaboration</h3>
          <p className="text-gray-300">Work with your team live. See everyone’s changes instantly.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:bg-white/10 transition">
          <span className="text-3xl mb-2 font-bold text-yellow-300">🌙</span>
          <h3 className="text-xl font-semibold text-white mb-1">Dark Mode Native</h3>
          <p className="text-gray-300">Designed for your eyes. Sketch comfortably day or night.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:bg-white/10 transition">
          <span className="text-3xl mb-2 font-bold text-green-400">🔒</span>
          <h3 className="text-xl font-semibold text-white mb-1">Open Source & Private</h3>
          <p className="text-gray-300">Your data, your rules. 100% open source, no tracking or ads.</p>
        </div>
      </div>

      <footer className="relative z-10 mt-8 mb-4 text-gray-400 text-sm text-center">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-white">SketchForge</span> &mdash; Draw your ideas, together.
      </footer>
    </div>
  );
}
