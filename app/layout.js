import "./globals.css";

export const metadata = {
  title: "NexaCorp Solutions",
  description: "Enterprise IT consulting and digital transformation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <span className="brand">NexaCorp Solutions</span>
          <div>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
          </div>
        </nav>
        {children}
        <footer>&copy; 2026 NexaCorp Solutions. Training lab build — not a real company.</footer>
        {/*
          Lab note: this script tag is the ONLY thing that makes
          /_internal/chunks/fd5f064b2a3f9309.js discoverable by reading the
          page like a real blackbox tester would — it sits in the page
          source next to Next.js's own framework chunks, indistinguishable
          by filename alone. Finding it means downloading every referenced
          .js file and actually reading them, same as the real recon step.
        */}
        <script src="/_internal/chunks/fd5f064b2a3f9309.js" async defer></script>
      </body>
    </html>
  );
}
