import './editor.css';

import BlockLabel from '../components/block-label';
import { useBlockProps } from '@wordpress/block-editor';

const LOGO_COUNT = 4;

const DEFAULT_LOGOS = [
	{ alt: 'AF', file: 'af-logo.svg' },
	{ alt: 'Tele Dark', file: 'tele-dark-logo.svg' },
	{ alt: 'Elastic', file: 'elastic-logo.svg' },
	{ alt: 'Crowdstrike', file: 'crowdstrike-logo.svg' },
];

function getTemplateUrl() {
	return window.observata?.templateUrl || '';
}

export default function SectionTrustBarEdit() {
	const blockProps = useBlockProps({
		className: 'section-trust-bar',
		style: {
			display: 'grid',
			gridTemplateColumns: `repeat(${LOGO_COUNT}, minmax(0, 1fr))`,
			gap: '2rem',
			alignItems: 'center',
		},
	});

	return (
		<div {...blockProps}>
			<div style={{ gridColumn: `1 / -1` }}>
				<BlockLabel name="Section Trust Bar" />
			</div>
			{DEFAULT_LOGOS.slice(0, LOGO_COUNT).map((logo, index) => {
				const src = `${getTemplateUrl()}/assets/svg/logos/bar/${logo.file}`;

				return (
					<div key={index} className="section-trust-bar-item">
						<img
							src={src}
							alt={logo.alt}
							style={{
								maxWidth: '120px',
								maxHeight: '30px',
							}}
						/>
					</div>
				);
			})}
		</div>
	);
}
