import type { ComponentType } from 'react';
import type { BuildingId } from '../../../data/buildings';
import { CityHallExtras } from './CityHall';
import { DataCentreExtras } from './DataCentre';
import { EventsGardenExtras } from './EventsGarden';
import { CommunityCentreExtras } from './CommunityCentre';
import { WelcomeSignExtras } from './WelcomeSign';
import { AirportExtras } from './Airport';
import { ArcadeExtras } from './Arcade';
import { ProductStudioExtras } from './ProductStudio';
import { CampusExtras } from './Campus';
import { PostOfficeExtras } from './PostOffice';
import { ConstructionExtras } from './Construction';

/** Anything on a building that isn't a plain brick: signs, animation, lights. */
export const EXTRAS: Partial<Record<BuildingId, ComponentType>> = {
  welcome: WelcomeSignExtras,
  'city-hall': CityHallExtras,
  'data-centre': DataCentreExtras,
  'events-garden': EventsGardenExtras,
  'community-centre': CommunityCentreExtras,
  airport: AirportExtras,
  arcade: ArcadeExtras,
  'product-studio': ProductStudioExtras,
  campus: CampusExtras,
  'post-office': PostOfficeExtras,
  construction: ConstructionExtras,
};
