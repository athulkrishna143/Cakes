import React, { useState, useEffect } from 'react';
import { ChefHat, Eye, ArrowLeft, Calendar, Phone, CheckSquare } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../utils/storage';
import { SPONGE_FLAVORS, FINISH_STYLES, DRIP_FLAVORS } from '../utils/cakeConfig';

export default function AdminDashboard({ onLoadIn3DViewer, onBackToStudio }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleStatusChange = (id, status) => {
    const updated = updateOrderStatus(id, status);
    setOrders(updated);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1E16]">
      <header className="bg-white border-b border-[#2C1E16]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2C1E16] text-[#FAF7F2] flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-[#C59B43]" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">Baker Kitchen View</h1>
            <p className="text-xs text-[#2C1E16]/60">
              Production Queue & 3D Cake Blueprints ({orders.length} Orders)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToStudio}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EFE8DC] hover:bg-[#E4DAC8] text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 3D Studio</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#2C1E16]/10">
            <ChefHat className="w-12 h-12 text-[#D48C94] mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-bold">No Custom Orders Yet</h2>
            <p className="text-sm text-[#2C1E16]/65 mt-1 mb-5">
              Design a cake in the 3D Studio and submit an order to see it appear in the kitchen queue.
            </p>
            <button
              type="button"
              onClick={onBackToStudio}
              className="px-5 py-2.5 rounded-xl bg-[#2C1E16] text-[#FAF7F2] text-xs font-semibold"
            >
              Open 3D Cake Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => {
              const cfg = order.cakeConfig;
              const sponge = SPONGE_FLAVORS.find((s) => s.id === cfg.sponge)?.name;
              const finish = FINISH_STYLES.find((f) => f.id === cfg.finish)?.name;
              const drip = DRIP_FLAVORS.find((d) => d.id === cfg.dripFlavor)?.name;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-[#2C1E16]/12 shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="px-5 py-3.5 bg-[#F4EDE2] border-b border-[#2C1E16]/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-[#2C1E16]">
                        {order.id}
                      </span>
                      <span className="mx-2 text-[#2C1E16]/30">•</span>
                      <span className="text-xs font-semibold text-[#C59B43]">
                        {order.pricing?.total}
                      </span>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#2C1E16]/15"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Baking Sponge">Baking Sponge</option>
                      <option value="Frosting & Decor">Frosting & Decor</option>
                      <option value="Ready for Dispatch">Ready for Dispatch</option>
                    </select>
                  </div>

                  <div className="p-5 flex gap-4">
                    {order.snapshotUrl && (
                      <img
                        src={order.snapshotUrl}
                        alt="3D Render"
                        className="w-28 h-28 rounded-2xl object-cover bg-[#F6F1E9] border border-[#2C1E16]/10 shrink-0"
                      />
                    )}
                    <div className="space-y-1 text-xs">
                      <div className="font-serif text-xl font-bold">{order.customer.name}</div>
                      <div className="flex items-center gap-1.5 text-[#2C1E16]/75">
                        <Calendar className="w-3.5 h-3.5 text-[#D48C94]" />
                        <span>
                          {order.customer.date} ({order.customer.timeSlot})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#2C1E16]/75">
                        <Phone className="w-3.5 h-3.5 text-[#C59B43]" />
                        <span>{order.customer.phone}</span>
                      </div>
                      <div className="text-[#2C1E16]/65 pt-0.5">
                        <strong>{order.customer.fulfillment.toUpperCase()}:</strong>{' '}
                        {order.customer.address}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-4 flex-1">
                    <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#2C1E16]/10 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#2C1E16]/60 mb-1">
                        <CheckSquare className="w-3.5 h-3.5 text-[#C59B43]" />
                        <span>Baker Spec Checklist</span>
                      </div>
                      <div>
                        <strong>Structure:</strong> {cfg.tiers}-Tier {cfg.shape} ({order.pricing?.servings} slices)
                      </div>
                      <div>
                        <strong>Sponge:</strong> {sponge}
                      </div>
                      <div>
                        <strong>Frosting:</strong> {finish} ({cfg.primaryColor}
                        {cfg.twoTone ? ` + ${cfg.secondaryColor}` : ''})
                      </div>
                      <div>
                        <strong>Drip & Piping:</strong> {cfg.hasDrip ? drip : 'No Drip'} •{' '}
                        {cfg.hasTopBorder || cfg.hasBottomBorder ? 'Piped Borders' : 'Clean Edges'}
                      </div>
                      <div>
                        <strong>Toppings:</strong>{' '}
                        {cfg.toppings.length > 0 ? cfg.toppings.join(', ') : 'None'} •{' '}
                        {cfg.candles} candles
                      </div>
                      {cfg.inscription && (
                        <div>
                          <strong>Inscription ({cfg.inscriptionFont}):</strong> “{cfg.inscription}”
                        </div>
                      )}
                      {cfg.dietary?.length > 0 && (
                        <div className="text-red-700 font-semibold">
                          Dietary Alert: {cfg.dietary.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <button
                      type="button"
                      onClick={() => onLoadIn3DViewer(cfg)}
                      className="w-full py-2.5 rounded-xl bg-[#2C1E16] hover:bg-[#3E2B20] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <Eye className="w-4 h-4 text-[#D48C94]" />
                      <span>Load in 3D Viewer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
