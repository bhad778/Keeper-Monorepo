import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { KeeperSlider } from 'components';
import { SeniorityLevelEnum } from 'keeperTypes';
import { cities, TechnologiesList } from 'keeperConstants';
import { TGetJobsForSwipingPayload } from 'keeperServices';
import { useTheme } from 'theme/theme.context';

import useStyles from './FilterSidebarStyles';

interface FilterSidebarProps {
  filters: TGetJobsForSwipingPayload;
  isLocationVisible: boolean;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleFilter: (key: 'seniorityLevel' | 'locationFlexibility' | 'relevantSkills', value: string) => void;
  handleCityChange: (event: any) => void;
  handleSalaryChange: (value: number) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  isLocationVisible,
  handleSearchChange,
  toggleFilter,
  handleCityChange,
  handleSalaryChange,
}) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <div style={styles.sidebar}>
      {/* Search input */}
      <h3 style={styles.filterTitle}>Title</h3>
      <input
        type='text'
        placeholder='Senior react developer...'
        style={styles.searchBar}
        value={filters.preferences?.textSearch || ''}
        onChange={handleSearchChange}
      />

      {/* Job Level Filter */}
      <div style={styles.filterGroup}>
        <h3 style={styles.filterTitle}>Seniority Level</h3>
        <div style={styles.filterOptions}>
          {Object.values(SeniorityLevelEnum).map(level => (
            <button
              key={level}
              style={{
                ...styles.filterButton,
                backgroundColor: filters.preferences?.seniorityLevel?.includes(level)
                  ? styles.filterButtonSelected.backgroundColor
                  : styles.filterButton.backgroundColor,
              }}
              onClick={() => toggleFilter('seniorityLevel', level)}>
              <span style={styles.buttonText}>{level}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Location Flexibility Filter */}
      <div style={styles.filterGroup}>
        <h3 style={styles.filterTitle}>Location Flexibility</h3>
        <div style={styles.filterOptions}>
          {['Remote', 'On-site', 'Hybrid'].map(option => (
            <button
              key={option}
              style={{
                ...styles.filterButton,
                backgroundColor: filters.preferences?.locationFlexibility?.includes(option)
                  ? styles.filterButtonSelected.backgroundColor
                  : styles.filterButton.backgroundColor,
              }}
              onClick={() => toggleFilter('locationFlexibility', option)}>
              <span style={styles.buttonText}>{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* City Location Dropdown */}
      {isLocationVisible && (
        <div style={styles.filterGroup}>
          <h3 style={styles.filterTitle}>City</h3>
          <FormControl
            fullWidth
            sx={{
              mt: 1,
              '& .MuiInputBase-root': {
                color: 'white',
                backgroundColor: () => (isLocationVisible ? 'rgba(255, 255, 255, 0.1)' : theme.color.keeperGrey),
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: () => (isLocationVisible ? 'rgba(255, 255, 255, 0.3)' : 'white'),
              },
              '& .MuiSvgIcon-root': {
                color: 'white',
              },
              '&.Mui-disabled': {
                opacity: 0.6,
              },
            }}>
            <InputLabel id='city-select-label' sx={{ color: 'white' }}>
              City
            </InputLabel>
            <Select
              labelId='city-select-label'
              id='city-select'
              value={filters.preferences?.city || ''}
              label='City'
              onChange={handleCityChange}
              sx={{
                color: 'white',
                '& .MuiSelect-icon': { color: 'white' },
              }}>
              <MenuItem value=''>
                <em>Select a city</em>
              </MenuItem>
              {cities.map(city => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}

      {/* Salary Filter */}
      <div style={styles.filterGroup}>
        <h3 style={styles.filterTitle}>Minimum Salary</h3>
        <div style={styles.filterOptions}>
          <KeeperSlider
            minimumValue={30000}
            maximumValue={300000}
            step={5000}
            defaultValue={(filters.preferences?.minimumSalary as number) || 140000}
            formatDisplayValue={value => `$${value.toLocaleString()}`}
            onSliderComplete={handleSalaryChange}
          />
        </div>
      </div>

      {/* Skills Filter */}
      <div style={styles.filterGroup}>
        <h3 style={styles.filterTitle}>Skills</h3>
        <div style={styles.skillOptions}>
          {TechnologiesList.map((skill: string) => (
            <button
              key={skill}
              style={{
                ...styles.skillButton,
                backgroundColor: filters.preferences?.relevantSkills?.includes(skill)
                  ? styles.filterButtonSelected.backgroundColor
                  : styles.skillButton.backgroundColor,
              }}
              onClick={() => toggleFilter('relevantSkills', skill)}>
              <span style={styles.buttonText}>{skill}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
