import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
      <Link to="/" className="font-bold text-white font-mono"><span className="text-green-400">root</span>@farrel:~$</Link>
      <div className="flex gap-4 text-sm font-mono text-slate-400">
        <Link to="/" className="hover:text-green-400">/home</Link>
      </div>
    </nav>
  );
}
