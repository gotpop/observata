import CalloutEdit from './callout/edit';
import CalloutSave from './callout/save';
import CardEdit from './card/edit';
import CardGeoEdit from './card-geo/edit';
import CardGeoListEdit from './card-geo-list/edit';
import CardGeoListSave from './card-geo-list/save';
import CardGeoSave from './card-geo/save';
import CardMicroEdit from './card-micro/edit';
import CardMicroSave from './card-micro/save';
import CardSave from './card/save';
import CardSimpleEdit from './card-simple/edit';
import CardSimpleSave from './card-simple/save';
import CardSwooshIconEdit from './card-swoosh-icon/edit';
import CardSwooshIconSave from './card-swoosh-icon/save';
import CardsGridEdit from './cards-grid/edit';
import CardsGridGeoEdit from './cards-grid-geo/edit';
import CardsGridGeoSave from './cards-grid-geo/save';
import CardsGridGraphicEdit from './cards-grid-graphic/edit';
import CardsGridGraphicSave from './cards-grid-graphic/save';
import CardsGridMicroEdit from './cards-grid-micro/edit';
import CardsGridMicroSave from './cards-grid-micro/save';
import CardsGridSave from './cards-grid/save';
import CardsTripleEdit from './cards-triple/edit';
import CardsTripleSave from './cards-triple/save';
import HeroEdit from './hero/edit';
import HeroPageEdit from './hero-page/edit';
import HeroPageSave from './hero-page/save';
import HeroSave from './hero/save';
import IntroEdit from './intro/edit';
import IntroPageEdit from './intro-page/edit';
import IntroPageSave from './intro-page/save';
import IntroSave from './intro/save';
import LogoBarEdit from './logo-bar/edit';
import LogoBarSave from './logo-bar/save';
import ObservabilityEdit from './observability/edit';
import ObservabilitySave from './observability/save';
import PartnershipEdit from './partnership/edit';
import PartnershipSave from './partnership/save';
import SectionCardAndGraphicEdit from './section-card-and-graphic/edit';
import SectionCardAndGraphicSave from './section-card-and-graphic/save';
import calloutMetadata from '../blocks/callout/block.json';
import cardGeoListMetadata from '../blocks/cards/card-geo-list/block.json';
import cardGeoMetadata from '../blocks/cards/card-geo/block.json';
import cardMetadata from '../blocks/cards/card/block.json';
import cardMicroMetadata from '../blocks/cards/card-micro/block.json';
import cardSimpleMetadata from '../blocks/cards/card-simple/block.json';
import cardSwooshIconMetadata from '../blocks/cards/card-swoosh-icon/block.json';
import cardsGridGeoMetadata from '../blocks/cards-grid-geo/block.json';
import cardsGridGraphicMetadata from '../blocks/cards-grid-graphic/block.json';
import cardsGridMetadata from '../blocks/cards-grid/block.json';
import cardsGridMicroMetadata from '../blocks/cards-grid-micro/block.json';
import cardsTripleMetadata from '../blocks/cards-triple/block.json';
import footerMetadata from '../blocks/footer/block.json';
import headerMetadata from '../blocks/header/block.json';
import heroMetadata from '../blocks/hero/block.json';
import heroPageMetadata from '../blocks/hero-page/block.json';
import introMetadata from '../blocks/intro/block.json';
import introPageMetadata from '../blocks/intro-page/block.json';
import logoBarMetadata from '../blocks/logo-bar/block.json';
import observabilityMetadata from '../blocks/observability/block.json';
import partnershipMetadata from '../blocks/partnership/block.json';
import { registerBlockType } from '@wordpress/blocks';
import sectionCardAndGraphicMetadata from '../blocks/section-card-and-graphic/block.json';
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

registerBlockType(cardGeoListMetadata.name, {
    edit: CardGeoListEdit,
    save: CardGeoListSave,
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
    edit: CardsTripleEdit,
    save: CardsTripleSave,
});

registerBlockType(cardSwooshIconMetadata.name, {
    edit: CardSwooshIconEdit,
    save: CardSwooshIconSave,
});

registerBlockType(partnershipMetadata.name, {
    edit: PartnershipEdit,
    save: PartnershipSave,
});

registerBlockType(cardSimpleMetadata.name, {
    edit: CardSimpleEdit,
    save: CardSimpleSave,
});

registerBlockType(observabilityMetadata.name, {
    edit: ObservabilityEdit,
    save: ObservabilitySave,
});

registerBlockType(logoBarMetadata.name, {
    edit: LogoBarEdit,
    save: LogoBarSave,
});

registerBlockType(sectionCardAndGraphicMetadata.name, {
    edit: SectionCardAndGraphicEdit,
    save: SectionCardAndGraphicSave,
});

registerBlockType(heroPageMetadata.name, {
    edit: HeroPageEdit,
    save: HeroPageSave,
});

registerBlockType(introPageMetadata.name, {
    edit: IntroPageEdit,
    save: IntroPageSave,
});

registerBlockType(cardsGridGeoMetadata.name, {
    edit: CardsGridGeoEdit,
    save: CardsGridGeoSave,
});

registerBlockType(cardsGridMicroMetadata.name, {
    edit: CardsGridMicroEdit,
    save: CardsGridMicroSave,
});

registerBlockType(cardsGridGraphicMetadata.name, {
    edit: CardsGridGraphicEdit,
    save: CardsGridGraphicSave,
});
