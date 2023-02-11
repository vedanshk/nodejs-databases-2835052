const Models = require("../models/sequelize");

class OrderService {
  constructor(sequelize) {
    Models(sequelize);

    this.client = sequelize;

    this.models = sequelize.models;
  }

  async inTransction(work) {
    const t = await this.client.transcation();

    try {
      await work(t);
      return t.commit();
    } catch (err) {
      t.rollback();
      throw error;
    }
  }
  async create(user, items, t) {
    const order = await this.models.Order.create(
      {
        userId: user.id,
        email: user.email,
        status: "Note Shipped",
      },
      { transcation: t }
    );

    return Promise.all(items.map(async (item) => {
        const orderItem = await this.models.OrderItem.create({

            sku:item.sku,
            qty:item.qty,
            price:item.price,
            name:item.name,

        });

        return order.addOrderItem(orderItem , { transcation:t});
    }));
  }

  async getAll(){

    return this.models.Order.findAll({
        where:{},
        include:[this.models.OrderItem],
    });
  }
 async setStatus (orderId, status){
        return this.models.update({status} , {where:{id:orderId}})

 }

}

module.exports = OrderService;
