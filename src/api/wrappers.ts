import * as raw from './raw';
import { IUser } from '~types';
import { modulesStore, authStore } from '~store';

export const login = async (
  username: string,
  password: string,
): Promise<IUser> => {
  try {
    const user = await raw.getCurrentAccount();
    authStore.setUser(user);

    return user;
  } catch (e) {
    // No account

    const user = await raw.login(username, password);
    authStore.setUser(user);

    return user;
    // TODO: Handle error
  }
};

// Creates the account and then logs the user in
export const createUser = async (
  username: string,
  password: string,
  email: string,
): Promise<IUser> => {
  const newUser = await raw.createAccount(username, password, email);
  await raw.login(username, password);
  authStore.setUser(newUser);

  return newUser;
  // TODO: Handle error
};

export const logout = async (): Promise<void> => {
  await raw.logout();
  authStore.setUser(undefined);
};

export const getModules = async (): Promise<void> => {
  modulesStore.setModules([]);

  let searchTags: string | undefined;
  let search: string | undefined;

  if (modulesStore.search) {
    const matches = modulesStore.search.match(/tag:\w+ /g) || [];
    searchTags = matches.map(match => match.replace('tag:', '').trim()).join(',');
    search = matches.reduce((prev, curr) => prev.replace(curr, ''), modulesStore.search).trim();
  } else {
    search = modulesStore.search;
  }

  try {
    const response = await raw.getModules(
      modulesStore.modulesPerPage,
      modulesStore.offset,
      (modulesStore.searchFilter === 'user' && authStore.user && authStore.user.id) || undefined,
      modulesStore.searchFilter === 'trusted',
      modulesStore.searchFilter === 'flagged',
      searchTags,
      search,
      modulesStore.moduleSorting,
    );

    modulesStore.setError(false)
      .setModules(response.modules)
      .setMeta(response.meta);
  } catch (e) {
    modulesStore.setError(true);
  }
};

export const getCurrentAccount = async (): Promise<void> => {
  try {
    authStore.setUser(await raw.getCurrentAccount());
  } catch (_) {
    authStore.setUser(undefined);
  }
};

export const loadTags = async (): Promise<void> => {
  // TODO: Handle error
  modulesStore.setAllowedTags(await raw.getTags());
};

export const deleteModule = async (moduleId: number): Promise<void> => {
  await raw.deleteModule(moduleId);
  await getModules();
};

export const updateModule = async (
  moduleId: number,
  description?: string,
  image?: string,
  flagged?: boolean,
  tags?: string[],
): Promise<void> => {
  await raw.updateModule(moduleId, description, image, flagged, tags);
  await getModules();
};

export const {
  createModule, createRelease, requestPasswordComplete, toggleTrust,
} = raw;
