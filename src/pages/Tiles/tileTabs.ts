import { TranslationKey } from '@/translation/translation';

interface TabItem {
  id: number;
  name: TranslationKey;
}

export const TILE_TABS: TabItem[] = [
  {
    id: 0,
    name: 'tile.tabs.allTiles',
  },
  {
    id: 1,
    name: 'tile.active',
  },
  {
    id: 2,
    name: 'tile.tabs.inactiveTiles',
  },
];

export const LIST_TABS: TabItem[] = [
  {
    id: 0,
    name: 'listing.tabs.allLists',
  },
  // {
  //   id: 1,
  //   name: 'listing.active',
  // },
  {
    id: 2,
    name: 'listing.tabs.inactiveLists',
  },
];
