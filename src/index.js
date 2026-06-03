import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import cardContactDetailsMetadata from '../blocks/card-contact-details/block.json';
import cardContactFormMetadata from '../blocks/card-contact-form/block.json';
import cardGeoListMetadata from '../blocks/card-geo-list/block.json';
import cardGeoShaderMetadata from '../blocks/card-geo-shader/block.json';
import cardGeoTechMetadata from '../blocks/card-geo-tech/block.json';
import cardGeoMetadata from '../blocks/card-geo/block.json';
import cardImageUnsplashMetadata from '../blocks/card-image-unsplash/block.json';
import cardMicroMetadata from '../blocks/card-micro/block.json';
import cardPhotoMetadata from '../blocks/card-photo/block.json';
import planMetadata from '../blocks/card-pricing-plan/block.json';
import cardSimpleMetadata from '../blocks/card-simple/block.json';
import cardTableSimpleMetadata from '../blocks/card-table-simple/block.json';
import cardTextIntroMetadata from '../blocks/card-text-intro/block.json';
import cardTextSimpleMetadata from '../blocks/card-text-simple/block.json';
import bodyMdMetadata from '../blocks/element-body-md/block.json';
import bodySmMetadata from '../blocks/element-body-sm/block.json';
import elementListSimpleItemMetadata from '../blocks/element-list-simple-item/block.json';
import elementListSimpleMetadata from '../blocks/element-list-simple/block.json';
import elementTableSimpleRowMetadata from '../blocks/element-table-simple-row/block.json';
import gridCardsGeoTechMetadata from '../blocks/grid-cards-geo-tech/block.json';
import gridCardsGeoMetadata from '../blocks/grid-cards-geo/block.json';
import gridCardsGraphicMetadata from '../blocks/grid-cards-graphic/block.json';
import gridCardsMicroMetadata from '../blocks/grid-cards-micro/block.json';
import gridCardsPhotoMetadata from '../blocks/grid-cards-photo/block.json';
import gridCardsShaderMetadata from '../blocks/grid-cards-shader/block.json';
import gridCardsSimpleMetadata from '../blocks/grid-cards-simple/block.json';
import gridFlexibleContentMetadata from '../blocks/grid-flexible-content/block.json';
import heroPageMetadata from '../blocks/hero-page/block.json';
import introMetadata from '../blocks/intro-home/block.json';
import introPageMetadata from '../blocks/intro-page/block.json';
import planFeaturesRowMetadata from '../blocks/plan-features-row/block.json';
import planFeaturesTableMetadata from '../blocks/plan-features-table/block.json';
import pricingTabsMetadata from '../blocks/pricing-tabs/block.json';
import blogPaginationMetadata from '../blocks/section-blog-pagination/block.json';
import blogPostsMetadata from '../blocks/section-blog-posts/block.json';
import sectionCardAndGraphicMetadata from '../blocks/section-card-and-graphic/block.json';
import contactMetadata from '../blocks/section-contact/block.json';
import sectionCtaMetadata from '../blocks/section-cta/block.json';
import sectionGraphicCardSimpleTextMetadata from '../blocks/section-graphic-card-simple-text/block.json';
import sectionHeroBlogMetadata from '../blocks/section-hero-blog/block.json';
import sectionHeroHomeMetadata from '../blocks/section-hero-home/block.json';
import sectionHeroPageMetadata from '../blocks/section-hero-page/block.json';
import sectionIntroHomeMetadata from '../blocks/section-intro-home/block.json';
import sectionIntroPageMetadata from '../blocks/section-intro-page/block.json';
import observabilityMetadata from '../blocks/section-observability/block.json';
import sectionPartnershipMetadata from '../blocks/section-partnership/block.json';
import sectionTrustBarMetadata from '../blocks/section-trust-bar/block.json';
import breadcrumbsMetadata from '../blocks/template/breadcrumbs/block.json';
import footerMetadata from '../blocks/template/footer/block.json';
import headerMetadata from '../blocks/template/header/block.json';
import sectionIntroMetadata from '../blocks/template/section-intro/block.json';
import BreadcrumbsEdit from './breadcrumbs/edit';
import BreadcrumbsSave from './breadcrumbs/save';
import CardContactDetailsEdit from './card-contact-details/edit';
import CardContactDetailsSave from './card-contact-details/save';
import CardContactFormEdit from './card-contact-form/edit';
import CardContactFormSave from './card-contact-form/save';
import CardGeoListEdit from './card-geo-list/edit';
import CardGeoListSave from './card-geo-list/save';
import CardGeoShaderEdit from './card-geo-shader/edit';
import CardGeoShaderSave from './card-geo-shader/save';
import CardGeoTechEdit from './card-geo-tech/edit';
import CardGeoTechSave from './card-geo-tech/save';
import CardGeoEdit from './card-geo/edit';
import CardGeoSave from './card-geo/save';
import CardImageUnsplashEdit from './card-image-unsplash/edit';
import CardImageUnsplashSave from './card-image-unsplash/save';
import CardMicroEdit from './card-micro/edit';
import CardMicroSave from './card-micro/save';
import CardPhotoEdit from './card-photo/edit';
import CardPhotoSave from './card-photo/save';
import PlanEdit from './card-pricing-plan/edit';
import PlanSave from './card-pricing-plan/save';
import CardSimpleEdit from './card-simple/edit';
import CardSimpleSave from './card-simple/save';
import CardTableSimpleEdit from './card-table-simple/edit';
import CardTableSimpleSave from './card-table-simple/save';
import CardTextIntroEdit from './card-text-intro/edit';
import CardTextIntroSave from './card-text-intro/save';
import CardTextSimpleEdit from './card-text-simple/edit';
import CardTextSimpleSave from './card-text-simple/save';
import BodyMdEdit from './element-body-md/edit';
import BodyMdSave from './element-body-md/save';
import BodySmEdit from './element-body-sm/edit';
import BodySmSave from './element-body-sm/save';
import ElementListSimpleItemEdit from './element-list-simple-item/edit';
import ElementListSimpleItemSave from './element-list-simple-item/save';
import ElementListSimpleEdit from './element-list-simple/edit';
import ElementListSimpleSave from './element-list-simple/save';
import ElementTableSimpleRowEdit from './element-table-simple-row/edit';
import ElementTableSimpleRowSave from './element-table-simple-row/save';
import GridCardsGeoTechEdit from './grid-cards-geo-tech/edit';
import GridCardsGeoTechSave from './grid-cards-geo-tech/save';
import GridCardsGeoEdit from './grid-cards-geo/edit';
import GridCardsGeoSave from './grid-cards-geo/save';
import GridCardsGraphicEdit from './grid-cards-graphic/edit';
import GridCardsGraphicSave from './grid-cards-graphic/save';
import GridCardsMicroEdit from './grid-cards-micro/edit';
import GridCardsMicroSave from './grid-cards-micro/save';
import GridCardsPhotoEdit from './grid-cards-photo/edit';
import GridCardsPhotoSave from './grid-cards-photo/save';
import GridCardsShaderEdit from './grid-cards-shader/edit';
import GridCardsShaderSave from './grid-cards-shader/save';
import GridCardsSimpleEdit from './grid-cards-simple/edit';
import GridCardsSimpleSave from './grid-cards-simple/save';
import GridFlexibleContentEdit from './grid-flexible-content/edit';
import GridFlexibleContentSave from './grid-flexible-content/save';
import HeroPageEdit from './hero-page/edit';
import HeroPageSave from './hero-page/save';
import IntroEdit from './intro-home/edit';
import IntroSave from './intro-home/save';
import IntroPageEdit from './intro-page/edit';
import IntroPageSave from './intro-page/save';
import PlanFeaturesRowEdit from './plan-features-row/edit';
import PlanFeaturesRowSave from './plan-features-row/save';
import PlanFeaturesTableEdit from './plan-features-table/edit';
import PlanFeaturesTableSave from './plan-features-table/save';
import PricingTabsEdit from './pricing-tabs/edit';
import PricingTabsSave from './pricing-tabs/save';
import BlogPaginationEdit from './section-blog-pagination/edit';
import BlogPaginationSave from './section-blog-pagination/save';
import BlogPostsEdit from './section-blog-posts/edit';
import BlogPostsSave from './section-blog-posts/save';
import SectionCardAndGraphicEdit from './section-card-and-graphic/edit';
import SectionCardAndGraphicSave from './section-card-and-graphic/save';
import ContactEdit from './section-contact/edit';
import ContactSave from './section-contact/save';
import SectionCtaEdit from './section-cta/edit';
import SectionCtaSave from './section-cta/save';
import SectionGraphicCardSimpleTextEdit from './section-graphic-card-simple-text/edit';
import SectionGraphicCardSimpleTextSave from './section-graphic-card-simple-text/save';
import SectionHeroBlogEdit from './section-hero-blog/edit';
import SectionHeroBlogSave from './section-hero-blog/save';
import SectionHeroHomeEdit from './section-hero-home/edit';
import SectionHeroHomeSave from './section-hero-home/save';
import SectionHeroPageEdit from './section-hero-page/edit';
import SectionHeroPageSave from './section-hero-page/save';
import SectionIntroHomeEdit from './section-intro-home/edit';
import SectionIntroHomeSave from './section-intro-home/save';
import SectionIntroPageEdit from './section-intro-page/edit';
import SectionIntroPageSave from './section-intro-page/save';
import SectionIntroEdit from './section-intro/edit';
import SectionIntroSave from './section-intro/save';
import ObservabilityEdit from './section-observability/edit';
import ObservabilitySave from './section-observability/save';
import SectionPartnershipEdit from './section-partnership/edit';
import SectionPartnershipSave from './section-partnership/save';
import SectionTrustBarEdit from './section-trust-bar/edit';
import SectionTrustBarSave from './section-trust-bar/save';

function createDynamicEdit(label) {
    return function DynamicEdit() {
        const blockProps = useBlockProps({ className: 'observata-dynamic-block-placeholder' });
        return <div {...blockProps}>{label}</div>;
    };
}

function DynamicSave() {
    return null;
}

registerBlockType(sectionHeroHomeMetadata.name, {
    edit: SectionHeroHomeEdit,
    save: SectionHeroHomeSave,
});

registerBlockType(sectionHeroPageMetadata.name, {
    edit: SectionHeroPageEdit,
    save: SectionHeroPageSave,
});

registerBlockType(sectionCtaMetadata.name, {
    edit: SectionCtaEdit,
    save: SectionCtaSave,
});

registerBlockType(introMetadata.name, {
    edit: IntroEdit,
    save: IntroSave,
});

registerBlockType(sectionIntroHomeMetadata.name, {
    edit: SectionIntroHomeEdit,
    save: SectionIntroHomeSave,
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

registerBlockType(cardPhotoMetadata.name, {
    edit: CardPhotoEdit,
    save: CardPhotoSave,
});

registerBlockType(cardImageUnsplashMetadata.name, {
    edit: CardImageUnsplashEdit,
    save: CardImageUnsplashSave,
});

registerBlockType(headerMetadata.name, {
    edit: createDynamicEdit('Header block'),
    save: DynamicSave,
});

registerBlockType(footerMetadata.name, {
    edit: createDynamicEdit('Footer block'),
    save: DynamicSave,
});

registerBlockType(gridCardsShaderMetadata.name, {
    edit: GridCardsShaderEdit,
    save: GridCardsShaderSave,
});

registerBlockType(gridCardsSimpleMetadata.name, {
    edit: GridCardsSimpleEdit,
    save: GridCardsSimpleSave,
});

registerBlockType(cardGeoShaderMetadata.name, {
    edit: CardGeoShaderEdit,
    save: CardGeoShaderSave,
});

registerBlockType(sectionPartnershipMetadata.name, {
    edit: SectionPartnershipEdit,
    save: SectionPartnershipSave,
});

registerBlockType(cardSimpleMetadata.name, {
    edit: CardSimpleEdit,
    save: CardSimpleSave,
});

registerBlockType(observabilityMetadata.name, {
    edit: ObservabilityEdit,
    save: ObservabilitySave,
});

registerBlockType(blogPaginationMetadata.name, {
    edit: BlogPaginationEdit,
    save: BlogPaginationSave,
});

registerBlockType(sectionTrustBarMetadata.name, {
    edit: SectionTrustBarEdit,
    save: SectionTrustBarSave,
});

registerBlockType(sectionCardAndGraphicMetadata.name, {
    edit: SectionCardAndGraphicEdit,
    save: SectionCardAndGraphicSave,
});

registerBlockType(sectionHeroBlogMetadata.name, {
    edit: SectionHeroBlogEdit,
    save: SectionHeroBlogSave,
});

registerBlockType(heroPageMetadata.name, {
    edit: HeroPageEdit,
    save: HeroPageSave,
});

registerBlockType(introPageMetadata.name, {
    edit: IntroPageEdit,
    save: IntroPageSave,
});

registerBlockType(sectionIntroPageMetadata.name, {
    edit: SectionIntroPageEdit,
    save: SectionIntroPageSave,
});

registerBlockType(gridCardsGeoMetadata.name, {
    edit: GridCardsGeoEdit,
    save: GridCardsGeoSave,
});

registerBlockType(gridCardsMicroMetadata.name, {
    edit: GridCardsMicroEdit,
    save: GridCardsMicroSave,
});

registerBlockType(gridCardsPhotoMetadata.name, {
    edit: GridCardsPhotoEdit,
    save: GridCardsPhotoSave,
});

registerBlockType(gridCardsGraphicMetadata.name, {
    edit: GridCardsGraphicEdit,
    save: GridCardsGraphicSave,
});

registerBlockType(cardGeoTechMetadata.name, {
    edit: CardGeoTechEdit,
    save: CardGeoTechSave,
});

registerBlockType(gridCardsGeoTechMetadata.name, {
    edit: GridCardsGeoTechEdit,
    save: GridCardsGeoTechSave,
});

registerBlockType(planMetadata.name, {
    edit: PlanEdit,
    save: PlanSave,
});

registerBlockType(pricingTabsMetadata.name, {
    edit: PricingTabsEdit,
    save: PricingTabsSave,
});

registerBlockType(planFeaturesTableMetadata.name, {
    edit: PlanFeaturesTableEdit,
    save: PlanFeaturesTableSave,
});

registerBlockType(planFeaturesRowMetadata.name, {
    edit: PlanFeaturesRowEdit,
    save: PlanFeaturesRowSave,
});





registerBlockType(cardTableSimpleMetadata.name, {
    edit: CardTableSimpleEdit,
    save: CardTableSimpleSave,
});



registerBlockType(elementTableSimpleRowMetadata.name, {
    edit: ElementTableSimpleRowEdit,
    save: ElementTableSimpleRowSave,
});

registerBlockType(elementListSimpleMetadata.name, {
    edit: ElementListSimpleEdit,
    save: ElementListSimpleSave,
});

registerBlockType(elementListSimpleItemMetadata.name, {
    edit: ElementListSimpleItemEdit,
    save: ElementListSimpleItemSave,
});

registerBlockType(sectionIntroMetadata.name, {
    edit: SectionIntroEdit,
    save: SectionIntroSave,
});

registerBlockType(contactMetadata.name, {
    edit: ContactEdit,
    save: ContactSave,
});

registerBlockType(cardContactDetailsMetadata.name, {
    edit: CardContactDetailsEdit,
    save: CardContactDetailsSave,
});

registerBlockType(cardContactFormMetadata.name, {
    edit: CardContactFormEdit,
    save: CardContactFormSave,
});

registerBlockType(blogPostsMetadata.name, {
    edit: BlogPostsEdit,
    save: BlogPostsSave,
});

registerBlockType(cardTextSimpleMetadata.name, {
    edit: CardTextSimpleEdit,
    save: CardTextSimpleSave,
});

registerBlockType(cardTextIntroMetadata.name, {
    edit: CardTextIntroEdit,
    save: CardTextIntroSave,
});


registerBlockType(bodyMdMetadata.name, {
    edit: BodyMdEdit,
    save: BodyMdSave,
});

registerBlockType(bodySmMetadata.name, {
    edit: BodySmEdit,
    save: BodySmSave,
});

registerBlockType(gridFlexibleContentMetadata.name, {
    edit: GridFlexibleContentEdit,
    save: GridFlexibleContentSave,
});

registerBlockType(breadcrumbsMetadata.name, {
    edit: BreadcrumbsEdit,
    save: BreadcrumbsSave,
});

registerBlockType(sectionGraphicCardSimpleTextMetadata.name, {
    edit: SectionGraphicCardSimpleTextEdit,
    save: SectionGraphicCardSimpleTextSave,
});
