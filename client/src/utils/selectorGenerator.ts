/**
 * Generates a unique CSS selector for an element
 */
export function generateSelector(element: Element): string {
    // If element has a unique ID, use it
    if (element.id && isIdUnique(element)) {
        return `#${CSS.escape(element.id)}`;
    }

    const path: string[] = [];
    let current: Element | null = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
        let selector = current.tagName.toLowerCase();

        // If element has a unique ID, stop here
        if (current.id && isIdUnique(current)) {
            selector = `#${CSS.escape(current.id)}`;
            path.unshift(selector);
            break;
        }

        // Add nth-child if there are siblings of the same type
        const parent: Element | null = current.parentElement;
        if (parent) {
            const currentTagName = current.tagName;
            const siblings = Array.from(parent.children).filter(
                (child: Element) => child.tagName === currentTagName
            );

            if (siblings.length > 1) {
                const index = siblings.indexOf(current) + 1;
                selector += `:nth-of-type(${index})`;
            }
        }

        path.unshift(selector);
        current = parent;

        // Stop at body or html
        if (current?.tagName.toLowerCase() === 'html') {
            break;
        }
    }

    return path.join(' > ');
}

/**
 * Check if an ID is unique in the document
 */
function isIdUnique(element: Element): boolean {
    if (!element.id) return false;
    const doc = element.ownerDocument;
    if (!doc) return false;

    try {
        const matches = doc.querySelectorAll(`#${CSS.escape(element.id)}`);
        return matches.length === 1;
    } catch {
        return false;
    }
}

/**
 * Get a more readable selector with class names when appropriate
 */
export function getReadableSelector(element: Element): string {
    const selector = generateSelector(element);

    // Try to simplify if the selector is too long
    if (selector.length > 100) {
        // Try with classes
        const classSelector = getClassBasedSelector(element);
        if (classSelector && classSelector.length < selector.length) {
            return classSelector;
        }
    }

    return selector;
}

/**
 * Generate a selector using class names
 */
function getClassBasedSelector(element: Element): string | null {
    if (!element.className || typeof element.className !== 'string') return null;

    const classes = element.className.trim().split(/\s+/).filter(Boolean);
    if (classes.length === 0) return null;

    const tagName = element.tagName.toLowerCase();
    const classSelector = classes.slice(0, 2).map(c => `.${CSS.escape(c)}`).join('');
    const fullSelector = `${tagName}${classSelector}`;

    try {
        const doc = element.ownerDocument;
        if (!doc) return null;

        const matches = doc.querySelectorAll(fullSelector);
        if (matches.length === 1) {
            return fullSelector;
        }
    } catch {
        return null;
    }

    return null;
}
