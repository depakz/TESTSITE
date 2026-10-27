export default function Home() {
  return (
    <>
      <div className="hero">
        <h1>Enterprise Solutions, Delivered.</h1>
        <p>
          NexaCorp partners with businesses worldwide to deliver scalable
          cloud infrastructure, custom software, and digital transformation
          consulting.
        </p>
      </div>
      <main>
        <h2>Why NexaCorp</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Cloud Migration</h3>
            <p>End-to-end migration strategy for AWS, Azure and GCP environments.</p>
          </div>
          <div className="card">
            <h3>Custom Software</h3>
            <p>Full-stack engineering teams building the products your business needs.</p>
          </div>
          <div className="card">
            <h3>Managed Security</h3>
            <p>24/7 monitoring, incident response, and compliance support.</p>
          </div>
        </div>
      </main>
    </>
  );
}
