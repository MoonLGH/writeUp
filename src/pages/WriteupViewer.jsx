import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Shield, Cpu, Network, Terminal, Lock, 
  ChevronLeft, Copy, Check, FileCode, Hash, Download, ExternalLink, Image as ImageIcon
} from 'lucide-react';

// --- SUB-COMPONENTS ---

// 1. Flag Reveal (Hover + Copy)
const FlagReveal = ({ flag }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(flag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div 
      className="my-8 p-6 bg-black/40 border border-green-500/20 rounded-lg text-center backdrop-blur-sm relative group cursor-pointer transition-all hover:border-green-500/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
      onClick={() => setRevealed(!revealed)}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-green-400 font-mono uppercase tracking-widest flex items-center gap-2">
          <Shield size={12} />
          Captured Flag
        </p>
        <div className={`transition-opacity duration-300 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={handleCopy} 
            className="text-slate-500 hover:text-green-400 transition-colors flex items-center gap-1 text-xs font-mono bg-slate-800/50 px-2 py-1 rounded-md border border-slate-700/50 hover:border-green-500/50"
          >
            {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
            <span className="hidden sm:inline">{copied ? "COPIED" : "COPY"}</span>
          </button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-md bg-[#0a0e17] border border-green-900/30 p-4">
        <div 
          className={`font-mono text-lg md:text-xl transition-all duration-500 select-all break-all
            ${revealed ? "text-green-400 blur-0 opacity-100" : "text-slate-600 blur-md opacity-50 group-hover:blur-sm group-hover:opacity-75"}`}
        >
          {flag}
        </div>
        {!revealed && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-400/80 text-xs font-mono uppercase tracking-wider bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm group-hover:text-white transition-colors border border-white/5">
              Click to Reveal
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Smart Header (Auto Icons based on text context)
const SmartHeader = ({ children }) => {
  const text = String(children).toLowerCase();
  let Icon = Hash;
  if (text.includes('scenario') || text.includes('intro')) Icon = Cpu;
  if (text.includes('recon') || text.includes('scan')) Icon = Network;
  if (text.includes('extract') || text.includes('script') || text.includes('code')) Icon = Terminal;
  if (text.includes('verdict') || text.includes('finish') || text.includes('conclusion')) Icon = Lock;

  return (
    <div className="flex items-center gap-3 mt-12 mb-6 border-b border-slate-800 pb-2 group">
      <Icon className="w-5 h-5 text-green-500 group-hover:text-green-400 transition-colors" />
      <h2 className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">
        {children}
      </h2>
    </div>
  );
};

// 3. Code Block (Syntax Highlight + Copy)
const CustomCodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="my-6 border border-slate-700/50 rounded-lg overflow-hidden bg-[#0d1117] shadow-xl relative group">
        <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <FileCode size={14} />
            <span className="uppercase">{match[1]}</span>
          </div>
        </div>
        <button 
          onClick={handleCopy} 
          className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs bg-slate-800/80 px-2 py-1.5 rounded-md border border-slate-700/50 hover:border-slate-500/50 z-10 opacity-0 group-hover:opacity-100 duration-200"
        >
          {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14}/>}
          {copied ? "COPIED" : "COPY"}
        </button>
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, background: 'transparent', fontSize: '0.875rem' }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="bg-slate-800 text-green-300 px-1.5 py-0.5 rounded font-mono text-sm border border-slate-700/50" {...props}>
      {children}
    </code>
  );
};

// 4. Custom Link Handler (Logic Artifact)
const CustomLink = ({ href, children }) => {
  const isArtifact = children === "DOWNLOAD_ARTIFACT";
  
  // Fix path jika artifact menggunakan relative path './'
  let finalHref = href;
  if (href && href.startsWith('./')) {
    finalHref = href.replace('./', '/content/');
  }

  // Jika text link adalah "DOWNLOAD_ARTIFACT", render tombol keren
  if (isArtifact) {
    return (
      <div className="flex justify-center my-8">
        <a 
          href={finalHref} 
          download
          className="group flex items-center gap-3 px-5 py-2.5 bg-[#0a0e17] border border-slate-700 hover:border-green-500/50 rounded hover:bg-green-500/5 transition-all duration-300 no-underline"
        >
          <div className="p-1.5 bg-slate-800 rounded group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors text-slate-400">
            <Download size={16} />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider group-hover:text-green-500/70">Evidence File</div>
            <div className="text-sm font-medium text-slate-300 group-hover:text-white font-sans">DOWNLOAD_ARTIFACT.ZIP</div>
          </div>
        </a>
      </div>
    );
  }

  // Jika link biasa
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 hover:underline inline-flex items-center gap-1">
      {children} <ExternalLink size={12} />
    </a>
  );
};

// 5. Custom Image Handler (SOLUSI GAMBAR YANG HILANG)
const CustomImage = ({ src, alt, ...props }) => {
  let finalSrc = src;
  
  // Logic: Ubah "./gambar.jpg" menjadi "/content/gambar.jpg"
  if (src && src.startsWith('./')) {
    finalSrc = src.replace('./', './content/');
  }

  return (
    <figure className="my-10 group">
      <div className="rounded-lg overflow-hidden border border-slate-700/50 bg-[#0a0e17] relative">
        {/* Placeholder Icon jika gambar loading/error (opsional) */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 -z-10">
            <ImageIcon className="text-slate-800 w-12 h-12" />
        </div>
        
        <img 
          src={finalSrc} 
          alt={alt} 
          className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          {...props} 
        />
      </div>
      {alt && (
        <figcaption className="text-center text-slate-500 text-xs font-mono mt-3 border-b border-slate-800/50 pb-2 inline-block px-4 mx-auto w-full">
          [FIG_CAPTURE]: {alt}
        </figcaption>
      )}
    </figure>
  );
};

// --- MAIN COMPONENT ---

export default function WriteupViewer() {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Asumsi file markdown ada di folder public/content/
    fetch(`./content/${id}.md`)
      .then(res => {
        if (!res.ok) throw new Error("File not found");
        return res.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="font-mono text-green-500 text-sm animate-pulse">INITIALIZING_UPLINK...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-red-900/10 border border-red-500/30 p-6 rounded-lg max-w-md text-center">
        <h2 className="text-red-500 font-mono font-bold mb-2">[!] CONNECT_REFUSED</h2>
        <p className="text-slate-400 text-sm">Target writeup identifier not found.</p>
        <Link to="/" className="inline-block mt-4 text-slate-500 hover:text-slate-300 text-sm font-mono border-b border-slate-600 hover:border-slate-300 transition-colors">
          &lt; Return to Base
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-green-500/30 selection:text-green-200">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-green-400 transition-colors">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
            BACK_TO_ROOT
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono">
            <Shield size={12} />
            <span>SECURE CONNECTION</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <article className="prose prose-invert prose-slate max-w-none 
          prose-headings:font-sans prose-p:leading-relaxed prose-li:text-slate-300
          prose-strong:text-white prose-strong:font-semibold
          prose-a:no-underline">
          
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // H1 Styling
              h1: ({children}) => (
                <header className="text-center mb-16 border-b border-white/5 pb-10">
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">{children}</h1>
                </header>
              ),
              // Standard Paragraph
              p: ({children}) => <p className="text-slate-300 text-lg leading-8 mb-6">{children}</p>,
              // Custom Components Mapping
              h2: SmartHeader,
              code: CustomCodeBlock,
              a: CustomLink,       // Handle Artifact Download + Link Biasa
              img: CustomImage,    // Handle Screenshot/Gambar biar muncul
              blockquote: ({children}) => {
                const flagText = children?.props?.children || children;
                return <FlagReveal flag={flagText} />;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        <footer className="mt-24 pt-8 border-t border-slate-800 flex justify-between items-center text-slate-600 font-mono text-xs">
          <span>GENERATED BY SYSTEM</span>
          <span>EOF</span>
        </footer>
      </main>
    </div>
  );
}