class DockingNode {
    constructor(id, weight = 5, isRoot = false) {
        this.id = id;
        this.next = [];
        this.weight = weight;
        this.massCenter = isRoot ? { x: 0, y: 0 } : null; // тільки для коренів
    }
}

export class DockingTree {
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
    static addNode(id, parentId = null, weight = 5) {
        const isRoot = parentId === null;
        const newNode = new DockingNode(id, weight, isRoot);

        if (isRoot) {
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
            node.massCenter = { x: 0, y: 0 }; // при переносі в root знову має massCenter
            DockingTree.tree.push(node);
            return;
        }

        node.massCenter = null; // якщо вже не root
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

    getOffsetFromRoot(rootPos, childPos)
    {
        //
    }

    // ======== ЦЕНТР МАСИ ПІДДЕРЕВА ========
    static getMassCenter(rootId, positions) {
        const root = DockingTree.findNode(rootId);
        if (!root) throw new Error(`Вузол з id=${rootId} не знайдений`);

        const ids = [root.id, ...DockingTree.getAllChildIds(rootId)];

        // глобальна позиція кореня
        const rootPos = positions.get(rootId);

        let sumX = 0, sumY = 0, totalMass = 0;

        for (let id of ids) {
            const node = DockingTree.findNode(id);
            const childPos = positions.get(id); // глобальна позиція вузла

            const m = node.weight;
            sumX += childPos.x * m;
            sumY += childPos.y * m;
            totalMass += m;
        }

        // глобальна позиція центру маси
        const globalCenter = { x: sumX / totalMass, y: sumY / totalMass };

        // відносно кореня
        const centerRelativeToRoot = {
            x: globalCenter.x - rootPos.x,
            y: globalCenter.y - rootPos.y
        };

        if (root.massCenter !== null) root.massCenter = centerRelativeToRoot;

        return centerRelativeToRoot;
    }

    static updateAllMassCenters(positions) {
        for (let node of DockingTree.tree) {
            const mc = DockingTree.getMassCenter(node.id, positions);
            node.massCenter = mc;   // збереження обчисленого центру маси
        }
    }

    // ======== ВИВІД ДЕРЕВА ========
    static printTree(nodes = DockingTree.tree, level = 0) {
        for (let node of nodes) {
            let info = `- ${node.id} (w=${node.weight})`;
            if (node.massCenter) {
                info += ` (massCenter: ${JSON.stringify(node.massCenter)})`;
            }
            console.log("  ".repeat(level) + info);
            DockingTree.printTree(node.next, level + 1);
        }
    }
}
