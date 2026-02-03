export const saveCode = async (code, filename) => {
    try
    {
        const response = await fetch("/usersrc/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, filename })
        });

        const data = await response.json();

        if (!response.ok)
        {
            console.error("Error:", data.error);
            alert(`Помилка: ${data.error}`);
            return;
        }

        console.log("Success:", data.message);
        alert(`Файл успішно збережено`);
    }
    catch (err)
    {
        console.error("Fetch error:", err);
        alert("Сталася помилка при збереженні файлу");
    }
};

export const submitCode = async (code, filename) => {
    try
    {
        const response = await fetch("/usersrc/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, filename })
        });

        const data = await response.json();

        if (!response.ok)
        {
            console.error("Error:", data.error);
            alert(`Помилка: ${data.error}`);
            return;
        }

        console.log("Success:", data.message);
        alert("Code successfully submitted");
    }
    catch (err)
    {
        console.error("Fetch error:", err);
        alert("An error occurred while submitting the code");
    }
};

export const getFileNamesList = async () => {
    try
    {
        const response = await fetch("/usersrc/filenames");
        if (!response.ok) {
            throw new Error(`error: status ${response.status}`);
        }

        const data = await response.json();
        return data.files;
    }
    catch (error)
    {
        console.error("Помилка при отриманні списку файлів:", error);
        return [];
    }
};

export const getFileByName = async (filename, mode) => {
    try
    {
        const fileStatus = mode === "dev" ? "saved" : "submitted";
        const response = await fetch(`/usersrc/getfile?filename=${encodeURIComponent(filename)}&fileStatus=${encodeURIComponent(fileStatus)}`);
        if (!response.ok)
            throw new Error("Unable to retrieve file");
        
        const data = await response.json();
        return data.code;
    }
    catch (error)
    {
        console.error("Unable to retrieve file:", error);
        return "";
    }
};