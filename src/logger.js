export class Logger
{
    static info(msg, loggedClass)
    {
        const now = new Date();
    
        // Отримати години, хвилини та секунди
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        let time = hours + ":" + minutes + ":" + seconds;
        console.log(`${time} [${loggedClass.name}] info: ${msg}`);
    }

    static warn(msg, loggedClass)
    {
        const now = new Date();
    
        // Отримати години, хвилини та секунди
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        let time = hours + ":" + minutes + ":" + seconds;
        console.log(`${time} [${loggedClass.name}] warn: ${msg}`);
    }

    static error(msg, loggedClass)
    {
        const now = new Date();
    
        // Отримати години, хвилини та секунди
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        let time = hours + ":" + minutes + ":" + seconds;
        console.log(`${time} [${loggedClass.name}] error: ${msg}`);
    }
}