import { AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter, Search, Tag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const AdvancedSearchBar = ({
  onSearch,
  placeholder = 'Ara...',
  filters = [],
  suggestions = [],
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = suggestions
        .filter(
          item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      setIsSuggestionsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  }, [searchTerm, suggestions]);

  const handleSearch = (term = searchTerm) => {
    if (onSearch) {
      onSearch({
        term: term.trim(),
        filters: activeFilters,
      });
    }
    setIsSuggestionsOpen(false);
  };

  const handleFilterChange = (filterId, value) => {
    const newFilters = { ...activeFilters };
    if (value) {
      newFilters[filterId] = value;
    } else {
      delete newFilters[filterId];
    }
    setActiveFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div
      className={`advanced-search-container ${className}`}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Ana Arama Barı */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          backgroundColor: 'white',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={18}
            color='#64748b'
            style={{
              position: 'absolute',
              left: '1rem',
              zIndex: 1,
            }}
          />
          <input
            ref={searchRef}
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            onFocus={() => searchTerm.length > 0 && setIsSuggestionsOpen(true)}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '0.875rem 3rem 0.875rem 3rem',
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              backgroundColor: 'rgba(0,0,0,0)',
            }}
          />
          {searchTerm && (
            <motion.button
              onClick={() => {
                setSearchTerm('');
                setIsSuggestionsOpen(false);
              }}
              style={{
                position: 'absolute',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
              }}
              whileHover={{ backgroundColor: '#f1f5f9' }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} color='#64748b' />
            </motion.button>
          )}
        </div>

        {/* Filter Button */}
        {filters.length > 0 && (
          <motion.button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1rem',
              backgroundColor: activeFilterCount > 0 ? '#667eea' : '#f8fafc',
              color: activeFilterCount > 0 ? 'white' : '#64748b',
              border: 'none',
              borderLeft: '1px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            whileHover={{
              backgroundColor: activeFilterCount > 0 ? '#5a67d8' : '#f1f5f9',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter size={16} />
            {activeFilterCount > 0 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '10px',
                }}
              >
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              size={14}
              style={{
                transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </motion.button>
        )}
      </div>

      {/* Öneriler */}
      <AnimatePresence>
        {isSuggestionsOpen && filteredSuggestions.length > 0 && (
          <motion.div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              zIndex: 1000,
              marginTop: '0.5rem',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                onClick={() => {
                  setSearchTerm(suggestion.title);
                  handleSearch(suggestion.title);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  cursor: 'pointer',
                  borderBottom:
                    index < filteredSuggestions.length - 1
                      ? '1px solid #f1f5f9'
                      : 'none',
                }}
                whileHover={{ backgroundColor: '#f8fafc' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {suggestion.icon && (
                  <suggestion.icon size={16} color='#64748b' />
                )}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#1a202c',
                      margin: 0,
                    }}
                  >
                    {suggestion.title}
                  </p>
                  {suggestion.description && (
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        margin: 0,
                      }}
                    >
                      {suggestion.description}
                    </p>
                  )}
                </div>
                {suggestion.category && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#667eea',
                      backgroundColor: '#667eea15',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                    }}
                  >
                    {suggestion.category}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              zIndex: 1000,
              marginTop: '0.5rem',
              padding: '1.5rem',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1a202c',
                  margin: 0,
                }}
              >
                Filtreler
              </h4>
              {activeFilterCount > 0 && (
                <motion.button
                  onClick={clearFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  whileHover={{ color: '#5a67d8' }}
                >
                  Temizle
                </motion.button>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {filters.map(filter => (
                <div key={filter.id}>
                  <label
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem',
                      display: 'block',
                    }}
                  >
                    {filter.label}
                  </label>

                  {filter.type === 'select' && (
                    <select
                      value={activeFilters[filter.id] || ''}
                      onChange={e =>
                        handleFilterChange(filter.id, e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    >
                      <option value=''>Tümü</option>
                      {filter.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === 'date' && (
                    <input
                      type='date'
                      value={activeFilters[filter.id] || ''}
                      onChange={e =>
                        handleFilterChange(filter.id, e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                  )}

                  {filter.type === 'text' && (
                    <input
                      type='text'
                      placeholder={filter.placeholder}
                      value={activeFilters[filter.id] || ''}
                      onChange={e =>
                        handleFilterChange(filter.id, e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '1.5rem',
                justifyContent: 'flex-end',
              }}
            >
              <motion.button
                onClick={() => setIsFilterOpen(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
                whileHover={{ backgroundColor: '#e5e7eb' }}
                whileTap={{ scale: 0.98 }}
              >
                İptal
              </motion.button>
              <motion.button
                onClick={() => {
                  handleSearch();
                  setIsFilterOpen(false);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
                whileHover={{ backgroundColor: '#5a67d8' }}
                whileTap={{ scale: 0.98 }}
              >
                Uygula
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <motion.div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginTop: '1rem',
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find(f => f.id === filterId);
            const displayValue =
              filter?.type === 'select'
                ? filter.options?.find(opt => opt.value === value)?.label ||
                  value
                : value;

            return (
              <motion.div
                key={filterId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#667eea15',
                  color: '#667eea',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Tag size={12} />
                <span>
                  {filter?.label}: {displayValue}
                </span>
                <motion.button
                  onClick={() => handleFilterChange(filterId, null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.125rem',
                    borderRadius: '50%',
                  }}
                  whileHover={{ backgroundColor: '#667eea25' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={12} />
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedSearchBar;
