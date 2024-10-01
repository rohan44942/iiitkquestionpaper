// import React from 'react';

// function About() {
//   return (
//     <div className="bg-gradient-to-r from-purple-300 to-blue-500 p-6">
//       <h1 className="text-4xl font-bold text-center text-white mb-6">
//         About Us
//       </h1>

//       <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
//         <h2 className="text-3xl font-semibold text-center text-purple-600 mb-4">
//           Our Mission
//         </h2>
//         <p className="text-gray-700 text-lg text-center">
//           At IIIT Kota, we strive to provide an accessible platform for students to
//           share and access valuable educational resources, ensuring that everyone can 
//           prepare for their exams effectively and efficiently!
//         </p>
//       </section>

//       <section className="bg-white rounded-lg shadow-lg p-6 mb-6">
//         <h2 className="text-3xl font-semibold text-center text-purple-600 mb-4">
//           Meet Our Team
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Team Member 1 */}
//           <div className="bg-purple-100 rounded-lg p-4 text-center">
//             <img
//               src="https://via.placeholder.com/150"
//               alt="Team Member"
//               className="rounded-full mx-auto mb-4"
//             />
//             <h3 className="font-bold text-xl">Alice</h3>
//             <p className="text-gray-600">Frontend Developer</p>
//           </div>
//           {/* Team Member 2 */}
//           <div className="bg-purple-100 rounded-lg p-4 text-center">
//             <img
//               src="https://via.placeholder.com/150"
//               alt="Team Member"
//               className="rounded-full mx-auto mb-4"
//             />
//             <h3 className="font-bold text-xl">Bob</h3>
//             <p className="text-gray-600">Backend Developer</p>
//           </div>
//           {/* Team Member 3 */}
//           <div className="bg-purple-100 rounded-lg p-4 text-center">
//             <img
//               src="https://via.placeholder.com/150"
//               alt="Team Member"
//               className="rounded-full mx-auto mb-4"
//             />
//             <h3 className="font-bold text-xl">Charlie</h3>
//             <p className="text-gray-600">UI/UX Designer</p>
//           </div>
//         </div>
//       </section>

//       <section className="bg-white rounded-lg shadow-lg p-6">
//         <h2 className="text-3xl font-semibold text-center text-purple-600 mb-4">
//           Why Choose Us?
//         </h2>
//         <ul className="list-disc list-inside text-gray-700 text-lg">
//           <li>🌟 Extensive resources for all branches and years</li>
//           <li>📚 Easy upload and download options</li>
//           <li>🤝 A supportive community of students</li>
//           <li>💻 User-friendly interface</li>
//         </ul>
//       </section>

//       <footer className="text-center mt-6">
//         <p className="text-white">&copy; 2024 IIIT Kota. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default About;
function About() {
    return (
        <div className="bg-cream min-h-screen flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl">
                <h1 className="text-3xl font-bold text-light-green mb-4 text-center">About Us</h1>
                <p className="text-gray-700 mb-4">
                    Welcome to the IIIT Kota Resource Platform! We are dedicated to providing students with access to a wealth of educational resources,
                    including previous question papers, study materials, and more. Our goal is to enhance learning and support academic success.
                </p>
                <h2 className="text-2xl font-semibold text-light-green mt-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                    Our mission is to empower students with easy access to vital resources, ensuring they are well-prepared for their exams.
                    We believe that education should be accessible to all, and we strive to create an inclusive learning environment.
                </p>
                <h2 className="text-2xl font-semibold text-light-green mt-4">Why Choose Us?</h2>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                    <li>Comprehensive collection of resources for various engineering disciplines.</li>
                    <li>User-friendly interface for easy navigation.</li>
                    <li>Continuous updates to keep the resource pool relevant.</li>
                </ul>
                <h2 className="text-2xl font-semibold text-light-green mt-4">Get Involved</h2>
                <p className="text-gray-700 mb-4">
                    Join our community and contribute to the knowledge base. Upload your study materials and help your peers succeed!
                </p>
                <p className="text-gray-500 text-center mt-8">
                    &copy; {new Date().getFullYear()} IIIT Kota Resources. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default About;
