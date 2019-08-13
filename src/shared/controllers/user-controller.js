export default class UserController {
  constructor(utilService, userService) {
    this.utilService = utilService;
    this.userService = userService;
  }

  async login(user, silent = false) {
    this.utilService.showSpinner(undefined, silent);
    return this.userService.login(user);
  }

  async register(user, silent = false) {
    this.utilService.showSpinner(undefined, silent);
    const result = await this.userService.register(user);
    return result;
  }

  async unAuth() {
    this.utilService.showSpinner();
    return this.userService.unAuth();
  }

  async logout() {
    this.utilService.showSpinner();
    await this.userService.logout();
  }

  getUser() {
    return this.userService.getUser();
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }
}
