import React from "react";

export default function PageNotFound() {
  return (
    <section className="flex flex-col items-center bg-white py-16 px-4 text-center">
      <h5 className="text-3xl font-bold text-pink-800">Oops!!!</h5>
      <img
        src="//images01.nicepage.com/c461c07a441a5d220e8feb1a/671378236ca85744a3b2d40a/dd.png"        
        alt="Not found illustration"
        className="h-[300px] w-auto mb-4"
      />
      <h1 className="text-5xl font-bold uppercase text-[red] mb-8">
        Page not found
      </h1>
      <p className="text-lg font-semibold text-gray-600 mb-8">
        Sorry, the page you're looking for doesn't exist. If you think something is broken,
        report a problem.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="/"
          className="bg-gray-600 text-white font-semibold uppercase rounded-full px-10 py-4 hover:bg-white hover:text-gray-600 border border-transparent hover:border-gray-600 transition"
        >
          Go Home
        </a>
        <a
          href="mailto:biolinker.contact@gmail.com"
          className="text-gray-600 font-semibold uppercase rounded-full px-10 py-4 border border-gray-600 hover:bg-gray-600 hover:text-white transition"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}