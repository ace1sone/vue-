export default class SupplyController {
  constructor(utilService, supplyService) {
    this.utilService = utilService;
    this.supplyService = supplyService;
  }

  async getSupplies(page, query, order) {
    return this.supplyService.getSupplies(page, query, order);
  }

  async getSupply(id) {
    return this.supplyService.getSupply(id);
  }

  async createSupply(supply) {
    return this.supplyService.createSupply(supply);
  }

  async updateSupply(supply) {
    return this.supplyService.updateSupply(supply);
  }
}
