import type { BuildingId } from '../../../data/buildings';
import type { BrickSet } from '../../bricks/BrickSet';
import { buildCityHall } from './cityHall';
import { buildDataCentre } from './dataCentre';
import { buildEventsGarden } from './eventsGarden';
import { buildCommunityCentre } from './communityCentre';
import { buildWelcomeSign } from './welcomeSign';
import { buildAirport } from './airport';
import { buildArcade } from './arcade';
import { buildProductStudio } from './productStudio';
import { buildCampus } from './campus';
import { buildPostOffice } from './postOffice';
import { buildConstruction } from './construction';

/** The brick model for each building, as pure data. */
export const BUILDERS: Record<BuildingId, () => BrickSet> = {
  welcome: buildWelcomeSign,
  'city-hall': buildCityHall,
  'data-centre': buildDataCentre,
  'events-garden': buildEventsGarden,
  'community-centre': buildCommunityCentre,
  airport: buildAirport,
  arcade: buildArcade,
  'product-studio': buildProductStudio,
  campus: buildCampus,
  'post-office': buildPostOffice,
  construction: buildConstruction,
};
