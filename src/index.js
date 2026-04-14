import CalloutEdit from './callout/edit';
import CalloutSave from './callout/save';
import CardEdit from './card/edit';
import CardSave from './card/save';
import CardsEdit from './cards/edit';
import CardsSave from './cards/save';
import HeroEdit from './hero/edit';
import HeroSave from './hero/save';
import calloutMetadata from '../blocks/callout/block.json';
import cardMetadata from '../blocks/card/block.json';
import cardsMetadata from '../blocks/cards/block.json';
import heroMetadata from '../blocks/hero/block.json';
import { registerBlockType } from '@wordpress/blocks';

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
