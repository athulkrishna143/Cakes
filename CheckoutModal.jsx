import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, Truck, Store, CheckCircle2, Sparkles } from 'lucide-react';
import {
  calculatePricingAndServings,
  SPONGE_FLAVORS,
  FINISH_STYLES,
} from '../utils/cakeConfig';
import { saveOrder } from '../utils/storage';

function getMinLeadDateString() {
  const minDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const yyyy = minDate.getFullYear();
  const mm = String(minDate.getMonth() + 1).padStart(2, '0');
  const dd = String(minDate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function CheckoutModal({ isOpen, onClose, config, currency, snapshotUrl }) {
  const minDate = useMemo(() => getMinLeadDateString(), []);
  const [fulfillment, setFulfillment] = useState('delivery');
  const [date, setDate] = useState(minDate);
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 1:00 PM');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isOpen) return null;

  const pricing = calculatePricingAndServings(config, currency);
  const spongeName = SPONGE_FLAVORS.find((s) => s.id === config.sponge)?.name;
  const finishName = FINISH_STYLES.find((f) => f.id === config.finish)?.name;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (date < minDate) {
      setError('Our patisserie requires a minimum 48-hour preparation lead time.');
      return;
    }
    if (!customerName.trim() || !phone.trim() || !email.trim()) {
      setError('Please complete your contact details.');
      return;
    }
    if (fulfillment === 'delivery' && !address.trim()) {
      setError('Please enter a delivery address.');
      return;
    }

    const order = saveOrder({
      customer: {
        name: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        fulfillment,
        address: fulfillment === 'delivery' ? address.trim() : 'Flagship Patisserie Pickup',
        date,
        timeSlot,
      },
      cakeConfig: config,
      pricing: {
        total: pricing.formattedTotal,
        servings: pricing.servings,
      },
      snapshotUrl,
    });

    setConfirmedOrder(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C1E16]/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#2C1E16]/15 overflow-hidden my-8">
        <div className="px-6 py-4 bg-white border-b border-[#2C1E16]/10 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#2C1E16]">
              {confirmedOrder ? 'Bespoke Order Confirmed' : 'Complete Your Cake Order'}
            </h2>
            <p className="text-xs text-[#2C1E16]/65">
              Freshly baked to order with 48-hour artisanal preparation
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            className="p-2 rounded-full hover:bg-[#2C1E16]/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#D48C94]/20 text-[#2C1E16] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#C59B43]" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#2C1E16] text-[#FAF7F2] text-xs font-bold tracking-wider">
                ORDER #{confirmedOrder.id}
              </span>
              <h3 className="font-serif text-3xl font-bold mt-2">
                Thank you, {confirmedOrder.customer.name}!
              </h3>
              <p className="text-sm text-[#2C1E16]/70 max-w-md mx-auto mt-1">
                Your 3D cake blueprint has been sent to our pastry chefs for{' '}
                <strong>{confirmedOrder.customer.date}</strong> ({confirmedOrder.customer.timeSlot}).
              </p>
            </div>

            {confirmedOrder.snapshotUrl && (
              <img
                src={confirmedOrder.snapshotUrl}
                alt="3D Cake Preview"
                className="w-44 h-44 object-cover rounded-2xl mx-auto border border-[#2C1E16]/15 shadow-md bg-[#F6F1E9]"
              />
            )}

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#2C1E16] text-[#FAF7F2] text-sm font-semibold"
              >
                Back to Studio
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white border border-[#2C1E16]/10">
              {snapshotUrl && (
                <img
                  src={snapshotUrl}
                  alt="3D Cake Render"
                  className="w-full sm:w-32 h-32 object-cover rounded-xl bg-[#F6F1E9] border border-[#2C1E16]/10 shrink-0"
                />
              )}
              <div className="flex-1 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-bold text-[#2C1E16]">
                    {config.tiers}-Tier {config.shape === 'round' ? 'Round' : 'Square'} Cake
                  </span>
                  <span className="font-serif text-lg font-bold text-[#C59B43]">
                    {pricing.formattedTotal}
                  </span>
                </div>
                <p className="text-[#2C1E16]/75">
                  <strong>Sponge:</strong> {spongeName}
                </p>
                <p className="text-[#2C1E16]/75">
                  <strong>Finish:</strong> {finishName} {config.hasDrip ? '• With Drip' : ''}
                </p>
                {config.inscription && (
                  <p className="text-[#2C1E16]/75">
                    <strong>Inscription:</strong> “{config.inscription}”
                  </p>
                )}
                <p className="text-[#2C1E16]/60 pt-1">
                  Est. {pricing.servings} servings
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillment('delivery')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-semibold transition ${
                  fulfillment === 'delivery'
                    ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#2C1E16]'
                    : 'bg-white text-[#2C1E16] border-[#2C1E16]/15'
                }`}
              >
                <Truck className="w-4 h-4 text-[#D48C94]" />
                <span>Chilled Van Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setFulfillment('pickup')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-semibold transition ${
                  fulfillment === 'pickup'
                    ? 'bg-[#2C1E16] text-[#FAF7F2] border-[#2C1E16]'
                    : 'bg-white text-[#2C1E16] border-[#2C1E16]/15'
                }`}
              >
                <Store className="w-4 h-4 text-[#C59B43]" />
                <span>Boutique Pickup</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#D48C94]" />
                  <span>Date (Min. 48h Lead Time)</span>
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#2C1E16]/20 text-xs font-medium"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C59B43]" />
                  <span>Preferred Slot</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#2C1E16]/20 text-xs font-medium"
                >
                  <option>10:00 AM - 12:00 PM</option>
                  <option>11:00 AM - 1:00 PM</option>
                  <option>3:00 PM - 5:00 PM</option>
                  <option>6:00 PM - 8:00 PM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="px-3.5 py-2.5 rounded-xl bg-white border border-[#2C1E16]/20 text-xs"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="px-3.5 py-2.5 rounded-xl bg-white border border-[#2C1E16]/20 text-xs"
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-3.5 py-2.5 rounded-xl bg-white border border-[#2C1E16]/20 text-xs"
              />
            </div>

            {fulfillment === 'delivery' && (
              <textarea
                rows={2}
                placeholder="Complete Delivery Address & Landmark *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#2C1E16]/20 text-xs"
              />
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#2C1E16] hover:bg-[#3D2A1F] text-[#FAF7F2] text-sm font-semibold shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-[#C59B43]" />
              <span>Confirm Custom Order • {pricing.formattedTotal}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
