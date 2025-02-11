import { CheckCircle2, Truck, Package, AlertCircle } from 'lucide-react';

interface ShippingHistory {
  status: string;
  location: string;
  timestamp: Date;
  description: string;
}

interface TrackingTimelineProps {
  status: 'processing' | 'in_transit' | 'delivered' | 'failed';
  history: ShippingHistory[];
  estimatedDeliveryDate: Date;
  carrier: string;
  trackingNumber: string;
}

export function TrackingTimeline({
  status,
  history,
  estimatedDeliveryDate,
  carrier,
  trackingNumber,
}: TrackingTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'in_transit':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'in_transit':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Shipping Info */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Shipping Information
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Carrier</p>
            <p className="font-medium">{carrier}</p>
          </div>
          <div>
            <p className="text-gray-500">Tracking Number</p>
            <p className="font-medium">{trackingNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status)}
              <span className="capitalize">{status.replace('_', ' ')}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Estimated Delivery</p>
            <p className="font-medium">
              {new Date(estimatedDeliveryDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tracking History
        </h2>
        <div className="space-y-6">
          {history.map((event, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-full p-1 ${getStatusColor(event.status)}`}
                >
                  {getStatusIcon(event.status)}
                </div>
                {index !== history.length - 1 && (
                  <div className="w-px h-full bg-gray-200 my-2" />
                )}
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900 capitalize">
                  {event.status.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-500">{event.location}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}