import getEnvVars from '../../environment';

const useThirdPartyService = () => {
  const { affindaKey, affindaWorkspaceId } = getEnvVars();

  const uploadResumeToParser = (base64: string) => {
    const form = new FormData();
    form.append('wait', 'true');
    form.append('rejectDuplicates', 'false');
    form.append('file', base64);
    form.append('workspace', affindaWorkspaceId);

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${affindaKey}`,
      },
    };
    options.body = form;
    return fetch('https://api.affinda.com/v3/documents', options)
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  return {
    uploadResumeToParser,
  };
};

export default useThirdPartyService;
