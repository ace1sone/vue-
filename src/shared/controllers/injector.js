import { UserController, SupplyController } from './index';
import { UtilService, StoreService, eventService, UserService, SupplyService } from '../services';

const container = {};

const config = Config => {
  const d = container;

  d.storeService = new StoreService();
  d.utilService = new UtilService(d.storeService);
  d.eventService = eventService;
  d.userService = new UserService(d.storeService);
  d.supplyService = new SupplyService(d.storeService);

  d.userController = new UserController(d.utilService, d.userService);
  d.supplyController = new SupplyController(d.utilService, d.supplyService);

  if (Config.overrideDependency) {
    Config.overrideDependency(d);
  }
};

const inject = type => container[type];

export default {
  config,
  inject,
};
