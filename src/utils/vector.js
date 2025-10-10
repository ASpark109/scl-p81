export class Vector
{
    static add(v1, v2)
    {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        };
    }

    static sub(v1, v2)
    {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        };
    }

    static mult(v, a)
    {
        return {
            x: v.x * a,
            y: v.y * a
        };
    }

    static div(v, a)
    {
        if (a === 0) {
            throw new Error("Division by zero is not allowed.");
        }
    
        return {
            x: v.x / a,
            y: v.y / a
        };
    }

    static normalise(v)
    {
        const length = Math.sqrt(v.x * v.x + v.y * v.y);
    
        if (length === 0) {
            throw new Error("Cannot normalize a zero-length vector.");
        }
    
        return {
            x: v.x / length,
            y: v.y / length
        };
    }

    static magnitude(v)
    {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
}