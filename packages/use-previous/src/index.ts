import { useEffect, useRef } from 'react';

export type ArgValue = null | undefined | any;

/**
 * @function usePrevious
 * @description Custom hook for getting previous value of some variable
 * @param {ArgValue} value
 * @returns {ArgValue} Previous value of the variable
 */
function usePrevious(value: ArgValue): ArgValue {
    const ref = useRef<ArgValue>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

export default usePrevious;
