// src/pages/AllProjectsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { FiGithub, FiExternalLink, FiSearch } from 'react-icons/fi';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const categories = ['All', 'Web App', 'Dashboard', 'Mobile App', 'Website', 'AI/ML'];

const AllProjectsPage = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        const projectsCollection = collection(db, 'projects');
        const q = query(
          projectsCollection,
          where('status', '==', 'Published'),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllProjects(projectsData);
      } catch (err) {
        console.error('Error fetching all projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  // Search + Category filter
  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allProjects.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p?.category === activeCategory;

      const searchable = [
        p?.title || '',
        Array.isArray(p?.tags) ? p.tags.join(' ') : '',
        p?.category || '',
        // optional: include description in search too
        p?.description || '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !term || searchable.includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [allProjects, searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-100px,#141a2a,transparent)] bg-[#04060b] text-white pt-28 pb-24 px-4">
      <div className="container mx-auto max-w-7xl ">
        {/* Header */}
        <header className="text-center mb-12 ">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">My Projects</h1>
          <p className="text-lg text-gray-300/90 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in web development, mobile apps, and more
          </p>
        </header>

        {/* Search + Filters */}
        <div className="mb-12 space-y-6">
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search projects by title, tag, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0b0f1a] border border-white/10 rounded-md py-3.5 pl-12 pr-4 text-gray-100 placeholder-gray-500
                         focus:ring-2 focus:ring-purple-500/60 focus:border-transparent outline-none shadow-inner"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 rounded-md text-sm font-semibold transition-colors
                              border ${active ? 'bg-purple-600 text-white border-transparent' : 'bg-black/40 text-gray-200 border-white/10 hover:bg-black/50'}`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content states */}
        {loading ? (
          <p className="text-center text-gray-400">Loading all projects...</p>
        ) : filteredProjects.length === 0 ? (
          <p className="text-center text-gray-400">No projects found. Try a different search!</p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const title = project.title || 'Untitled Project';
              const description = project.description || 'No description provided.';
              const category = project.category || 'Project';
              const image =
                project.imageURL ||
                project.image ||
                'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg';
              const tags = Array.isArray(project.tags) ? project.tags : [];
              const codeUrl =
                project.githubLink || project.githubUrl || project.github || '#';
              const demoUrl =
                project.liveLink || project.demoUrl || project.liveUrl || project.url || '#';

              return (
                <article
                  key={project.id}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-sm
                             transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={image}
                      alt={`${title} — screenshot`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg';
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                      <span className="shrink-0 text-[11px] uppercase tracking-wide text-gray-300 bg-white/[0.06] border border-white/10 rounded-full px-2 py-1">
                        {category}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-300/90 leading-relaxed line-clamp-3">
                      {description}
                    </p>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] text-gray-200 bg-white/[0.06] border border-white/10 rounded-md px-2 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-3">
                      <a
                        href={codeUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 py-2.5
                                   text-gray-200 hover:bg-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
                        aria-label={`${title} code on GitHub`}
                      >
                        <FiGithub aria-hidden="true" /> Code
                      </a>
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2.5
                                   text-white hover:opacity-95 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
                        aria-label={`Open live demo of ${title}`}
                      >
                        <FiExternalLink aria-hidden="true" /> Demo
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
};

export default AllProjectsPage;