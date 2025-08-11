// src/components/Projects.jsx

import React, { useState, useEffect } from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from '../firebase';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const projectsCollection = collection(db, "projects");
                const q = query(
                    projectsCollection, 
                    where("status", "==", "Published"), 
                    orderBy("createdAt", "desc"), 
                    limit(3)
                );
                
                const querySnapshot = await getDocs(q);
                const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects for homepage: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

  return (
    <section id="projects" className="bg-[#0D0D0D] text-white py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-2">Featured Projects</h2>
          <p className="text-lg text-gray-400">Here are some of my recent projects that showcase my skills and experience.</p>
        </div>

        {loading ? (
            <p className="text-center text-gray-400">Loading projects...</p>
        ) : projects.length === 0 ? (
            <p className="text-center text-gray-400">No featured projects to display right now.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]
                               flex flex-col shadow-sm transition-all duration-300 motion-safe:transform-gpu
                               hover:-translate-y-1 hover:shadow-lg focus-within:ring-1 focus-within:ring-white/20"
                  >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                          <img
                              src={project.imageURL}
                              alt={project.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent
                                          opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-semibold mb-2 text-white tracking-tight">
                              {project.title}
                          </h3>
                          <p className="text-gray-300/90 text-sm mb-4 flex-grow leading-relaxed line-clamp-3">
                              {project.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mb-6">
                              {project.tags?.map((tag, index) => (
                                  <span
                                      key={index}
                                      className="text-[11px] uppercase tracking-wide text-gray-300
                                                 border border-white/10 bg-white/[0.04] rounded-md px-2 py-1"
                                  >
                                      {tag}
                                  </span>
                              ))}
                          </div>
                          <div className="flex items-center gap-3 mt-auto">
                              <a
                                  href={project.githubLink}
                                  target="_blank" rel="noopener noreferrer"
                                  className="flex-1 text-center bg-white/[0.04] text-gray-200 py-2.5 px-4 rounded-md hover:bg-white/[0.08] transition-colors duration-300 flex items-center justify-center gap-2"
                              >
                                  <FiGithub /> Code
                              </a>
                              <a
                                  href={project.liveLink}
                                  target="_blank" rel="noopener noreferrer"
                                  className="flex-1 text-center bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2.5 px-4 rounded-md hover:opacity-95 transition-opacity duration-300 flex items-center justify-center gap-2"
                              >
                                  <FiExternalLink /> Demo
                              </a>
                          </div>
                      </div>
                  </article>
                ))}
            </div>
        )}
        
        <div className="text-center mt-16">
            <Link to="/projects" className="bg-white/[0.03] border border-white/10 text-gray-200 px-6 py-2.5 rounded-md hover:bg-white/[0.07] hover:text-white transition-colors duration-300">
                View All Projects
            </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;