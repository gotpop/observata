import './graphic-select.css';

import { createElement, useEffect, useState } from '@wordpress/element';

const svgCache = new Map();

async function fetchSvg(url) {
    if (svgCache.has(url)) {
        return svgCache.get(url);
    }
    try {
        const res = await fetch(url);
        let text = await res.text();
        text = text.replace(/<\?xml[^?]*\?>/g, '').trim();
        svgCache.set(url, text);
        return text;
    } catch {
        return null;
    }
}

/**
 * Inline SVG preview rendered as DOM markup so editor CSS variables apply.
 */
function SvgPreview({ src }) {
    const [svg, setSvg] = useState(() => svgCache.get(src) ?? '');

    useEffect(() => {
        let cancelled = false;
        fetchSvg(src).then((markup) => {
            if (!cancelled && markup) {
                setSvg(markup);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [src]);

    if (!svg) {
        return <span className="graphic-select-option-icon graphic-select-option-icon--placeholder" />;
    }

    return <span className="graphic-select-option-icon" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/**
 * Reusable select component using the customizable <select> API (appearance: base-select).
 *
 * Supports rich option content — SVG icons, images, or plain text — rendered inside
 * native <option> elements. The browser clones the selected option into a
 * <selectedcontent> element inside the select button.
 *
 * @param {Object}   props
 * @param {string}   [props.label]          Label shown above the select.
 * @param {string}   props.value            Currently selected value.
 * @param {Array}    props.options          Array of { label, value, icon? } objects.
 * @param {Function} props.onChange         Callback receiving the new value.
 * @param {string}   [props.className]      Extra class on the container.
 * @param {string}   [props.help]           Help text below the select.
 */
export default function GraphicSelect({ label, value, options, onChange, className = '', help }) {
    return (
        <div className={`graphic-select-container ${className}`.trim()}>
            {label && <label className="graphic-select-label">{label}</label>}
            <select className="graphic-select" value={value} onChange={(e) => onChange(e.target.value)}>
                <button className="graphic-select-button">{createElement('selectedcontent')}</button>
                {options.map((option) => (
                    <option key={option.value} value={option.value} className="graphic-select-option">
                        {option.icon && <SvgPreview src={option.icon} />}
                        <span className="graphic-select-option-label">{option.label}</span>
                    </option>
                ))}
            </select>
            {help && <p className="graphic-select-help">{help}</p>}
        </div>
    );
}
