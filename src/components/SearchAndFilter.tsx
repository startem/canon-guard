import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, Calendar as CalendarIcon, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'boolean';
  options?: FilterOption[];
}

interface SearchAndFilterProps {
  data: any[];
  searchKeys: string[];
  filterConfigs: FilterConfig[];
  onFilteredData: (filteredData: any[]) => void;
  placeholder?: string;
  className?: string;
}

export const SearchAndFilter = ({
  data,
  searchKeys,
  filterConfigs,
  onFilteredData,
  placeholder = "Search...",
  className = ""
}: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm.trim()) {
      result = result.filter(item => 
        searchKeys.some(key => {
          const value = key.split('.').reduce((obj, k) => obj?.[k], item);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([filterKey, filterValue]) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return;

      const config = filterConfigs.find(c => c.key === filterKey);
      if (!config) return;

      result = result.filter(item => {
        const itemValue = filterKey.split('.').reduce((obj, k) => obj?.[k], item);

        switch (config.type) {
          case 'select':
            return itemValue === filterValue;
          case 'multiselect':
            return Array.isArray(filterValue) && filterValue.includes(itemValue);
          case 'boolean':
            return Boolean(itemValue) === filterValue;
          case 'date':
            if (!filterValue) return true;
            const itemDate = new Date(itemValue);
            const filterDate = new Date(filterValue);
            return itemDate.toDateString() === filterDate.toDateString();
          case 'daterange':
            if (!filterValue.from && !filterValue.to) return true;
            const date = new Date(itemValue);
            if (filterValue.from && date < new Date(filterValue.from)) return false;
            if (filterValue.to && date > new Date(filterValue.to)) return false;
            return true;
          default:
            return true;
        }
      });
    });

    return result;
  }, [data, searchTerm, filters, searchKeys, filterConfigs]);

  // Update parent component with filtered data
  React.useEffect(() => {
    onFilteredData(filteredData);
  }, [filteredData, onFilteredData]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  const removeFilter = (filterKey: string) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    setFilters(newFilters);
  };

  const activeFilterCount = Object.values(filters).filter(value => 
    value && (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  const renderFilterInput = (config: FilterConfig) => {
    const value = filters[config.key];

    switch (config.type) {
      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) => setFilters(prev => ({ ...prev, [config.key]: newValue }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${config.label}`} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label} {option.count && `(${option.count})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {config.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${config.key}-${option.value}`}
                  checked={value?.includes(option.value) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    setFilters(prev => ({ ...prev, [config.key]: newValues }));
                  }}
                />
                <label htmlFor={`${config.key}-${option.value}`} className="text-sm">
                  {option.label} {option.count && `(${option.count})`}
                </label>
              </div>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, [config.key]: checked }))}
            />
            <label className="text-sm">{config.label}</label>
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), 'PPP') : `Select ${config.label}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => setFilters(prev => ({ ...prev, [config.key]: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'daterange':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value?.from ? (
                  value.to ? (
                    `${format(new Date(value.from), 'PPP')} - ${format(new Date(value.to), 'PPP')}`
                  ) : (
                    format(new Date(value.from), 'PPP')
                  )
                ) : (
                  `Select ${config.label}`
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={value}
                onSelect={(range) => setFilters(prev => ({ ...prev, [config.key]: range }))}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {(searchTerm || activeFilterCount > 0) && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            const config = filterConfigs.find(c => c.key === key);
            if (!config) return null;

            let displayValue = value;
            if (config.type === 'multiselect' && Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (config.type === 'date' && value) {
              displayValue = format(new Date(value), 'PPP');
            } else if (config.type === 'daterange' && value?.from) {
              displayValue = value.to 
                ? `${format(new Date(value.from), 'PP')} - ${format(new Date(value.to), 'PP')}`
                : format(new Date(value.from), 'PP');
            }

            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {config.label}: {displayValue}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeFilter(key)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="p-4 border rounded-lg bg-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterConfigs.map(config => (
              <div key={config.key} className="space-y-2">
                <label className="text-sm font-medium">{config.label}</label>
                {renderFilterInput(config)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} results
        {searchTerm && ` for "${searchTerm}"`}
      </div>
    </div>
  );
};