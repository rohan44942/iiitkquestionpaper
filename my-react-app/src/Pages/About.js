
function About() {
    return (
        <div className="bg-cream pt-20 min-h-screen flex flex-col items-center justify-center p-6">
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
