import { Button } from './Button.jsx';
import { cn } from '../design-system/utils';

/**
 * Pagination Component
 * Provides navigation between pages of data
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
  ...props
}) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      role="navigation"
      aria-label="Sayfalama navigasyonu"
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      {/* First page */}
      {showFirstLast && currentPage > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            aria-label="İlk sayfaya git"
          >
            ⏪
          </Button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Previous page */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          aria-label="Önceki sayfa"
        >
          ←
        </Button>
      )}

      {/* Page numbers */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handlePageChange(page)}
          aria-label={`Sayfa ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
          className={cn(
            'min-w-9',
            page === currentPage && 'pointer-events-none'
          )}
        >
          {page}
        </Button>
      ))}

      {/* Next page */}
      {showPrevNext && (
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label="Sonraki sayfa"
        >
          →
        </Button>
      )}

      {/* Last page */}
      {showFirstLast && currentPage < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            aria-label="Son sayfaya git"
          >
            ⏩
          </Button>
        </>
      )}
    </nav>
  );
};

/**
 * Pagination Info Component
 * Shows current page information
 */
const PaginationInfo = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('text-sm text-gray-600 dark:text-gray-400', className)}>
      {totalItems > 0 ? (
        <>
          Sayfa {currentPage} / {totalPages} ({startItem}-{endItem} / {totalItems} kayıt)
        </>
      ) : (
        'Kayıt bulunamadı'
      )}
    </div>
  );
};

/**
 * Complete Pagination with Info
 */
const PaginationWithInfo = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
  ...paginationProps
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <PaginationInfo
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        {...paginationProps}
      />
    </div>
  );
};

export { Pagination, PaginationInfo, PaginationWithInfo };
