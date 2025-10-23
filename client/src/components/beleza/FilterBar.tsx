import React from 'react';

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  colorScheme?: 'pink' | 'green' | 'purple';
}

// CSS customizado para o estilo dos filtros
const filterStyles = `
  .filter-btn.active {
    background-color: #ec4899;
    color: white;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
`;

const filters = [
  {
    id: 'todos',
    label: 'Todos',
    icon: (isActive: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
    )
  },
  {
    id: 'tendencias',
    label: 'Tendências',
    icon: (isActive: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z"></path>
      </svg>
    )
  },
  {
    id: 'mais-curtidos',
    label: 'Mais Curtidos',
    icon: (isActive: boolean) => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
      </svg>
    )
  }
];

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="mb-10">
      <style>{filterStyles}</style>
      <div className="flex flex-wrap justify-center items-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`filter-btn transition-all duration-300 ease-in-out py-2 px-4 sm:py-3 sm:px-8 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base ${
              activeFilter === filter.id
                ? 'active bg-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-pink-100 shadow-sm'
            }`}
          >
            {filter.icon(activeFilter === filter.id)}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
