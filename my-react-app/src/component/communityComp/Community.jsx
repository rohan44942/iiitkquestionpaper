export default function Community() {
  return (
    <div className="grid grid-cols-5 md:grid-cols-5 gap-4 p-4 ">
      <section className="col-span-3 border-r-2 col-start-2 col-end-5 bg-slate-400">
        <div>Search box</div>
        <div>Filter options</div>
      </section>
      <section className="col-span-1 col-start-1 col-end-4 bg-red-300">
        <div> center page Post list</div>
        <div>Community posts</div>
      </section>
      <section className="col-span-1 col-start-4 col-end-6 bg-green-300">
        <div> right side bar section Post creation form</div>
        <div>Post updates</div>
      </section>
    </div>
  );
}
