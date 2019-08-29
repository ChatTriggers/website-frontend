import { raw } from '.';
import { IUser } from './raw';
import { modulesStore, authStore } from '~store';

export const login = async (
  username: string,
  password: string
): Promise<IUser> => {
  try {
    const user = await raw.getCurrentAccount();
    authStore.setUser(user);

    return user;
  } catch (e) {
    // No account

    try {
      const user = await raw.login(username, password);
      authStore.setUser(user);

      return user;
    } catch (ee) {
      // TODO: Handle error
      throw ee;
    }
  }
};

// Creates the account and then logs the user in
export const createUser = async (
  username: string,
  password: string,
  email: string
): Promise<IUser> => {
  try {
    const newUser = await raw.createAccount(username, password, email);
    await raw.login(username, password);
    authStore.setUser(newUser);

    return newUser;
  } catch (e) {
    // TODO: Handle error
    throw e;
  }
};

export const logout = async () => {
  await raw.logout();
  authStore.setUser(undefined);
};

export const getModules = async () => {
  modulesStore.setModules([]);

  try {
    const response = await raw.getModules(
      modulesStore.modulesPerPage,
      modulesStore.offset,
      (modulesStore.onlyUserModules && authStore.user && authStore.user.id) || undefined,
      modulesStore.onlyTrusted,
      modulesStore.onlyFlagged,
      undefined, // TODO:
      modulesStore.search
    );

    modulesStore.setError(false)
      .setModules(response.modules)
      .setMeta(response.meta);
  } catch (e) {
    console.error(e);
    modulesStore.setError(true);
  }
};

export const getCurrentAccount = async () => {
  try {
    authStore.setUser(await raw.getCurrentAccount());
  } catch (_) {
    authStore.setUser(undefined);
  }
};

export const loadTags = async () => {
  // TODO: Handle error
  modulesStore.setAllowedTags(await raw.getTags());
};

export const deleteModule = async (moduleId: number) => {
  await raw.deleteModule(moduleId);
  await getModules();
}

export const createModule = raw.createModule;
export const createRelease = raw.createRelease;
