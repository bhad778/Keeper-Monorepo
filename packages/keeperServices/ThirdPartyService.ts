// TODO: PUT THIS INTO BACKEND API SO WE DONT HAVE TO EXPOSE
const affindaKey = 'aff_e3c2ea8157f4a53a150f68d13e17cebaf8326fab';
const affindaWorkspaceId = 'ViTkWMXy';

const useThirdPartyService = () => {
  const uploadResumeToParser = (base64: string | Blob) => {
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
      body: form,
    };
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
