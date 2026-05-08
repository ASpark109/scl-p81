export const getTestEnvConfigNames = async () => {
    try
    {
        const response = await fetch(`/testenv/testconfigs`);
        if (!response.ok)
            throw new Error("Unable to retrieve files");
        
        const data = await response.json();
        return data.fileNames;
    }
    catch (error)
    {
        console.error("Unable to retrieve files:", error);
        return "";
    }
};

export const getTestConfig = async (filename) => {
    try
    {
        const response = await fetch(`/testenv/gettestconfig?filename=${encodeURIComponent(filename)}`);
        if (!response.ok)
            throw new Error("Unable to retrieve file");
        
        const data = await response.json();

        return data.configData;
    }
    catch (error)
    {
        console.error("Unable to retrieve file:", error);
        return null;
    }
};