import React, { useEffect, useState } from 'react';
import { Clock, Ticket, RefreshCw, ChefHat, Bell, CheckCircle2, Zap } from 'lucide-react';
import { QueueStatus, QueueTicket } from '../types';
import { queueApi } from '../services/api';
import { useWebSocket } from '../context/WebSocketContext';
import { StatusBadge } from '../components/StatusBadge';

export const LiveQueueTrackingPage: React.FC = () => {
  const { connected, subscribeToQueue } = useWebSocket();
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTicket, setSearchTicket] = useState('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await queueApi.getQueueStatus();
      setQueueStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Subscribe to STOMP WebSocket broadcast
    const unsubscribe = subscribeToQueue((freshStatus) => {
      setQueueStatus(freshStatus);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const readyTickets = queueStatus?.activeTickets.filter((t) => t.status === 'READY') || [];
  const preparingTickets = queueStatus?.activeTickets.filter((t) => t.status === 'PREPARING') || [];
  const waitingTickets = queueStatus?.activeTickets.filter((t) => t.status === 'WAITING') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Live indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Smart KDS Real-Time</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{connected ? 'WebSocket Live Sync' : 'Live Polling'}</span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-charcoal-900 tracking-tight mt-0.5">Live Counter & Queue Display</h1>
          <p className="text-xs text-gray-500 mt-1">Watch for your ticket number. Collect at counter as soon as it appears green.</p>
        </div>

        <button
          onClick={fetchStatus}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-white border border-cream-300 hover:border-brand-500 text-xs font-bold text-charcoal-800 flex items-center gap-2 shadow-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ready for Pickup</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{queueStatus?.totalReadyOrders || 0}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">At Counter 1 & 2</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Preparation</span>
          <p className="text-3xl font-black text-brand-600 mt-1">{queueStatus?.totalPreparingOrders || 0}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Wok & Tandoor active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Line / Waiting</span>
          <p className="text-3xl font-black text-amber-600 mt-1">{queueStatus?.totalWaitingOrders || 0}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Queued orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-cream-200 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Waiting Time</span>
          <p className="text-3xl font-black text-charcoal-900 mt-1">~{queueStatus?.averageWaitMinutes || 8} min</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Calculated by load</p>
        </div>
      </div>

      {/* Ticket Lookup input */}
      <div className="bg-brand-50 p-4 rounded-2xl border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Ticket className="w-5 h-5 text-brand-600" />
          <span className="text-xs font-bold text-brand-900">Have a ticket? Search your number:</span>
        </div>
        <input
          type="text"
          value={searchTicket}
          onChange={(e) => setSearchTicket(e.target.value.toUpperCase())}
          placeholder="e.g. TKT-101"
          className="px-4 py-2 rounded-xl border border-brand-300 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-64"
        />
      </div>

      {/* Main Boards: READY & PREPARING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ready Board (Huge visual focus) */}
        <div className="lg:col-span-5 bg-emerald-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h2 className="text-lg font-black tracking-tight text-white uppercase">Ready For Pickup</h2>
            </div>
            <span className="text-xs font-extrabold bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full animate-pulse">
              COLLECT NOW
            </span>
          </div>

          {readyTickets.length === 0 ? (
            <div className="py-12 text-center text-emerald-300/60 text-xs font-medium">
              No orders waiting for collection at counter.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {readyTickets.map((t) => {
                const isMatch = searchTicket && t.ticketNumber.includes(searchTicket);
                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl bg-emerald-800/80 border text-center transition-all ${
                      isMatch
                        ? 'border-white ring-4 ring-white/50 bg-emerald-700 animate-bounce'
                        : 'border-emerald-700'
                    }`}
                  >
                    <p className="text-2xl font-black text-white tracking-wider">{t.ticketNumber}</p>
                    <p className="text-[10px] text-emerald-300 font-bold mt-1">Counter 1</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Preparing & Waiting Boards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Preparing */}
          <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-charcoal-900">Now Cooking / In Preparation</h3>
              </div>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                {preparingTickets.length} orders
              </span>
            </div>

            {preparingTickets.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">Kitchen station currently clear.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {preparingTickets.map((t) => {
                  const isMatch = searchTicket && t.ticketNumber.includes(searchTicket);
                  return (
                    <div
                      key={t.id}
                      className={`p-3.5 rounded-2xl bg-cream-50 border transition-all ${
                        isMatch
                          ? 'border-brand-600 ring-2 ring-brand-500/20 bg-brand-100'
                          : 'border-cream-200'
                      }`}
                    >
                      <p className="text-lg font-black text-charcoal-900">{t.ticketNumber}</p>
                      <p className="text-[11px] text-brand-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>~{t.estimatedWaitMinutes} min</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Waiting in Queue */}
          <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-cream-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-charcoal-900">Next In Queue</h3>
              </div>
              <span className="text-xs font-bold text-gray-500">
                {waitingTickets.length} waiting
              </span>
            </div>

            {waitingTickets.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No queued tickets waiting.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {waitingTickets.map((t) => {
                  const isMatch = searchTicket && t.ticketNumber.includes(searchTicket);
                  return (
                    <div
                      key={t.id}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isMatch ? 'border-brand-600 bg-brand-50 font-bold' : 'border-cream-200 bg-cream-50/50'
                      }`}
                    >
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Pos #{t.queuePosition}</span>
                      <p className="text-base font-extrabold text-charcoal-900">{t.ticketNumber}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">~{t.estimatedWaitMinutes} min</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
