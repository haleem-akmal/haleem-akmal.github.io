// src/components/admin/ProjectsTab.jsx

import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { db } from '../../firebase';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import EditProjectModal from './EditProjectModal';

const CATEGORY_OPTIONS = ['Web App', 'Dashboard', 'Mobile App', 'Website', 'AI/ML'];

const ProjectsTab = () => {
    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [projectStatus, setProjectStatus] = useState('Published');
    const [category, setCategory] = useState(CATEGORY_OPTIONS[0]); // NEW
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [editingProject, setEditingProject] = useState(null);

    // List states
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
            const projectsCollection = collection(db, "projects");
            const q = query(projectsCollection, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects: ", error);
        } finally {
            setLoadingProjects(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);
        try {
            await addDoc(collection(db, "projects"), {
                title,
                description,
                tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
                imageURL,
                liveLink,
                githubLink,
                category, // NEW
                status: projectStatus,
                createdAt: serverTimestamp()
            });
            setStatus({ type: 'success', text: "Project added successfully!" });
            // reset
            setTitle('');
            setDescription('');
            setTags('');
            setImageURL('');
            setLiveLink('');
            setGithubLink('');
            setProjectStatus('Published');
            setCategory(CATEGORY_OPTIONS[0]); // NEW
            fetchProjects();
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus({ type: 'error', text: "Something went wrong." });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDelete = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            try {
                const projectDocRef = doc(db, "projects", projectId);
                await deleteDoc(projectDocRef);
                fetchProjects();
            } catch (error) {
                console.error("Error deleting project: ", error);
                alert("Could not delete the project. Please try again.");
            }
        }
    };

    const handleEditClick = (project) => {
        setEditingProject(project);
    };

    const handleCloseModal = () => {
        setEditingProject(null);
    };

    const handleSaveChanges = async (updatedProject) => {
        try {
            const projectDocRef = doc(db, "projects", updatedProject.id);
            const { id, ...dataToUpdate } = updatedProject;
            await updateDoc(projectDocRef, dataToUpdate);
            handleCloseModal();
            fetchProjects();
        } catch (error) {
            console.error("Error updating project: ", error);
            alert("Could not update the project. Please try again.");
        }
    };

    return (
        <>
            <div className="space-y-8">
                {/* Add New Project Form */}
                <div className="bg-[#1c1c1c] p-6 rounded-lg border border-gray-800">
                    <h2 className="text-2xl font-semibold mb-6">Add New Project</h2>
                    {status && (
                        <div className={`mb-4 p-3 rounded-md text-sm ${
                            status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                            {status.text}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title, Status, Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-1">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Enter project title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                                <select
                                    value={projectStatus}
                                    onChange={(e) => setProjectStatus(e.target.value)}
                                    className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500 h-[46px]"
                                >
                                    <option value="Published">Published</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500 h-[46px]"
                                >
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows="3"
                                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g., React, Firebase"
                                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                            <input
                                type="url"
                                value={imageURL}
                                onChange={(e) => setImageURL(e.target.value)}
                                required
                                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Live Demo Link</label>
                                <input
                                    type="url"
                                    value={liveLink}
                                    onChange={(e) => setLiveLink(e.target.value)}
                                    required
                                    className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">GitHub Link</label>
                                <input
                                    type="url"
                                    value={githubLink}
                                    onChange={(e) => setGithubLink(e.target.value)}
                                    required
                                    className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Adding...' : 'Add Project'}
                        </button>
                    </form>
                </div>

                {/* Existing Projects List */}
                <div className="bg-[#1c1c1c] p-6 rounded-lg border border-gray-800">
                    <h2 className="text-2xl font-semibold mb-2">Manage Projects</h2>
                    <p className="text-sm text-gray-400 mb-6">Edit or remove projects from your portfolio</p>
                    <div className="space-y-4">
                        {loadingProjects ? <p>Loading projects...</p> : (
                            projects.map(project => (
                                <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-700/50 last:border-b-0">
                                    <div>
                                        <h3 className="font-bold text-white">{project.title}</h3>
                                        <p className="text-sm text-gray-400">{project.description?.substring(0, 50)}...</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Last updated: {project.createdAt?.toDate?.().toLocaleDateString?.() ?? 'N/A'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4 sm:mt-0 flex-shrink-0">
                                        {/* Category badge */}
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/20">
                                            {project.category || 'Uncategorized'}
                                        </span>
                                        {/* Status badge */}
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            project.status === 'Published' 
                                            ? 'bg-blue-600/20 text-blue-300' 
                                            : 'bg-gray-600/20 text-gray-300'
                                        }`}>
                                            {project.status}
                                        </span>
                                        <button className="text-gray-400 hover:text-white" aria-label={`View ${project.title}`}><FiEye /></button>
                                        <button 
                                            onClick={() => handleEditClick(project)} 
                                            className="text-gray-400 hover:text-white"
                                            aria-label={`Edit ${project.title}`}
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(project.id)} 
                                            className="text-gray-400 hover:text-red-500"
                                            aria-label={`Delete ${project.title}`}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingProject && (
                <EditProjectModal 
                    project={editingProject}
                    onClose={handleCloseModal}
                    onSave={handleSaveChanges}
                    // Tip: make sure your modal includes `category` in its form data
                />
            )}
        </>
    );
};

export default ProjectsTab;