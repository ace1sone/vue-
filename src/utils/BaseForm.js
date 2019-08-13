export default class BaseForm {

  validate() {
    return new Promise((resolve, reject) => {
      this.form.validateFields((err, values) => {
        if (err) return reject(err);
        resolve(values);
      });
    })
  }

}