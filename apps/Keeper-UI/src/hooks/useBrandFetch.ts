import { useCallback, useState } from 'react';
import { MiscService } from 'services';

import useDebounce from './useDebounce';

const useBrandFetch = () => {
  const [brandFetchAutoCompleteData, setBrandFetchAutoCompleteData] = useState<any[]>();
  const [isBrandFetchLoading, setIsBrandFetchLoading] = useState(false);

  const onBrandFetchSearch = useCallback(async (searchValue: string) => {
    if (searchValue !== '') {
      try {
        setIsBrandFetchLoading(true);
        const res = await MiscService.searchBrandFetch({ searchValue });

        setBrandFetchAutoCompleteData(res);
      } catch (err) {
        console.error('Something went wrong, try again later.');
      }
      setIsBrandFetchLoading(false);
      return;
    }

    setBrandFetchAutoCompleteData([]);
  }, []);

  const debouncedSearchBrandFetch = useDebounce(async (searchValue: string) => {
    onBrandFetchSearch(searchValue);
  }, 500);

  const onSelectCompany = useCallback(async (companyName: string) => {
    try {
      setIsBrandFetchLoading(true);
      const res = await MiscService.collectBrandFetch({ companyName });
      setIsBrandFetchLoading(false);

      return res;
    } catch (err) {
      console.error('Something went wrong, try again later.');
    }
    setIsBrandFetchLoading(false);
  }, []);

  return {
    brandFetchAutoCompleteData,
    isBrandFetchLoading,
    setBrandFetchAutoCompleteData,
    debouncedSearchBrandFetch,
    onSelectCompany,
  };
};

export default useBrandFetch;
