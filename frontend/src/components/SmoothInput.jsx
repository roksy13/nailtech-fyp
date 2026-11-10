import { useCallback, useEffect, useRef } from "react";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "framer-motion";
import "./SmoothInput.css";

const MotionSpan = motion.span;

/**
 * Adds a smooth typing
 * Inspired by Skiper UI: https://skiper-ui.com/v1/skiper106
 */
export default function SmoothInput({
                                        value,
                                        className = "",
                                        ...props
                                    }) {
    const inputRef = useRef(null);
    const measureRef = useRef(null);
    const frameRef = useRef(null);
    const composingRef = useRef(false);

    const reducedMotion = useReducedMotion();
    const caretX = useMotionValue(0);
    const caretOpacity = useMotionValue(0);

    const springX = useSpring(caretX, {
        stiffness: 500,
        damping: 30,
        mass: 0.5,
    });

    const updateCaret = useCallback(() => {
        const input = inputRef.current;
        const measure = measureRef.current;

        if (
            !input ||
            !measure ||
            reducedMotion ||
            composingRef.current ||
            document.activeElement !== input
        ) {
            caretOpacity.set(0);
            return;
        }

        const start = input.selectionStart;
        const end = input.selectionEnd;

        if (start === null || start !== end) {
            caretOpacity.set(0);
            return;
        }

        const styles = window.getComputedStyle(input);

        measure.style.font = styles.font;
        measure.style.letterSpacing = styles.letterSpacing;
        measure.style.fontFeatureSettings = styles.fontFeatureSettings;
        measure.style.fontVariationSettings = styles.fontVariationSettings;
        measure.textContent = input.value.slice(0, start);

        const paddingLeft = parseFloat(styles.paddingLeft) || 0;
        const paddingRight = parseFloat(styles.paddingRight) || 0;

        const position =
            paddingLeft +
            measure.getBoundingClientRect().width -
            input.scrollLeft;

        const visible =
            position >= paddingLeft &&
            position <= input.clientWidth - paddingRight;

        caretX.set(input.offsetLeft + input.clientLeft + position);
        caretOpacity.set(visible ? 1 : 0);
    }, [caretOpacity, caretX, reducedMotion]);

    const scheduleUpdate = useCallback(() => {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(updateCaret);
    }, [updateCaret]);

    useEffect(() => {
        const input = inputRef.current;

        if (!input) {
            return;
        }

        function hideCaret() {
            caretOpacity.set(0);
        }

        function handleSelection() {
            if (document.activeElement === input) {
                scheduleUpdate();
            }
        }

        function handleCompositionStart() {
            composingRef.current = true;
            input.dataset.composing = "true";
            hideCaret();
        }

        function handleCompositionEnd() {
            composingRef.current = false;
            delete input.dataset.composing;
            scheduleUpdate();
        }

        const events = [
            "input",
            "focus",
            "click",
            "keyup",
            "select",
            "scroll",
        ];

        events.forEach((event) =>
            input.addEventListener(event, scheduleUpdate)
        );

        input.addEventListener("blur", hideCaret);
        input.addEventListener("compositionstart", handleCompositionStart);
        input.addEventListener("compositionend", handleCompositionEnd);
        document.addEventListener("selectionchange", handleSelection);
        document.fonts.addEventListener("loadingdone", scheduleUpdate);

        const observer = new ResizeObserver(scheduleUpdate);
        observer.observe(input);

        scheduleUpdate();

        return () => {
            cancelAnimationFrame(frameRef.current);

            events.forEach((event) =>
                input.removeEventListener(event, scheduleUpdate)
            );

            input.removeEventListener("blur", hideCaret);
            input.removeEventListener(
                "compositionstart",
                handleCompositionStart
            );
            input.removeEventListener(
                "compositionend",
                handleCompositionEnd
            );
            document.removeEventListener(
                "selectionchange",
                handleSelection
            );
            document.fonts.removeEventListener(
                "loadingdone",
                scheduleUpdate
            );

            observer.disconnect();
        };
    }, [caretOpacity, scheduleUpdate]);

    useEffect(() => {
        scheduleUpdate();
    }, [value, scheduleUpdate]);

    return (
        <div className="smooth-input">
            <input
                {...props}
                ref={inputRef}
                type="text"
                dir="ltr"
                value={value}
                className={`smooth-input__field ${className}`}
                data-smooth={!reducedMotion}
            />

            <span
                ref={measureRef}
                className="smooth-input__measure"
                aria-hidden="true"
            />

            <MotionSpan
                className="smooth-input__caret"
                aria-hidden="true"
                style={{
                    x: springX,
                    opacity: caretOpacity,
                }}
            />
        </div>
    );
}