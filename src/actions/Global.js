/* eslint-disable import/prefer-default-export,arrow-body-style */
/* eslint-env browser, node */
export const saveMarkedItemToGlobal = (markedItemList) => {
  window.getMarkedItems = () => {
    return markedItemList.toJS();
  };
  return {
    type: 'UPDATED_MARKED_ITEM_LIST',
    markedItemList,
  };
};
