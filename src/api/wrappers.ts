import * as raw from './raw';
import { IUser } from '~types';
import { modulesStore, authStore, apiStore } from '~store';

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
};

export const logout = async (): Promise<void> => {
  await raw.logout();
  authStore.setUser(undefined);
};

export const getModules = async (): Promise<void> => {
  modulesStore.setModules([]);

  try {
    const response = await raw.getModules(
      apiStore.modulesPerPage,
      apiStore.offset,
      (apiStore.filter === 'user' && authStore.user && authStore.user.id) || undefined,
      apiStore.filter === 'trusted',
      apiStore.filter === 'flagged',
      apiStore.tags.join(','),
      apiStore.search,
      apiStore.sorting,
    );

    modulesStore.setModules(response.modules);
    apiStore.setMeta(response.meta);
  } catch (e) {
    // Only way this fails is if the user isn't connected to the internet,
    // in which case the react-detect-offline package will switch to an
    // offline page
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
  // Only way this fails is if the user isn't connected to the internet,
  // in which case the react-detect-offline package will switch to an
  // offline page
  apiStore.setAllowedTags(await raw.getTags());
};

export const loadCtVersions = async (): Promise<void> => {
  apiStore.setCtVersions(await raw.getVersions());
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
  await raw.updateModule(moduleId, description, image || undefined, flagged, tags);
  await getModules();
};

export const {
  createModule, createRelease, requestPasswordComplete, toggleTrust,
} = raw;
