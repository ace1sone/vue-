import moment from 'moment';

export const mapDataToColumns = data =>
  data.map((item, i) => ({
    index: i + 1,
    key: item.id,
    id: item.id,
    name: item.name,
    date: moment(item.createdAt).format('YYYY-MM-DD HH:mm'),
    status: item.status,
  }));

export const mapDetailDataToColumns = (data, canEdit) =>
  data.map((item, i) => {
    if (canEdit) {
      return {
        index: i,
        name: item.name,
        key: i,
      };
    }

    return {
      index: i,
      name: item.name,
      key: i,
      actions: {
        id: item.id,
        status: item.status,
        isNew: item.isNew,
      },
    };
  });
