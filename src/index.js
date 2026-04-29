import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import calloutMetadata from '../blocks/callout/block.json';
import cardGeoMetadata from '../blocks/card-geo/block.json';
import cardMicroMetadata from '../blocks/card-micro/block.json';
import cardSwooshIconMetadata from '../blocks/card-swoosh-icon/block.json';
import cardMetadata from '../blocks/card/block.json';
import cardsGridMetadata from '../blocks/cards-grid/block.json';
import cardsTripleMetadata from '../blocks/cards-triple/block.json';
import cardsMetadata from '../blocks/cards/block.json';
import footerMetadata from '../blocks/footer/block.json';
import headerMetadata from '../blocks/header/block.json';
import heroMetadata from '../blocks/hero/block.json';
import introMetadata from '../blocks/intro/block.json';
import observabilityMetadata from '../blocks/observability/block.json';
import partnershipMetadata from '../blocks/partnership/block.json';
import CalloutEdit from './callout/edit';
import CalloutSave from './callout/save';
import CardGeoEdit from './card-geo/edit';
import CardGeoSave from './card-geo/save';
import CardMicroEdit from './card-micro/edit';
import CardMicroSave from './card-micro/save';
import CardSwooshIconEdit from './card-swoosh-icon/edit';
import CardSwooshIconSave from './card-swoosh-icon/save';
import CardEdit from './card/edit';
import CardSave from './card/save';
import CardsGridEdit from './cards-grid/edit';
import CardsGridSave from './cards-grid/save';
import CardsEdit from './cards/edit';
import CardsSave from './cards/save';
import HeroEdit from './hero/edit';
import HeroSave from './hero/save';
import IntroEdit from './intro/edit';
import IntroSave from './intro/save';
import ObservabilityEdit from './observability/edit';
import ObservabilitySave from './observability/save';

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

registerBlockType(cardGeoMetadata.name, {
    edit: CardGeoEdit,
    save: CardGeoSave,
});

registerBlockType(cardMicroMetadata.name, {
    edit: CardMicroEdit,
    save: CardMicroSave,
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
    edit: CardsGridEdit,
    save: CardsGridSave,
});

registerBlockType(cardsTripleMetadata.name, {
    edit: createDynamicEdit('Cards Triple block'),
    save: DynamicSave,
});

registerBlockType(cardSwooshIconMetadata.name, {
    edit: CardSwooshIconEdit,
    save: CardSwooshIconSave,
});

registerBlockType(partnershipMetadata.name, {
    edit: createDynamicEdit('Partnership block'),
    save: DynamicSave,
});

registerBlockType(observabilityMetadata.name, {
    edit: ObservabilityEdit,
    save: ObservabilitySave,
});