import { action } from 'mobx';

import { apiStore, authStore, modulesStore } from '~store';
import { IUser, IVersions } from '~types';

import * as raw from './raw';

export const login = async (username: string, password: string): Promise<IUser> => {
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

export const getModules = action(async (): Promise<void> => {
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
    // Only fails if offline
  }
});

export const getCurrentAccount = async (): Promise<void> => {
  try {
    authStore.setUser(await raw.getCurrentAccount());
  } catch (_) {
    authStore.setUser(undefined);
  }
};

export const loadTags = async (): Promise<void> => {
  apiStore.setAllowedTags(await raw.getTags());
};

export const loadCtVersions = async (): Promise<void> => {
  const rawVersions = await raw.getVersions();
  const newVersions: IVersions = [];

  Object.keys(rawVersions).forEach(version => {
    newVersions.push({
      majorMinor: version,
      patches: rawVersions[version],
    });
  });

  apiStore.setCtVersions(newVersions);
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

export const { createModule, createRelease, requestPasswordComplete, toggleTrust } = raw;
