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
      </body>
    </html>
  );
}
