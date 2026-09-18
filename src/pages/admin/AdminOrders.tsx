import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Clock, User, Phone, MapPin, StickyNote, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import type { Order } from '../../contexts/DataContext';

type OrderStatus = Order['status'];

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useData();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders =
    filter === 'all' ? orders : orders.filter(order => order.status === filter);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':       return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'accepted':  return 'bg-teal-100 text-teal-700 border border-teal-200';
      case 'rejected':  return 'bg-red-100 text-red-700 border border-red-200';
      case 'preparing': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border border-green-200';
    }
  };

  const getCardBorder = (status: OrderStatus) => {
    switch (status) {
      case 'new':       return 'border-orange-300';
      case 'accepted':  return 'border-teal-300';
      case 'preparing': return 'border-blue-300';
      case 'completed': return 'border-green-300';
      case 'rejected':  return 'border-red-300';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'new':       return 'New';
      case 'accepted':  return 'Accepted';
      case 'rejected':  return 'Rejected';
      case 'preparing': return 'Preparing';
      case 'completed': return 'Completed';
    }
  };

  // Renders the correct action buttons for each status
  const renderActions = (order: Order) => {
    switch (order.status) {

      case 'new':
        return (
          <>
            <button
              onClick={() => updateOrderStatus(order.id, 'accepted')}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Accept
            </button>
            <button
              onClick={() => updateOrderStatus(order.id, 'rejected')}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        );

      case 'accepted':
        return (
          <>
            <button
              onClick={() => updateOrderStatus(order.id, 'preparing')}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Mark as Preparing
            </button>
            <button
              onClick={() => updateOrderStatus(order.id, 'rejected')}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        );

      case 'rejected':
        return (
          <button
            onClick={() => updateOrderStatus(order.id, 'accepted')}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Undo — Accept
          </button>
        );

      case 'preparing':
        return (
          <>
            <button
              onClick={() => updateOrderStatus(order.id, 'completed')}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              Mark as Completed
            </button>
            <button
              onClick={() => updateOrderStatus(order.id, 'accepted')}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Back to Accepted
            </button>
          </>
        );

      case 'completed':
        return (
          <span className="text-gray-400 text-sm italic">Order completed</span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-gray-900">Orders</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-600 text-sm">Filter:</span>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
          >
            <option value="all">All Orders</option>
            <option value="new">New</option>
            <option value="accepted">Accepted</option>
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className={`bg-white rounded-lg border-2 ${getCardBorder(order.status)} overflow-hidden`}
            >
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-gray-900 font-medium">Order #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-1 mt-0.5">
                    <Clock className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>

                  {/* Action buttons */}
                  {renderActions(order)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <p className="text-gray-900 font-medium mb-2">Customer Details</p>
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="capitalize">{order.orderType}</span>
                      {order.tableNumber && (
                        <span className="text-gray-600">• Table {order.tableNumber}</span>
                      )}
                    </div>
                    {order.notes && (
                      <div className="flex items-start gap-2 text-gray-700">
                        <StickyNote className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{order.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <p className="text-gray-900 font-medium mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                        >
                          <span className="text-gray-700">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-gray-900 font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
