import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setEmployeePreferencesRedux } from 'reduxStore';
import { TGetJobsForSwipingPayload, UsersService } from 'keeperServices';
import { LocationFlexibilityEnum } from 'keeperTypes';
import useDebounce from 'keeperUtils/useDebounce';

export const useJobFilters = () => {
  const dispatch = useDispatch();

  // Get filter values from Redux
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const employeeId = useSelector((state: RootState) => state.loggedInUser._id);
  const reduxTextSearch = useSelector((state: RootState) => state.loggedInUser.preferences.textSearch);
  const reduxSeniorityLevel = useSelector((state: RootState) => state.loggedInUser.preferences.seniorityLevel || []);
  const reduxMinimumSalary = useSelector((state: RootState) => state.loggedInUser.preferences.minimumSalary);
  const reduxLocationFlexibility = useSelector(
    (state: RootState) => state.loggedInUser.preferences.locationFlexibility || [],
  );
  const reduxCity = useSelector((state: RootState) => state.loggedInUser.preferences.city);
  const reduxRelevantSkills = useSelector((state: RootState) => state.loggedInUser.preferences.relevantSkills || []);

  // Create initial filter state from Redux values
  const [filters, setFilters] = useState<TGetJobsForSwipingPayload>({
    userId: employeeId,
    preferences: {
      textSearch: reduxTextSearch,
      seniorityLevel: reduxSeniorityLevel,
      minimumSalary: reduxMinimumSalary,
      locationFlexibility: reduxLocationFlexibility,
      city: reduxCity,
      relevantSkills: reduxRelevantSkills,
    },
  });

  // Track whether filters have been updated by user actions
  const filtersUpdatedRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateFiltersReduxAndDb = () => {
    dispatch(
      setEmployeePreferencesRedux({
        ...filters.preferences,
      }),
    );
    UsersService.updateEmployeePreferences({
      userId: employeeId || '',
      preferencesObject: filters.preferences!,
    }).catch(err => console.error('Error updating employee preferences:', err));
  };

  // Create the update function
  const updateFilters = useCallback(() => {
    if (filtersUpdatedRef.current && isLoggedIn) {
      updateFiltersReduxAndDb();
      filtersUpdatedRef.current = false;
    }
  }, [isLoggedIn, updateFiltersReduxAndDb]);

  // Create a debounced version using your existing hook
  const debouncedUpdateFilters = useDebounce(updateFilters, 500);

  // Call the debounced function when filters change
  useEffect(() => {
    debouncedUpdateFilters();
  }, [filters]);

  // Handle text search with debounce
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      preferences: {
        ...prevFilters.preferences,
        textSearch: value,
      },
    }));
    filtersUpdatedRef.current = true;
  };

  // Toggle filter values (for buttons)
  const toggleFilter = (key: 'seniorityLevel' | 'locationFlexibility' | 'relevantSkills', value: string) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters.preferences?.[key] || [];

      if (key === 'locationFlexibility' && currentValues.includes(value) && currentValues.length === 1) {
        // Return the previous filters unchanged if trying to remove the last option
        return prevFilters;
      }

      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      filtersUpdatedRef.current = true;

      return {
        ...prevFilters,
        preferences: {
          ...prevFilters.preferences,
          [key]: newValues,
        },
      };
    });
  };

  // Handle city selection
  const handleCityChange = (event: any) => {
    const city = event.target.value;

    setFilters(prevFilters => ({
      ...prevFilters,
      preferences: {
        ...prevFilters.preferences,
        city,
      },
    }));

    filtersUpdatedRef.current = true;
  };

  // Handle salary slider changes
  const handleSalaryChange = (value: number) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      preferences: {
        ...prevFilters.preferences,
        minimumSalary: value,
      },
    }));

    filtersUpdatedRef.current = true;
  };

  return {
    filters,
    handleSearchChange,
    toggleFilter,
    handleCityChange,
    handleSalaryChange,
    filtersUpdatedRef,
  };
};
