import CalloutEdit from './callout/edit';
import CalloutSave from './callout/save';
import CardEdit from './card/edit';
import CardSave from './card/save';
import CardsEdit from './cards/edit';
import CardsSave from './cards/save';
import HeroEdit from './hero/edit';
import HeroSave from './hero/save';
import IntroEdit from './intro/edit';
import IntroSave from './intro/save';
import calloutMetadata from '../blocks/callout/block.json';
import cardMetadata from '../blocks/card/block.json';
import cardSwooshIconMetadata from '../blocks/card-swoosh-icon/block.json';
import cardsGridMetadata from '../blocks/cards-grid/block.json';
import cardsMetadata from '../blocks/cards/block.json';
import cardsTripleMetadata from '../blocks/cards-triple/block.json';
import footerMetadata from '../blocks/footer/block.json';
import headerMetadata from '../blocks/header/block.json';
import heroMetadata from '../blocks/hero/block.json';
import introMetadata from '../blocks/intro/block.json';
import observabilityMetadata from '../blocks/observability/block.json';
import partnershipMetadata from '../blocks/partnership/block.json';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';

function createDynamicEdit(label) {
    return function DynamicEdit() {
        const blockProps = useBlockProps({ className: 'observata-dynamic-block-placeholder' });
        return <div {...blockProps}>{label}</div>;
    };
}

function DynamicSave() {
    return null;
}

registerBlockType(heroMetadata.name, {
    edit: HeroEdit,
    save: HeroSave,
});

registerBlockType(cardsMetadata.name, {
    edit: CardsEdit,
    save: CardsSave,
});

registerBlockType(cardMetadata.name, {
    edit: CardEdit,
    save: CardSave,
});

registerBlockType(calloutMetadata.name, {
    edit: CalloutEdit,
    save: CalloutSave,
});

registerBlockType(introMetadata.name, {
    edit: IntroEdit,
    save: IntroSave,
});

registerBlockType(headerMetadata.name, {
    edit: createDynamicEdit('Header block'),
    save: DynamicSave,
});

registerBlockType(footerMetadata.name, {
    edit: createDynamicEdit('Footer block'),
    save: DynamicSave,
});

registerBlockType(cardsGridMetadata.name, {
    edit: createDynamicEdit('Cards Grid block'),
    save: DynamicSave,
});

registerBlockType(cardsTripleMetadata.name, {
    edit: createDynamicEdit('Cards Triple block'),
    save: DynamicSave,
});

registerBlockType(cardSwooshIconMetadata.name, {
    edit: createDynamicEdit('Card Swoosh Icon block'),
    save: DynamicSave,
});

registerBlockType(partnershipMetadata.name, {
    edit: createDynamicEdit('Partnership block'),
    save: DynamicSave,
});

registerBlockType(observabilityMetadata.name, {
    edit: createDynamicEdit('Observability block'),
    save: DynamicSave,
});
