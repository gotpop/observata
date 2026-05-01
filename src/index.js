import CalloutEdit from './callout/edit';
import CalloutSave from './callout/save';
import CardGeoEdit from './card-geo/edit';
import CardGeoListEdit from './card-geo-list/edit';
import CardGeoListSave from './card-geo-list/save';
import CardGeoSave from './card-geo/save';
import CardMicroEdit from './card-micro/edit';
import CardMicroSave from './card-micro/save';
import CardSimpleEdit from './card-simple/edit';
import CardSimpleSave from './card-simple/save';
import CardSwooshIconEdit from './card-swoosh-icon/edit';
import CardSwooshIconSave from './card-swoosh-icon/save';
import CardTechEdit from './card-tech/edit';
import CardTechSave from './card-tech/save';
import GridCardsEdit from './grid-cards/edit';
import GridCardsGeoEdit from './grid-cards-geo/edit';
import GridCardsGeoSave from './grid-cards-geo/save';
import GridCardsGraphicEdit from './grid-cards-graphic/edit';
import GridCardsGraphicSave from './grid-cards-graphic/save';
import GridCardsMicroEdit from './grid-cards-micro/edit';
import GridCardsMicroSave from './grid-cards-micro/save';
import GridCardsSave from './grid-cards/save';
import GridCardsSimpleEdit from './grid-cards-simple/edit';
import GridCardsSimpleSave from './grid-cards-simple/save';
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
import calloutMetadata from '../blocks/repeatable/callout/block.json';
import cardGeoListMetadata from '../blocks/cards/card-geo-list/block.json';
import cardGeoMetadata from '../blocks/cards/card-geo/block.json';
import cardMicroMetadata from '../blocks/cards/card-micro/block.json';
import cardSimpleMetadata from '../blocks/cards/card-simple/block.json';
import cardSwooshIconMetadata from '../blocks/cards/card-swoosh-icon/block.json';
import cardTechMetadata from '../blocks/cards/card-tech/block.json';
import footerMetadata from '../blocks/template/footer/block.json';
import gridCardsGeoMetadata from '../blocks/repeatable/grid-cards-geo/block.json';
import gridCardsGraphicMetadata from '../blocks/repeatable/grid-cards-graphic/block.json';
import gridCardsMetadata from '../blocks/repeatable/grid-cards/block.json';
import gridCardsMicroMetadata from '../blocks/repeatable/grid-cards-micro/block.json';
import gridCardsSimpleMetadata from '../blocks/repeatable/grid-cards-simple/block.json';
import headerMetadata from '../blocks/template/header/block.json';
import heroMetadata from '../blocks/hero-home/block.json';
import heroPageMetadata from '../blocks/hero-page/block.json';
import introMetadata from '../blocks/intro-home/block.json';
import introPageMetadata from '../blocks/intro-page/block.json';
import logoBarMetadata from '../blocks/logo-bar/block.json';
import observabilityMetadata from '../blocks/observability/block.json';
import partnershipMetadata from '../blocks/partnership/block.json';
import { registerBlockType } from '@wordpress/blocks';
import sectionCardAndGraphicMetadata from '../blocks/repeatable/section-card-and-graphic/block.json';
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

registerBlockType(gridCardsMetadata.name, {
    edit: GridCardsEdit,
    save: GridCardsSave,
});

registerBlockType(gridCardsSimpleMetadata.name, {
    edit: GridCardsSimpleEdit,
    save: GridCardsSimpleSave,
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

registerBlockType(gridCardsGeoMetadata.name, {
    edit: GridCardsGeoEdit,
    save: GridCardsGeoSave,
});

registerBlockType(gridCardsMicroMetadata.name, {
    edit: GridCardsMicroEdit,
    save: GridCardsMicroSave,
});

registerBlockType(gridCardsGraphicMetadata.name, {
    edit: GridCardsGraphicEdit,
    save: GridCardsGraphicSave,
});

registerBlockType(cardTechMetadata.name, {
    edit: CardTechEdit,
    save: CardTechSave,
});
