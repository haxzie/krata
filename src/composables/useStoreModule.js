import { useStore } from "vuex";

function isModuleNamespaced(moduleName, store) {
  return Boolean(store._modulesNamespaceMap[`${moduleName}/`]);
}

/**
 * We have to wrap the getters in a Proxy because we only want to
 * "access" the getter if it actually being accessed.
 *
 * We could technically use the getFromStoreByType function but
 * the getter would be invoked multiple types on store instantiation.
 *
 * This is just a little cheeky workaround. Proxy <3
 */
function wrapGettersInProxy(moduleName, getters, isNamespaced) {
  return new Proxy(getters, {
    get(_, prop) {
      if (isNamespaced) {
        return getters[`${moduleName}/${prop}`];
      }

      return getters[prop];
    },
  });
}

/**
 * This function allows us to access the internal vuex properties and
 * maps them in a way which removes the module prefix.
 */
function getFromStoreByType(moduleName, type, isNamespaced) {
  if (isNamespaced) {
    return Object.keys(type)
      .filter((t) => t.startsWith(`${moduleName}/`))
      .reduce((acc, curr) => {
        const typeName = curr.split("/").pop();
        const typeValue = type[curr][0];

        return { [typeName]: typeValue, ...acc };
      }, {});
  }

  return Object.keys(type).reduce((acc, curr) => {
    const typeValue = type[curr][0];

    return { [curr]: typeValue, ...acc };
  }, {});
}

export function useStoreModule(moduleName, storeName) {
  const store = storeName ? useStore(storeName) : useStore();
  const state = store.state[moduleName];
  const isNamespaced = isModuleNamespaced(moduleName, store);

  const actions = getFromStoreByType(moduleName, store._actions, isNamespaced);

  const mutations = getFromStoreByType(
    moduleName,
    store._mutations,
    isNamespaced
  );

  const getters = wrapGettersInProxy(moduleName, store.getters, isNamespaced);

  return {
    actions,
    mutations,
    state,
    getters,
  };
}
