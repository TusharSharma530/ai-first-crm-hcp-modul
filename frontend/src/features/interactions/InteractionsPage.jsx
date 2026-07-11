import { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInteractions, deleteInteraction, updateInteraction } from './interactionSlice';
import StatsCard from './components/StatsCard';
import SearchFilter from './components/SearchFilter';
import InteractionTable from './components/InteractionTable';
import SideDrawer from './components/SideDrawer';
import EditDrawer from './components/EditDrawer';
import AIInsightsDrawer from './components/AIInsightsDrawer';
import EmptyState from './components/EmptyState';
import SkeletonLoader from './components/SkeletonLoader';
import '../../styles/interactions-premium.css';

const InteractionsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: interactions, status } = useSelector(state => state.interactions);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    sentiment: 'all',
    followUp: 'all',
    specialty: 'all',
    priority: 'all',
    aiSummary: 'all',
    doctorName: '',
    dateFrom: ''
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'interaction_date', direction: 'desc' });
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, interaction: null });

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayInteractions = interactions.filter(i => {
      const date = new Date(i.interaction_date);
      return date >= today;
    });

    const pendingFollowUps = interactions.filter(i => 
      i.follow_up_required === 'yes'
    );

    const completedMeetings = interactions.filter(i => 
      i.interaction_type === 'meeting'
    );

    const aiSummaries = interactions.filter(i => 
      i.summary && i.summary.length > 0
    );

    const highPriority = interactions.filter(i => 
      i.sentiment?.toLowerCase() === 'positive'
    );

    return {
      total: interactions.length,
      todayCalls: todayInteractions.filter(i => i.interaction_type === 'call').length,
      pendingFollowUps: pendingFollowUps.length,
      completedMeetings: completedMeetings.length,
      aiGenerated: aiSummaries.length,
      highPriority: highPriority.length
    };
  }, [interactions]);

  // Filter and sort interactions
  const filteredInteractions = useMemo(() => {
    let result = [...interactions];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.hcp_name?.toLowerCase().includes(q) ||
        i.hcp_organization?.toLowerCase().includes(q) ||
        i.hcp_specialty?.toLowerCase().includes(q) ||
        i.notes?.toLowerCase().includes(q) ||
        i.summary?.toLowerCase().includes(q)
      );
    }

    // Applied filters
    if (appliedFilters.type && appliedFilters.type !== 'all') {
      result = result.filter(i => i.interaction_type === appliedFilters.type);
    }
    if (appliedFilters.sentiment && appliedFilters.sentiment !== 'all') {
      result = result.filter(i => i.sentiment?.toLowerCase() === appliedFilters.sentiment);
    }
    if (appliedFilters.followUp && appliedFilters.followUp !== 'all') {
      result = result.filter(i => i.follow_up_required === appliedFilters.followUp);
    }
    if (appliedFilters.specialty && appliedFilters.specialty !== 'all') {
      result = result.filter(i => 
        i.hcp_specialty?.toLowerCase() === appliedFilters.specialty.toLowerCase()
      );
    }
    if (appliedFilters.doctorName) {
      const name = appliedFilters.doctorName.toLowerCase();
      result = result.filter(i => 
        i.hcp_name?.toLowerCase().includes(name)
      );
    }
    if (appliedFilters.dateFrom) {
      const fromDate = new Date(appliedFilters.dateFrom);
      result = result.filter(i => 
        new Date(i.interaction_date) >= fromDate
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'interaction_date') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [interactions, searchQuery, appliedFilters, sortConfig]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      type: 'all',
      sentiment: 'all',
      followUp: 'all',
      specialty: 'all',
      priority: 'all',
      aiSummary: 'all',
      doctorName: '',
      dateFrom: ''
    });
    setAppliedFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleView = useCallback((interaction) => {
    setSelectedInteraction(interaction);
    setDrawerOpen(true);
  }, []);

  const handleEdit = useCallback((interaction) => {
    setEditingInteraction(interaction);
    setEditDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((interaction) => {
    setDeleteConfirm({ open: true, interaction });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteConfirm.interaction) {
      dispatch(deleteInteraction(deleteConfirm.interaction.id));
    }
    setDeleteConfirm({ open: false, interaction: null });
  }, [dispatch, deleteConfirm.interaction]);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirm({ open: false, interaction: null });
  }, []);

  const handleAIInsights = useCallback((interaction) => {
    setSelectedInteraction(interaction);
    setAiDrawerOpen(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedInteraction(null);
  }, []);

  const handleSaveEdit = useCallback(async (id, data) => {
    await dispatch(updateInteraction({ id, data }));
    setEditDrawerOpen(false);
    setEditingInteraction(null);
  }, [dispatch]);

  const handleCloseEditDrawer = useCallback(() => {
    setEditDrawerOpen(false);
    setEditingInteraction(null);
  }, []);

  const handleCloseAiDrawer = useCallback(() => {
    setAiDrawerOpen(false);
    setSelectedInteraction(null);
  }, []);

  if (status === 'loading') {
    return (
      <div className="interactions-premium">
        <SkeletonLoader type="full" />
      </div>
    );
  }

  return (
    <div className="interactions-premium">
      {/* Premium Page Header */}
      <header className="page-header">
        <div className="page-header-content">
          <div className="page-header-left">
            <h1 className="page-header-title">All HCP Interactions</h1>
            <p className="page-header-subtitle">
              Manage and track all healthcare professional interactions
            </p>
            <div className="page-header-meta">
              <div className="page-header-meta-item">
                <div className="page-header-meta-icon">📊</div>
                <span>{interactions.length} Total Records</span>
              </div>
              <div className="page-header-meta-item">
                <div className="page-header-meta-icon">🕐</div>
                <span>Updated {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary" onClick={() => {
              // Export functionality
              const headers = ['HCP Name', 'Email', 'Specialty', 'Organization', 'Type', 'Sentiment', 'Notes', 'Summary', 'Date'];
              const rows = filteredInteractions.map(i => [
                i.hcp_name, i.hcp_email, i.hcp_specialty, i.hcp_organization,
                i.interaction_type, i.sentiment, `"${(i.notes || '').replace(/"/g, '""')}"`,
                `"${(i.summary || '').replace(/"/g, '""')}"`,
                new Date(i.interaction_date).toLocaleDateString()
              ]);
              const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `interactions_${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}>
              <span aria-hidden="true">📥</span>
              <span>Export</span>
            </button>
            <button className="btn btn-primary" onClick={handleCreateNew}>
              <span aria-hidden="true">+</span>
              <span>New Interaction</span>
            </button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <StatsCard
          icon="📊"
          value={kpis.total}
          label="Total Interactions"
          color="blue"
        />
        <StatsCard
          icon="📞"
          value={kpis.todayCalls}
          label="Today's Calls"
          color="green"
        />
        <StatsCard
          icon="⏰"
          value={kpis.pendingFollowUps}
          label="Pending Follow-ups"
          color="yellow"
        />
        <StatsCard
          icon="🤝"
          value={kpis.completedMeetings}
          label="Completed Meetings"
          color="purple"
        />
        <StatsCard
          icon="🤖"
          value={kpis.aiGenerated}
          label="AI Generated Summaries"
          color="teal"
        />
        <StatsCard
          icon="⭐"
          value={kpis.highPriority}
          label="High Priority HCPs"
          color="green"
        />
      </div>

      {/* Search & Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Data Table or Empty State */}
      {filteredInteractions.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No interactions found"
          text="Start by creating your first interaction or adjust your filters to see more results."
          buttonText="Create First Interaction"
          onButtonClick={handleCreateNew}
        />
      ) : (
        <InteractionTable
          interactions={filteredInteractions}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAIInsights={handleAIInsights}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}

      {/* Side Drawer */}
      <SideDrawer
        interaction={selectedInteraction}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
      />

      {/* Edit Drawer */}
      <EditDrawer
        interaction={editingInteraction}
        isOpen={editDrawerOpen}
        onClose={handleCloseEditDrawer}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className="delete-modal-overlay" onClick={handleCancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3 className="delete-modal-title">Delete Interaction</h3>
            <p className="delete-modal-text">
              Are you sure you want to delete this interaction with <strong>{deleteConfirm.interaction?.hcp_name}</strong>?
            </p>
            <p className="delete-modal-subtext">This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button className="delete-modal-btn cancel" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="delete-modal-btn confirm" onClick={handleConfirmDelete}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Drawer */}
      <AIInsightsDrawer
        interaction={selectedInteraction}
        isOpen={aiDrawerOpen}
        onClose={handleCloseAiDrawer}
      />
    </div>
  );
};

export default InteractionsPage;
