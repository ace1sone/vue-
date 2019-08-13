// eslint-disable-next-line
export const validateIfExists = (fieldName, actionType, dispatch, originalValue) => (
  rule,
  value,
  callback
) => {
  if (originalValue && originalValue === value) {
    callback();
    return;
  }
  dispatch({
    type: actionType,
    payload: {
      [fieldName]: value,
    },
  }).then(response => {
    if (response.total === 0) {
      callback();
    } else {
      callback(`${value} 已存在`);
    }
  });
};
