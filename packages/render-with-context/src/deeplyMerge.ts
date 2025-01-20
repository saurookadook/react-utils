function isObject(val: unknown) {
    return typeof val === 'object' && val != null && !Array.isArray(val);
}

function handleAssignment({ assignmentTarget, targetValue }) {
    return isObject(targetValue) // force formatting
        ? deeplyMerge(assignmentTarget || {}, targetValue)
        : targetValue;
}

/**
 * @description Recursively merge source object into target object.
 * @todo Maybe replace with `lodash.merge` or `deeplyAssign`?
 *
 * @param {object} target
 * @param {object} source
 * @returns {object} Original target object with source recursively merged into it.
 */
export function deeplyMerge(target, source) {
    if (!isObject(target)) {
        throw new TypeError("[deeplyMerge] : argument 'target' must be an object!");
    }
    if (!isObject(source)) {
        throw new TypeError("[deeplyMerge] : argument 'source' must be an object!");
    }

    for (const [sourceKey, sourceValue] of Object.entries(source)) {
        target[sourceKey] = handleAssignment({
            assignmentTarget: target[sourceKey],
            targetValue: sourceValue,
        });
    }

    return target;
}
