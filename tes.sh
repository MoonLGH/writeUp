#!/bin/bash

# Nama Project
PROJECT_NAME="farrel-portfolio-ctf"

echo "🚀 Memulai setup Portfolio System (Markdown Renderer)..."

# 1. Create Vite Project
echo "📦 Membuat project React + Vite..."
npm create vite@latest "$PROJECT_NAME" -- --template react

cd "$PROJECT_NAME" || exit

# 2. Install Dependencies (Router + Markdown Engine + Utils)
echo "⬇️  Menginstall dependencies..."
npm install
npm install react-router-dom \
            react-markdown \
            rehype-raw \
            rehype-highlight \
            remark-gfm \
            framer-motion \
            clsx \
            tailwind-merge \
            lucide-react \
            tailwindcss postcss autoprefixer

# 3. Init Tailwind
npx tailwindcss init -p

# 4. Configure Tailwind
echo "⚙️  Konfigurasi Tailwind..."
cat <<EOF > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          green: '#4ade80',
          dark: '#0f172a',
          darker: '#020617',
          border: '#1e293b'
        }
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        scanline: {
          '0%': { bottom: '100%' },
          '100%': { bottom: '-100%' },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
EOF

# 5. Global CSS
echo "🎨 Membuat file CSS global..."
cat <<EOF > src/index.css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;800&display=swap');
@import 'highlight.js/styles/atom-one-dark.css'; /* Syntax Highlighting Theme */

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #020617;
  color: #e2e8f0;
  overflow-x: hidden;
}

.scanline {
  width: 100%; height: 100px; z-index: 50;
  background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(74, 222, 128, 0.05) 50%, rgba(0,0,0,0) 100%);
  opacity: 0.1;
  position: absolute; bottom: 100%;
  pointer-events: none;
  animation: scanline 8s linear infinite;
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #020617; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #334155; }
EOF

# 6. Create Directory Structure
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/data
mkdir -p public/content

# 7. DATA FILE (Registry Writeups)
echo "💾 Membuat registry data..."
cat <<EOF > src/data/writeups.js
export const writeups = [
  {
    id: "silent-ping",
    title: "Silent Ping: ICMP Exfiltration",
    category: "Network Forensics",
    difficulty: "Medium",
    date: "2024-01-08",
    description: "Investigating a covert channel hidden inside Echo Requests. The IDS missed it, but we caught it.",
    filename: "silent-ping.md"
  },
  {
    id: "rusty-vault",
    title: "Rusty Vault",
    category: "Reverse Engineering",
    difficulty: "Hard",
    date: "2024-01-05",
    description: "Cracking a safe written in Rust. Dealing with memory safety and complex obfuscation.",
    filename: "rusty-vault.md"
  }
];
EOF

# 8. COMPONENT: Navbar (Shared)
echo "🧩 Membuat Navbar..."
cat <<'EOF' > src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { Terminal } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-cyber-border bg-cyber-dark/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-cyber-green w-2 h-2 rounded-full animate-pulse"></div>
          <span className="font-bold text-lg tracking-tight text-white font-mono">
            <span className="text-cyber-green">root</span>@farrel:~$
          </span>
        </Link>
        <div className="flex gap-8 text-sm font-medium text-slate-400 font-mono">
          <Link to="/" className="hover:text-cyber-green transition-colors">/home</Link>
          <a href="#" className="hover:text-cyber-green transition-colors">/about</a>
          <a href="#" className="hover:text-cyber-green transition-colors">/contact</a>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
EOF

# 9. PAGE: Home (Landing)
echo "🏠 Membuat Home Page..."
cat <<'EOF' > src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, Terminal, Cpu } from 'lucide-react';
import { writeups } from '../data/writeups';

const Home = () => {
  return (
    <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="mb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/20 text-cyber-green text-xs font-mono mb-6">
          <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></span>
          SYSTEM ONLINE
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
          CTF <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-emerald-600">Archive</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Digital forensic reports, reverse engineering logs, and exploit analysis. 
          Documenting the journey through the bits and bytes.
        </p>
      </section>

      {/* Grid Writeups */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <Terminal className="text-cyber-green" />
          <h2 className="text-2xl font-bold text-white">Latest_Logs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {writeups.map((post) => (
            <Link 
              key={post.id} 
              to={`/writeup/${post.id}`}
              className="group relative bg-[#0d1117] border border-cyber-border rounded-xl p-6 hover:border-cyber-green/50 transition-all hover:shadow-[0_0_20px_rgba(74,222,128,0.1)]"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-slate-500">{post.date}</span>
                <span className={`text-xs px-2 py-1 rounded border ${
                  post.difficulty === 'Hard' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 
                  post.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' : 
                  'border-green-500/30 text-green-400 bg-green-500/10'
                }`}>
                  {post.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-green transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {post.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-cyber-green">
                READ_ENTRY <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Home;
EOF

# 10. PAGE: Writeup Viewer (The Markdown Renderer)
echo "📖 Membuat Markdown Renderer Engine..."
cat <<'EOF' > src/pages/WriteupViewer.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { writeups } from '../data/writeups';

const WriteupViewer = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postData = writeups.find(w => w.id === id);
    if (postData) {
      setMeta(postData);
      // Fetch Markdown file from public folder
      fetch(`/content/${postData.filename}`)
        .then(res => res.text())
        .then(text => {
          setContent(text);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setContent("# Error loading content");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-mono text-cyber-green">LOADING_DATA...</div>;
  if (!meta) return <div className="h-screen flex items-center justify-center font-mono text-red-500">ERROR: LOG_NOT_FOUND</div>;

  return (
    <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors text-sm font-mono group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK_TO_ROOT
      </Link>

      {/* Header Post */}
      <div className="border-b border-cyber-border pb-8 mb-12">
        <div className="flex gap-3 mb-4">
          <span className="px-3 py-1 rounded bg-slate-800 text-cyber-green text-xs font-mono border border-slate-700">{meta.category}</span>
          <span className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 flex items-center gap-2">
             <Calendar size={12} /> {meta.date}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{meta.title}</h1>
        <p className="text-xl text-slate-400 leading-relaxed">{meta.description}</p>
      </div>

      {/* Markdown Content Area */}
      <div className="markdown-renderer text-slate-300 leading-7">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, rehypeHighlight, remarkGfm]}
          components={{
            // Customizing HTML elements generated from Markdown
            h1: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2 border-l-4 border-cyber-green pl-4" {...props} />,
            h2: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-8 mb-4" {...props} />,
            p: ({node, ...props}) => <p className="mb-6 leading-relaxed text-slate-300" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-6 space-y-2 text-slate-300 ml-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-6 space-y-2 text-slate-300 ml-4" {...props} />,
            a: ({node, ...props}) => <a className="text-cyber-green hover:underline decoration-dashed underline-offset-4" {...props} />,
            code: ({node, inline, className, children, ...props}) => {
              const match = /language-(\w+)/.exec(className || '')
              return !inline ? (
                <div className="my-6 rounded-lg overflow-hidden border border-slate-700 bg-[#0d1117]">
                  <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                  </div>
                  <code className={`${className} block p-4 text-sm font-mono overflow-x-auto`} {...props}>
                    {children}
                  </code>
                </div>
              ) : (
                <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyber-green font-mono text-sm border border-slate-700" {...props}>
                  {children}
                </code>
              )
            },
            blockquote: ({node, ...props}) => (
              <blockquote className="border-l-4 border-yellow-500/50 bg-yellow-500/5 p-4 rounded-r my-6 italic text-slate-400" {...props} />
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
export default WriteupViewer;
EOF

# 11. MAIN APP: Routing Setup
echo "🔗 Mengatur Routing..."
cat <<'EOF' > src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WriteupViewer from './pages/WriteupViewer';

function App() {
  return (
    <div className="min-h-screen bg-[#020617] relative">
      <div className="fixed inset-0 pointer-events-none">
         <div className="scanline"></div>
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/writeup/:id" element={<WriteupViewer />} />
      </Routes>
    </div>
  );
}

export default App;
EOF

# 12. SAMPLE CONTENT (The MD File)
echo "📝 Membuat contoh konten Markdown..."
cat <<'EOF' > public/content/silent-ping.md
# Reconnaissance

I started by opening the provided \`silent_ping.pcap\` file. Filtering for ICMP traffic, I immediately noticed that the packets were standard Echo Requests (Type 8) and Replies (Type 0).

However, looking at the **Data** field of the ICMP packets revealed something interesting. Standard pings usually contain a fixed pattern sequence (like \`abcdef...\`). These packets contained changing data.

> **Objective:** Analyze the pcap file and find the flag hidden in the payload.

## Extraction Strategy

To reconstruct the message, I needed to parse the packets sequentially and extract the data payload. While manual extraction is possible for short flags, I wrote a Python script using \`scapy\` to automate the process for accuracy.

Here is the solver script:

\`\`\`python
from scapy.all import *

def extract_icmp_data(pcap_file):
    packets = rdpcap(pcap_file)
    flag_chars = []
    
    print("[*] Analyzing ICMP payloads...")
    # Logic goes here...
    return "".join(flag_chars)
\`\`\`

## The Verdict

Running the extraction logic revealed the hidden message. The database server was indeed "speaking" to the external IP, one letter at a time.

**Final Flag:**
\`TBF1{1cmp_tunne1_ing_is_n0t_stea1thy_enough}\`
EOF

cat <<'EOF' > public/content/rusty-vault.md
# Analysis

The binary provided is a Rust executable. It's stripped, meaning debug symbols are removed.

## Decompilation
Opening it in IDA Pro shows a lot of standard Rust boilerplate. I searched for the string "Access Granted" to find the main logic function.

\`\`\`rust
fn check_password(input: &str) -> bool {
    let key = "sup3r_s3cr3t_k3y";
    // XOR logic...
}
\`\`\`
EOF

# 13. Cleanup
rm src/App.css
rm -f src/assets/react.svg

echo ""
echo "✅ PORTFOLIO SYSTEM SIAP!"
echo "--------------------------------------------------------"
echo "Cara Menjalankan:"
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
echo ""
echo "Cara Menambah Writeup Baru:"
echo "  1. Buat file .md di folder: public/content/nama-file.md"
echo "  2. Edit file src/data/writeups.js dan tambahkan entry baru"
echo "--------------------------------------------------------"