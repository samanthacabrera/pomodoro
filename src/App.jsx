function App() {

  return (
    <>
      <header className="flex items-center justify-between w-full h-20 px-8 bg-[#ffedd3] uppercase tracking-widest font-sans text-sm md:text-base">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold tracking-wide">COACHELLA</h1>
          <h3 className="font-light">APR 10-12 & 17-19, 2026</h3>
        </div>

        <nav className="hidden md:flex space-x-6 font-medium">
          <a href="#">Music</a>
          <a href="#">Passes</a>
          <a href="#">Plan</a>
          <a href="#">Experience</a>
          <a href="#">Shop</a>
          <a href="#" className="font-bold">Join Waitlist</a>
        </nav>

        <div className="hidden md:block">
          ⌕
        </div>
      </header>

      <main></main>
      <footer></footer>
    </>
  )
}

export default App
