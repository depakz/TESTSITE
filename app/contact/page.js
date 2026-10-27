export default function Contact() {
  return (
    <main>
      <h1>Contact Us</h1>
      <p>Have a project in mind? Reach out and our team will be in touch.</p>
      <form action="/api/contact" method="post">
        <input type="text" name="name" placeholder="Your name" />
        <input type="email" name="email" placeholder="Your email" />
        <textarea name="message" rows="5" placeholder="Your message"></textarea>
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
