/* eslint-disable no-unused-vars */
// const db = require('../')
// const sequelize = require('sequelize');
const models = require('../models');

// eslint-disable-next-line prefer-destructuring
const Order = require('../models').Order;
// eslint-disable-next-line prefer-destructuring
const Product = require('../models').Product;
// eslint-disable-next-line prefer-destructuring
const OrderDetail = require('../models').OrderDetail;

const catchAsync = require('../utils/catchAsync');

/*********************** METHOD 1ST */

// exports.createOrder = catchAsync(async (req, res) => {
//   let t;
//   const orderData = await Order.create({
//   orderNo: req.body.orderNo,
//   orderDate: req.body.orderDate,
//   orderTotal: req.body.orderTotal,
//   userId: req.body.userId,
//   shippingDate: req.body.shippingDate,
//   isDelivered: req.body.isDelivered,
// });
//   await sequelize.transaction(async (t) => {
//     const result = await Order.create(orderData, { transaction: t });
//     const insertedOrderId = result.id;
//     const orderedItemData = req.body.orderedItemDataArray;
//     await Promise.all(
//       orderedItemData.map(async (el) => {
//         const orderedItemDetails = el;
//         orderedItemDetails.orderId = insertedOrderId;
//         await OrderDetail.create(orderedItemDetails, { transaction: t });
//       })
//     );
//     res.status(201).json({
//       status: 'success',
//       data: {
//         result,
//       },
//     });
//   });
// });

// exports.findAllOrders = catchAsync(async (req, res) => {
//   const orderId = req.params.id;
//   const doc = await Order.findByPk;
// });

/*********************** METHOD 2ND */

exports.createOrder = catchAsync(async (req, res, next) => {
  const t = await models.sequelize.transaction();
  // Create and save the order
  const newOrder = await Order.create(req.body, { transaction: t });
  //loop through all the items in req.products
  await Promise.all(
    req.body.products.map(async (item) => {
      try {
        // Search for the product with the givenId and make sure it exists. If it doesn't, respond with status 400.
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });
        if (product) {
          // Create a dictionary with which to create the OrderDetail
          const po = {
            orderId: newOrder.id,
            productId: item.productId,
            productQuantity: item.productQuantity,
            productPrice: item.productPrice,
          };
          // Create and save a orderDetail
          const savedOrderDetail = await OrderDetail.create(po, {
            transaction: t,
          });
          // If everything goes well, respond with the order

          await t.commit();
          res.status(201).json(newOrder);
        }
      } catch (error) {
        await t.rollback();
      }
    })
  );
  return res.status(400).json({
    status: 'fail',
    message: 'Cannot find any product with the given productId!!',
  });
});

// exports.createOrder = catchAsync(async (req, res, next) => {
//   // Create and save the order
//   const newOrder = await Order.create(req.body);

//   //loop through all the items in req.products
//   req.body.products.forEach(async (item) => {
//     try {
//       // Search for the product with the givenId and make sure it exists. If it doesn't, respond with status 400.
//       const product = await Product.findByPk(item.productId);
//       // console.log(product);
//       if (!product) {
//         return res.status(400).json({
//           status: 'fail',
//           message: 'Cannot find the product with the given productId!!',
//         });
//       }

//       // Create a dictionary with which to create the OrderDetail
//       const po = {
//         orderId: newOrder.id,
//         productId: item.productId,
//         productQuantity: item.productQuantity,
//         productPrice: item.productPrice,
//       };
//       // Create and save a orderDetail
//       const savedOrderDetail = await OrderDetail.create(po);

//       // If everything goes well, respond with the order
//       res.status(201).json(newOrder);
//     } catch (error) {
//       console.error(error);
//     }
//   });
// });

exports.findAllOrders = catchAsync(async (req, res) => {
  const doc = await Order.findAll({
    // Make sure to include the products
    include: [
      {
        model: Product,
        as: 'products',
        // required: false,
        // Pass in the Product attributes that you want to retrieve
        attributes: ['id', 'productName'],
        through: {
          // This block of code allows you to retrieve the properties of the join table
          model: OrderDetail,
          as: 'orderDetails',
          attributes: ['productQuantity', 'productPrice'],
        },
      },
    ],
  });

  // If everything goes well respond with the orders
  return res.status(200).json({
    status: 'success',
    data: {
      doc,
    },
  });
});

exports.findOneOrder = catchAsync(async (req, res) => {
  const doc = await Order.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
        as: 'products',
        attributes: ['id', 'productName'],
        through: {
          model: OrderDetail,
          as: 'orderDetails',
          attributes: ['productQuantity', 'productPrice'],
        },
      },
    ],
  });
  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'There is no order with that ID!!',
    });
  }
  res.status(200).json({
    status: 'success',
    doc,
  });
});
