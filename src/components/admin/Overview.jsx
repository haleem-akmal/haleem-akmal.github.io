// src/components/admin/Overview.jsx
import React, { useEffect, useState } from 'react';
import { FiBox, FiEye, FiMail, FiBarChart2, FiEdit2 } from 'react-icons/fi';
import { db } from '../../firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit as qLimit,
  getDocs,
  getCountFromServer,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import EditProjectModal from './EditProjectModal';

const StatCard = ({ icon, title, value, detail }) => (
  <div className="bg-[#1c1c1c] p-5 rounded-lg border border-gray-800 flex items-center gap-4">
    <div className="bg-purple-600/20 text-purple-400 p-3 rounded-lg">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {detail ? <p className="text-xs text-gray-500">{detail}</p> : null}
    </div>
  </div>
);

const formatDate = (ts) => {
  if (!ts) return null;
  if (typeof ts?.toDate === 'function') return ts.toDate();
  if (typeof ts === 'number') return new Date(ts);
  if (typeof ts === 'string') return new Date(ts);
  return null;
};

const RecentProjects = ({ projects, loading, onEdit }) => (
  <div className="bg-[#1c1c1c] p-6 rounded-lg border border-gray-800">
    <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
    {loading ? (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-white/5 rounded animate-pulse" />
        ))}
      </div>
    ) : projects.length === 0 ? (
      <p className="text-gray-500 text-sm">No projects yet.</p>
    ) : (
      <div className="space-y-4">
        {projects.map((p) => {
          const d = formatDate(p.createdAt);
          return (
            <div key={p.id} className="flex justify-between items-center text-sm">
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{p.title || 'Untitled Project'}</p>
                <p className="text-gray-500 truncate">
                  {d ? d.toLocaleDateString() : 'N/A'} • {p.category || 'Uncategorized'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    p.status === 'Published'
                      ? 'bg-blue-600/20 text-blue-300'
                      : 'bg-gray-600/20 text-gray-300'
                  }`}
                >
                  {p.status || '—'}
                </span>
                <button
                  type="button"
                  onClick={() => onEdit?.(p)}
                  className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-gray-200 px-2.5 py-1.5 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
                  aria-label={`Edit ${p.title || 'project'}`}
                  title="Edit project"
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const RecentMessages = ({ messages, loading }) => (
  <div className="bg-[#1c1c1c] p-6 rounded-lg border border-gray-800">
    <h3 className="text-xl font-semibold mb-4">Recent Messages</h3>
    {loading ? (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 w-full bg-white/5 rounded animate-pulse" />
        ))}
      </div>
    ) : messages.length === 0 ? (
      <p className="text-gray-500 text-sm">Messages will be displayed here.</p>
    ) : (
      <div className="space-y-4">
        {messages.map((m) => {
          const d = formatDate(m.createdAt);
          return (
            <div key={m.id} className="flex justify-between items-center text-sm">
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">
                  {(m.name || m.email || 'Anonymous') + (m.subject ? ` — ${m.subject}` : '')}
                </p>
                <p className="text-gray-500 truncate">{d ? d.toLocaleString() : 'N/A'}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  m.read ? 'bg-emerald-600/20 text-emerald-300' : 'bg-yellow-600/20 text-yellow-300'
                }`}
              >
                {m.read ? 'Read' : 'Unread'}
              </span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const Overview = () => {
  const [projectCounts, setProjectCounts] = useState({ total: 0, published: 0, draft: 0 });
  const [skillsCount, setSkillsCount] = useState(0);
  const [messagesCounts, setMessagesCounts] = useState({ total: 0, unread: 0 });

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  const [loading, setLoading] = useState({
    projects: true,
    skills: true,
    messages: true,
  });

  const [editingProject, setEditingProject] = useState(null);

  // safeCount helper: uses getCountFromServer; falls back to getDocs if needed
  const safeCount = async (q) => {
    try {
      const snap = await getCountFromServer(q);
      return snap.data().count || 0;
    } catch {
      try {
        const snap = await getDocs(q);
        return snap.size ?? snap.docs.length ?? 0;
      } catch {
        return 0;
      }
    }
  };

  // Re-fetch only projects meta (counts + recent list)
  const fetchProjectsMeta = async () => {
    setLoading((s) => ({ ...s, projects: true }));
    try {
      const projectsColl = collection(db, 'projects');

      const [total, published, draft, recentSnap] = await Promise.all([
        safeCount(projectsColl),
        safeCount(query(projectsColl, where('status', '==', 'Published'))),
        safeCount(query(projectsColl, where('status', '==', 'Draft'))),
        getDocs(query(projectsColl, orderBy('createdAt', 'desc'), qLimit(5))),
      ]);

      setProjectCounts({ total, published, draft });
      setRecentProjects(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Overview: error fetching projects', e);
    } finally {
      setLoading((s) => ({ ...s, projects: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Projects: counts + recent
      await fetchProjectsMeta();

      // Skills: count
      try {
        const skillsColl = collection(db, 'skills');
        const count = await safeCount(skillsColl);
        setSkillsCount(count);
      } catch (e) {
        console.error('Overview: error fetching skills', e);
      } finally {
        setLoading((s) => ({ ...s, skills: false }));
      }

      // Messages: counts + recent
      try {
        const messagesColl = collection(db, 'messages');
        const [total, unread, recentSnap] = await Promise.all([
          safeCount(messagesColl),
          safeCount(query(messagesColl, where('read', '==', false))),
          getDocs(query(messagesColl, orderBy('createdAt', 'desc'), qLimit(5))),
        ]);
        setMessagesCounts({ total, unread });
        setRecentMessages(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error('Overview: error fetching messages', e);
      } finally {
        setLoading((s) => ({ ...s, messages: false }));
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (project) => setEditingProject(project);
  const handleCloseModal = () => setEditingProject(null);

  const handleSaveChanges = async (updatedProject) => {
    try {
      const projectRef = doc(db, 'projects', updatedProject.id);
      const { id, ...dataToUpdate } = updatedProject;

      await updateDoc(projectRef, {
        ...dataToUpdate,
        updatedAt: serverTimestamp(),
      });

      setEditingProject(null);
      await fetchProjectsMeta(); // refresh counts + recent list
    } catch (error) {
      console.error('Overview: error updating project', error);
      alert('Could not update the project. Please try again.');
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FiBox size={22} />}
          title="Total Projects"
          value={projectCounts.total}
          detail={`${projectCounts.published} published`}
        />
        {/* Page Views - integrate analytics later if needed */}
        <StatCard
          icon={<FiEye size={22} />}
          title="Page Views"
          value="2,847"
          detail="+15% from last month"
        />
        <StatCard
          icon={<FiMail size={22} />}
          title="Contact Forms"
          value={messagesCounts.total}
          detail={`${messagesCounts.unread} unread`}
        />
        <StatCard
          icon={<FiBarChart2 size={22} />}
          title="Active Skills"
          value={skillsCount}
          detail=""
        />
      </div>

      {/* Recent Projects & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentProjects
          projects={recentProjects}
          loading={loading.projects}
          onEdit={handleEditClick}
        />
        <RecentMessages messages={recentMessages} loading={loading.messages} />
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default Overview;