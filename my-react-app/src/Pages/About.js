function About() {
  return (
    <div className="page-shell max-w-3xl">
      <div className="surface-card p-8 sm:p-10 animate-fadeUp">
        <h1 className="page-title">About IIITK Resources</h1>
        <p className="page-subtitle !max-w-none">
          A student-built hub for IIIT Kota — previous year papers, notes, and a
          peer community so juniors never start from zero.
        </p>

        <div className="mt-8 space-y-6 text-sm text-ink-soft leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-ink mb-2">What you get</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Exam papers streamed from MongoDB GridFS with admin moderation</li>
              <li>Notes hosted via Cloudinary and searchable by subject</li>
              <li>Favorites and contribution stats on your profile</li>
              <li>Community Q&amp;A with tags, upvotes, and replies</li>
              <li>JWT cookie auth with OTP password reset</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-2">Built for campus</h2>
            <p>
              Upload what helped you survive midterms. After approval, it shows
              up for everyone. The more the campus contributes, the stronger the
              archive becomes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-2">Stack</h2>
            <p>
              React · Express · MongoDB (GridFS) · Cloudinary · JWT · Tailwind CSS
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
