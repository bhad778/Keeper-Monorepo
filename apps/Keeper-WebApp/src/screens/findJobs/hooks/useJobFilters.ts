import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setEmployeePreferencesRedux } from 'reduxStore';
import { TGetJobsForSwipingPayload } from 'keeperServices';
import { TLocationFlexibility } from 'keeperTypes';

const SEARCH_DEBOUNCE_DELAY = 1000;

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

  // Determine if location options should be visible
  const isLocationVisible =
    filters.preferences?.locationFlexibility?.includes('Hybrid' as TLocationFlexibility) ||
    filters.preferences?.locationFlexibility?.includes('On-site' as TLocationFlexibility);

  // Update Redux when filters change (with debounce)
  useEffect(() => {
    if (filtersUpdatedRef.current && isLoggedIn) {
      dispatch(
        setEmployeePreferencesRedux({
          ...filters.preferences,
        }),
      );
      filtersUpdatedRef.current = false;
    }
  }, [filters, dispatch, isLoggedIn]);

  // Handle text search with debounce
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prevFilters => ({
        ...prevFilters,
        textSearch: value,
      }));
      filtersUpdatedRef.current = true;
    }, SEARCH_DEBOUNCE_DELAY);
  };

  // Toggle filter values (for buttons)
  const toggleFilter = (key: 'seniorityLevel' | 'locationFlexibility' | 'relevantSkills', value: string) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters.preferences?.[key] || [];
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
    isLocationVisible,
    handleSearchChange,
    toggleFilter,
    handleCityChange,
    handleSalaryChange,
    filtersUpdatedRef,
  };
};
