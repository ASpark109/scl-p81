class DockingNode {
    constructor(id, massCenter = null) {
        this.id = id;
        this.next = [];
        this.massCenter = massCenter; // тільки для кореня
    }
}

class DockingTree {
    static tree = [];

    // ======== ПОШУК ========
    static findNode(id, current = DockingTree.tree) {
        for (let node of current) {
            if (node.id === id) return node;
            let found = DockingTree.findNode(id, node.next);
            if (found) return found;
        }
        return null;
    }

    // ======== ДОДАТИ ========
    static addNode(id, parentId = null, massCenter = null) {
        const newNode = new DockingNode(id, parentId === null ? massCenter : null);

        if (parentId === null) {
            DockingTree.tree.push(newNode);
            return newNode;
        }

        const parent = DockingTree.findNode(parentId);
        if (!parent) {
            throw new Error(`Батьківський вузол з id=${parentId} не знайдений`);
        }

        parent.next.push(newNode);
        return newNode;
    }

    // ======== ВИДАЛИТИ ========
    static removeNode(id, current = DockingTree.tree) {
        for (let i = 0; i < current.length; i++) {
            if (current[i].id === id) {
                return current.splice(i, 1)[0];
            }
            const removed = DockingTree.removeNode(id, current[i].next);
            if (removed) return removed;
        }
        return null;
    }

    // ======== ПЕРЕНЕСТИ ========
    static moveNode(id, newParentId = null) {
        const node = DockingTree.removeNode(id);
        if (!node) throw new Error(`Вузол з id=${id} не знайдений`);

        if (newParentId === null) {
            node.massCenter = node.massCenter ?? { x: 0, y: 0 };
            DockingTree.tree.push(node);
            return;
        }

        node.massCenter = null;
        const newParent = DockingTree.findNode(newParentId);
        if (!newParent) throw new Error(`Новий батько з id=${newParentId} не знайдений`);

        newParent.next.push(node);
    }

    // ======== УСІ ID ПІД ВУЗЛОМ ========
    static getAllChildIds(id) {
        const node = DockingTree.findNode(id);
        if (!node) return [];

        const result = [];

        function collectChildren(children) {
            for (let child of children) {
                result.push(child.id);
                collectChildren(child.next);
            }
        }

        collectChildren(node.next);
        return result;
    }

    // ======== ЦЕНТР МАСИ ПІДДЕРЕВА ========
    /**
     * @param {string} rootId - id вузла
     * @param {Object} positions - словник {id: {x,y}}
     * @param {Object} weights - словник {id: число}
     * @returns {{x:number,y:number}}
     */
    static getMassCenter(rootId, positions, weights) {
        const root = DockingTree.findNode(rootId);
        if (!root) throw new Error(`Вузол з id=${rootId} не знайдений`);

        let totalMass = 0;
        let sumX = 0;
        let sumY = 0;

        function dfs(node, offsetX, offsetY) {
            const localPos = positions[node.id] ?? { x: 0, y: 0 };
            const m = weights[node.id] ?? 1;

            const globalX = offsetX + localPos.x;
            const globalY = offsetY + localPos.y;

            sumX += globalX * m;
            sumY += globalY * m;
            totalMass += m;

            for (let child of node.next) {
                dfs(child, globalX, globalY);
            }
        }

        dfs(root, 0, 0);

        return {
            x: sumX / totalMass,
            y: sumY / totalMass
        };
    }

    // ======== ВИВІД ДЕРЕВА ========
    static printTree(nodes = DockingTree.tree, level = 0) {
        for (let node of nodes) {
            let info = `- ${node.id}`;
            if (level === 0 && node.massCenter) {
                info += ` (massCenter: ${JSON.stringify(node.massCenter)})`;
            }
            console.log("  ".repeat(level) + info);
            DockingTree.printTree(node.next, level + 1);
        }
    }
}
