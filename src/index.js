import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import cardGeoListMetadata from '../blocks/cards/card-geo-list/block.json';
import cardGeoShaderMetadata from '../blocks/cards/card-geo-shader/block.json';
import cardGeoTechMetadata from '../blocks/cards/card-geo-tech/block.json';
import cardGeoMetadata from '../blocks/cards/card-geo/block.json';
import cardMicroMetadata from '../blocks/cards/card-micro/block.json';
import planMetadata from '../blocks/cards/card-pricing-plan/block.json';
import CardRichTextMetadata from '../blocks/cards/card-rich-text/block.json';
import cardSimpleMetadata from '../blocks/cards/card-simple/block.json';
import cardTeamMemberMetadata from '../blocks/cards/card-team-member/block.json';
import cardTextSimpleMetadata from '../blocks/cards/card-text-simple/block.json';
import planFeaturesRowMetadata from '../blocks/cards/plan-features-row/block.json';
import contactDetailsMetadata from '../blocks/contact-details/block.json';
import contactFormMetadata from '../blocks/contact-form/block.json';
import contactMetadata from '../blocks/contact/block.json';
import heroMetadata from '../blocks/hero-home/block.json';
import heroBlogMetadata from '../blocks/hero-blog/block.json';
import heroPageMetadata from '../blocks/hero-page/block.json';
import introMetadata from '../blocks/intro-home/block.json';
import introPageMetadata from '../blocks/intro-page/block.json';
import logoBarMetadata from '../blocks/logo-bar/block.json';
import observabilityMetadata from '../blocks/observability/block.json';
import partnershipMetadata from '../blocks/partnership/block.json';
import richTextMetadata from '../blocks/rich-text/block.json';
import blogPostsMetadata from '../blocks/repeatable/blog-posts/block.json';
import calloutMetadata from '../blocks/repeatable/callout/block.json';
import gridCardsGeoTechMetadata from '../blocks/repeatable/grid-cards-geo-tech/block.json';
import gridCardsGeoMetadata from '../blocks/repeatable/grid-cards-geo/block.json';
import gridCardsGraphicMetadata from '../blocks/repeatable/grid-cards-graphic/block.json';
import gridCardsMicroMetadata from '../blocks/repeatable/grid-cards-micro/block.json';
import gridCardsRichTextMetadata from '../blocks/repeatable/grid-cards-rich-text/block.json';
import gridCardsShaderMetadata from '../blocks/repeatable/grid-cards-shader/block.json';
import gridCardsSimpleMetadata from '../blocks/repeatable/grid-cards-simple/block.json';
import gridCardsTextMetadata from '../blocks/repeatable/grid-cards-text/block.json';
import planFeaturesTableMetadata from '../blocks/repeatable/plan-features-table/block.json';
import plansMetadata from '../blocks/repeatable/pricing-plans/block.json';
import pricingTabsMetadata from '../blocks/repeatable/pricing-tabs/block.json';
import sectionCardAndGraphicMetadata from '../blocks/repeatable/section-card-and-graphic/block.json';
import teamMembersMetadata from '../blocks/repeatable/team-members/block.json';
import footerMetadata from '../blocks/template/footer/block.json';
import headerMetadata from '../blocks/template/header/block.json';
import sectionIntroMetadata from '../blocks/template/section-intro/block.json';
import BlogPostsEdit from './blog-posts/edit';
import BlogPostsSave from './blog-posts/save';
import CalloutEdit from './callout/edit';
import CalloutSave from './callout/save';
import CardGeoListEdit from './card-geo-list/edit';
import CardGeoListSave from './card-geo-list/save';
import CardGeoShaderEdit from './card-geo-shader/edit';
import CardGeoShaderSave from './card-geo-shader/save';
import CardGeoTechEdit from './card-geo-tech/edit';
import CardGeoTechSave from './card-geo-tech/save';
import CardGeoEdit from './card-geo/edit';
import CardGeoSave from './card-geo/save';
import CardMicroEdit from './card-micro/edit';
import CardMicroSave from './card-micro/save';
import PlanEdit from './card-pricing-plan/edit';
import PlanSave from './card-pricing-plan/save';
import CardRichTextEdit from './card-rich-text/edit';
import CardRichTextSave from './card-rich-text/save';
import CardSimpleEdit from './card-simple/edit';
import CardSimpleSave from './card-simple/save';
import CardTeamMemberEdit from './card-team-member/edit';
import CardTeamMemberSave from './card-team-member/save';
import CardTextSimpleEdit from './card-text-simple/edit';
import CardTextSimpleSave from './card-text-simple/save';
import ContactDetailsEdit from './contact-details/edit';
import ContactDetailsSave from './contact-details/save';
import ContactFormEdit from './contact-form/edit';
import ContactFormSave from './contact-form/save';
import ContactEdit from './contact/edit';
import ContactSave from './contact/save';
import GridCardsGeoTechEdit from './grid-cards-geo-tech/edit';
import GridCardsGeoTechSave from './grid-cards-geo-tech/save';
import GridCardsGeoEdit from './grid-cards-geo/edit';
import GridCardsGeoSave from './grid-cards-geo/save';
import GridCardsGraphicEdit from './grid-cards-graphic/edit';
import GridCardsGraphicSave from './grid-cards-graphic/save';
import GridCardsMicroEdit from './grid-cards-micro/edit';
import GridCardsMicroSave from './grid-cards-micro/save';
import GridCardsRichTextEdit from './grid-cards-rich-text/edit';
import GridCardsRichTextSave from './grid-cards-rich-text/save';
import GridCardsShaderEdit from './grid-cards-shader/edit';
import GridCardsShaderSave from './grid-cards-shader/save';
import GridCardsSimpleEdit from './grid-cards-simple/edit';
import GridCardsSimpleSave from './grid-cards-simple/save';
import GridCardsTextEdit from './grid-cards-text/edit';
import GridCardsTextSave from './grid-cards-text/save';
import HeroBlogEdit from './hero-blog/edit';
import HeroBlogSave from './hero-blog/save';
import HeroPageEdit from './hero-page/edit';
import HeroPageSave from './hero-page/save';
import HeroEdit from './hero/edit';
import HeroSave from './hero/save';
import IntroPageEdit from './intro-page/edit';
import IntroPageSave from './intro-page/save';
import IntroEdit from './intro/edit';
import IntroSave from './intro/save';
import LogoBarEdit from './logo-bar/edit';
import LogoBarSave from './logo-bar/save';
import ObservabilityEdit from './observability/edit';
import ObservabilitySave from './observability/save';
import PartnershipEdit from './partnership/edit';
import PartnershipSave from './partnership/save';
import PlanFeaturesRowEdit from './plan-features-row/edit';
import PlanFeaturesRowSave from './plan-features-row/save';
import PlanFeaturesTableEdit from './plan-features-table/edit';
import PlanFeaturesTableSave from './plan-features-table/save';
import PlansEdit from './pricing-plans/edit';
import PlansSave from './pricing-plans/save';
import PricingTabsEdit from './pricing-tabs/edit';
import PricingTabsSave from './pricing-tabs/save';
import RichTextEdit from './rich-text/edit';
import RichTextSave from './rich-text/save';
import SectionCardAndGraphicEdit from './section-card-and-graphic/edit';
import SectionCardAndGraphicSave from './section-card-and-graphic/save';
import SectionIntroEdit from './section-intro/edit';
import SectionIntroSave from './section-intro/save';
import TeamMembersEdit from './team-members/edit';
import TeamMembersSave from './team-members/save';

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

registerBlockType(heroBlogMetadata.name, {
    edit: HeroBlogEdit,
    save: HeroBlogSave,
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

registerBlockType(plansMetadata.name, {
    edit: PlansEdit,
    save: PlansSave,
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

registerBlockType(gridCardsRichTextMetadata.name, {
    edit: GridCardsRichTextEdit,
    save: GridCardsRichTextSave,
});

registerBlockType(CardRichTextMetadata.name, {
    edit: CardRichTextEdit,
    save: CardRichTextSave,
});

registerBlockType(teamMembersMetadata.name, {
    edit: TeamMembersEdit,
    save: TeamMembersSave,
});

registerBlockType(cardTeamMemberMetadata.name, {
    edit: CardTeamMemberEdit,
    save: CardTeamMemberSave,
});

registerBlockType(sectionIntroMetadata.name, {
    edit: SectionIntroEdit,
    save: SectionIntroSave,
});

registerBlockType(contactMetadata.name, {
    edit: ContactEdit,
    save: ContactSave,
});

registerBlockType(contactDetailsMetadata.name, {
    edit: ContactDetailsEdit,
    save: ContactDetailsSave,
});

registerBlockType(contactFormMetadata.name, {
    edit: ContactFormEdit,
    save: ContactFormSave,
});

registerBlockType(blogPostsMetadata.name, {
    edit: BlogPostsEdit,
    save: BlogPostsSave,
});

registerBlockType(richTextMetadata.name, {
    edit: RichTextEdit,
    save: RichTextSave,
});

registerBlockType(cardTextSimpleMetadata.name, {
    edit: CardTextSimpleEdit,
    save: CardTextSimpleSave,
});

registerBlockType(gridCardsTextMetadata.name, {
    edit: GridCardsTextEdit,
    save: GridCardsTextSave,
});
