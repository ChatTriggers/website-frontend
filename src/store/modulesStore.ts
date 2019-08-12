import { observable } from 'mobx';

interface IModule {
  name: string;
  author: string;
  tags?: string[];
  description?: string;
  url?: string;
  downloads: number;
}

interface IViewConfig {
  compact: boolean;
  modulesPerPage: number;
}

const viewConfigDefaults: IViewConfig = {
  compact: true,
  modulesPerPage: 20
};

export class ModulesStore {
  @observable 
  public modules: IModule[] = [];

  @observable
  public viewConfig: IViewConfig = viewConfigDefaults;
}

const modulesStore = new ModulesStore();

modulesStore.modules = [
  {
    name: 'RingSelector',
    author: 'Ecolsson',
    tags: ['Utility', 'Menu', 'Graphics', 'Selector'],
    description: 'A configurable ring selector menu',
    url: 'https://i.imgur.com/zCMxtHz.png',
    downloads: 141
  },
  {
    name: 'ES6Polyfills',
    author: 'Ecolsson',
    tags: ['Utility', 'ES6', 'Polyfill'],
    description: "Contains all ES6 official polyfills, such as Array.forEach and Promises.\n\nEach polyfill is in it's own file, in the format ..js. All Polyfills (except for a few) are pulled directly from the Mozilla Development Network.\n\nNOTE: The polyfills were not individually tested. If a polyfill does not work, please let me know on Discord.",
    url: 'https://i.imgur.com/1HBEpVF.jpg',
    downloads: 138
  },
  {
    name: 'pprint',
    author: 'Ecolsson',
    tags: ['Utility'],
    description: 'A simple pretty-print function',
    downloads: 37
  },
  {
    name: 'SeargeHelper',
    author: 'Ecolsson',
    tags: ['Utility', 'Library', 'Obfuscation'],
    description: 'Easily get obfuscated names of minecraft fields and methods. Works across version and in dev environments with no extra work to the module maker.',
    downloads: 20
  }
];

export default modulesStore;
