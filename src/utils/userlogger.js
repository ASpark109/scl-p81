export function logger(log)
{
    window.parent?.postMessage({
        type: "log",
        payload: log,
        }, "*");
}