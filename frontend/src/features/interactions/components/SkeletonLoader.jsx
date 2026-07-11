import React from 'react';

export const SkeletonHeader = () => (
  <div className="skeleton skeleton-header" aria-hidden="true" />
);

export const SkeletonKPICards = () => (
  <div className="skeleton-kpi-grid" aria-hidden="true">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="skeleton skeleton-kpi" />
    ))}
  </div>
);

export const SkeletonFilters = () => (
  <div className="skeleton skeleton-filters" aria-hidden="true" />
);

export const SkeletonTable = () => (
  <div className="skeleton skeleton-table" aria-hidden="true" />
);

export const SkeletonTableRow = () => (
  <tr className="skeleton-row" aria-hidden="true">
    <td><div className="skeleton" style={{ height: '20px', width: '150px' }} /></td>
    <td><div className="skeleton" style={{ height: '20px', width: '120px' }} /></td>
    <td><div className="skeleton" style={{ height: '20px', width: '100px' }} /></td>
    <td><div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '12px' }} /></td>
    <td><div className="skeleton" style={{ height: '20px', width: '100px' }} /></td>
    <td><div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '12px' }} /></td>
    <td><div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '12px' }} /></td>
    <td><div className="skeleton" style={{ height: '40px', width: '150px' }} /></td>
    <td><div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '12px' }} /></td>
    <td><div className="skeleton" style={{ height: '32px', width: '120px' }} /></td>
  </tr>
);

export const SkeletonDrawer = () => (
  <div className="drawer-body" aria-hidden="true">
    <div className="skeleton" style={{ height: '80px', width: '100%', marginBottom: '24px', borderRadius: '12px' }} />
    <div className="skeleton" style={{ height: '20px', width: '120px', marginBottom: '16px' }} />
    <div className="skeleton" style={{ height: '100px', width: '100%', marginBottom: '24px' }} />
    <div className="skeleton" style={{ height: '20px', width: '100px', marginBottom: '12px' }} />
    <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '16px' }} />
    <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '16px' }} />
    <div className="skeleton" style={{ height: '60px', width: '100%' }} />
  </div>
);

const SkeletonLoader = ({ type = 'full' }) => {
  switch (type) {
    case 'header':
      return <SkeletonHeader />;
    case 'kpi':
      return <SkeletonKPICards />;
    case 'filters':
      return <SkeletonFilters />;
    case 'table':
      return <SkeletonTable />;
    case 'drawer':
      return <SkeletonDrawer />;
    case 'full':
    default:
      return (
        <div className="interactions-premium">
          <SkeletonHeader />
          <SkeletonKPICards />
          <SkeletonFilters />
          <SkeletonTable />
        </div>
      );
  }
};

export default React.memo(SkeletonLoader);
