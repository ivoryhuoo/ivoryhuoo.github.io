import type { ComponentType } from 'react';
import type { BuildingId } from '../../data/buildings';
import { WelcomePanel } from './WelcomePanel';
import { CityHallPanel } from './CityHallPanel';
import { DataCentrePanel } from './DataCentrePanel';
import { EventsGardenPanel } from './EventsGardenPanel';
import { CommunityCentrePanel } from './CommunityCentrePanel';
import { AirportPanel } from './AirportPanel';
import { ArcadePanel } from './ArcadePanel';
import { ProductStudioPanel } from './ProductStudioPanel';
import { CampusPanel } from './CampusPanel';
import { PostOfficePanel } from './PostOfficePanel';
import { ConstructionPanel } from './ConstructionPanel';

/** Which panel opens for each building. Add an entry when a building opens. */
export const PANELS: Partial<Record<BuildingId, ComponentType>> = {
  welcome: WelcomePanel,
  'city-hall': CityHallPanel,
  'data-centre': DataCentrePanel,
  'events-garden': EventsGardenPanel,
  'community-centre': CommunityCentrePanel,
  airport: AirportPanel,
  arcade: ArcadePanel,
  'product-studio': ProductStudioPanel,
  campus: CampusPanel,
  'post-office': PostOfficePanel,
  construction: ConstructionPanel,
};
