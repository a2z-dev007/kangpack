import { Order } from '../../database/models/Order';
import { Product } from '../../database/models/Product';
import { User } from '../../database/models/User';
import { OrderStatus } from '../../common/types';

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getStats() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Order Stats
    const orderStats = await Order.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { status: OrderStatus.DELIVERED } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
          ],
          counts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          totalOrders: [{ $count: 'count' }]
        }
      }
    ]);

    const stats = {
      orders: {
        totalRevenue: orderStats[0].totalRevenue[0]?.total || 0,
        totalOrders: orderStats[0].totalOrders[0]?.count || 0,
        deliveredOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        cancelledOrders: 0,
      },
      products: {
        totalProducts: await Product.countDocuments(),
        activeProducts: await Product.countDocuments({ isActive: true }),
        lowStock: await Product.countDocuments({ 
          $expr: { $lte: ['$stock', '$lowStockThreshold'] },
          stock: { $gt: 0 }
        }),
        outOfStockProducts: await Product.countDocuments({ stock: 0 }),
      },
      users: {
        total: await User.countDocuments({ role: 'user' }),
        newThisMonth: await User.countDocuments({ 
          role: 'user', 
          createdAt: { $gte: startOfMonth } 
        }),
        activeUsers: await User.countDocuments({ isActive: true, role: 'user' }),
      }
    };

    // Mapping order counts
    orderStats[0].counts.forEach((item: any) => {
      if (item._id === OrderStatus.DELIVERED) stats.orders.deliveredOrders = item.count;
      if (item._id === OrderStatus.PENDING) stats.orders.pendingOrders = item.count;
      if (item._id === OrderStatus.PROCESSING) stats.orders.processingOrders = item.count;
      if (item._id === OrderStatus.CANCELLED) stats.orders.cancelledOrders = item.count;
    });

    return stats;
  }

  /**
   * Get recent activity (Recent Orders and New Customers)
   */
  async getActivity() {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status totalAmount items createdAt');

    const newCustomers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role createdAt avatar');

    // Format customers to match frontend interface
    const formattedCustomers = newCustomers.map(user => ({
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }));

    return {
      orders: recentOrders,
      users: formattedCustomers
    };
  }
}
