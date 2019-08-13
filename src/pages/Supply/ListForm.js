import { rcValidator } from '@/shared/utility';

import BaseForm from '@/utils/BaseForm';

export default class ListForm extends BaseForm {

  static options = {
    name: 'searchForm'
  };

  constructor(form) {
    super();
    this.form = form;
    this.fuzzy = ['fuzzy'];
  }

}