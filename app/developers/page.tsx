import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { config } from "@/config";
import { Developer } from "../api/developers/route";
import Image from "next/image";

export default async function DevelopersPage() {
  const res = await fetch(`${config.clientUrl}/api/developers`);
  if (!res.ok) {
    throw new Error("Failed to fetch developers");
  }
  const developers = await res.json();

  const contributors = [
    "JnU CSE Club Members",
    "Student Community Contributors",
    "Open Source Contributors",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet the Developers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            JnUCSU is developed and maintained by the talented students of JnU
            CSE Club, dedicated to creating innovative solutions for the
            university community.
          </p>
        </div>

        {/* Main Developers */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Core Development Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((developer: Developer, index: number) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {developer.image ? (
                      <Image
                        src={developer.image}
                        alt={developer.name}
                        className="w-24 h-24 rounded-full object-cover"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <span className="text-2xl font-bold text-orange-600">
                        {developer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {developer.name}
                  </h3>

                  <p className="text-orange-600 font-medium mb-3">
                    {developer.title}
                  </p>

                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {developer.description}
                  </p>

                  <div className="flex justify-center space-x-3">
                    <a
                      href={developer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5 text-gray-700" />
                    </a>
                    <a
                      href={developer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 text-gray-700" />
                    </a>
                    <a
                      href={`mailto:${developer.email}`}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5 text-gray-700" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* JnU CSE Club Section */}
        <section className="mb-16">
          <div className="bg-orange-50 rounded-2xl p-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                JnU CSE Club
              </h2>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                The Computer Science & Engineering Club of Jagannath University
                is a vibrant community of students passionate about technology,
                innovation, and collaborative learning. We work together to
                build solutions that benefit our university community.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Our Mission
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Empowering students through technology and fostering
                    innovation in the university ecosystem.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Our Vision
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Creating a connected, engaged, and digitally empowered
                    student community.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Our Values
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Collaboration, innovation, transparency, and student-first
                    approach.
                  </p>
                </div>
              </div>

              <a
                href="https://github.com/asfi50/jnucsu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Contributors */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Special Thanks
          </h2>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 mb-6 text-center">
                We extend our heartfelt gratitude to all contributors who have
                helped make JnUCSU possible:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contributors.map((contributor, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <p className="font-medium text-gray-800">{contributor}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Want to contribute? We welcome pull requests, bug reports, and
                  feature suggestions!
                </p>
                <a
                  href="https://github.com/asfi50/jnucsu/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <span>Get Involved</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Technology Stack
          </h2>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="bg-blue-50 rounded-lg p-4 mb-2">
                  <p className="font-semibold text-blue-900">Frontend</p>
                </div>
                <p className="text-sm text-gray-600">
                  Next.js, React, TypeScript
                </p>
              </div>

              <div>
                <div className="bg-green-50 rounded-lg p-4 mb-2">
                  <p className="font-semibold text-green-900">Styling</p>
                </div>
                <p className="text-sm text-gray-600">Tailwind CSS</p>
              </div>

              <div>
                <div className="bg-purple-50 rounded-lg p-4 mb-2">
                  <p className="font-semibold text-purple-900">Icons</p>
                </div>
                <p className="text-sm text-gray-600">Lucide React</p>
              </div>

              <div>
                <div className="bg-orange-50 rounded-lg p-4 mb-2">
                  <p className="font-semibold text-orange-900">Deployment</p>
                </div>
                <p className="text-sm text-gray-600">Vercel</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
