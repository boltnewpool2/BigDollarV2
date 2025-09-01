import React, { useState, useMemo } from 'react';
import { Shuffle, Settings, Trophy, Users, Ticket } from 'lucide-react';
import { Guide, Winner, RaffleSettings } from '../types';
import { weightedRandomSelection } from '../utils/lottery';
import { useWinners } from '../hooks/useWinners';
import { RaffleModal } from './RaffleModal';
import guidesData from '../data/guides.json';

export const RaffleView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState<RaffleSettings>({
    maxWinners: 5,
    drawFrom: 'all',
    selectedDepartments: []
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastDrawResults, setLastDrawResults] = useState<Guide[]>([]);

  const { winners, addWinners } = useWinners();
  const guides = guidesData as Guide[];

  const availableGuides = useMemo(() => {
    const winnerIds = new Set(winners.map(w => w.guide_id));
    return guides.filter(guide => !winnerIds.has(guide.id));
  }, [guides, winners]);

  const filteredGuides = useMemo(() => {
    if (settings.drawFrom === 'all') {
      return availableGuides;
    }
    
    if (settings.selectedDepartments.length === 0) {
      return availableGuides;
    }
    
    return availableGuides.filter(guide => 
      settings.selectedDepartments.includes(guide.department)
    );
  }, [availableGuides, settings]);

  const departments = useMemo(() => {
    return Array.from(new Set(guides.map(guide => guide.department))).sort();
  }, [guides]);

  const handleRunRaffle = async () => {
    if (filteredGuides.length === 0) {
      alert('No guides available for the raffle with current settings.');
      return;
    }

    setIsDrawing(true);
    
    // Simulate drawing animation
    setTimeout(async () => {
      const winnersCount = Math.min(settings.maxWinners, filteredGuides.length);
      const selectedWinners = weightedRandomSelection(filteredGuides, winnersCount);
      
      // Save to database
      const winnersData: Winner[] = selectedWinners.map(guide => ({
        id: crypto.randomUUID(),
        guide_id: guide.id,
        name: guide.name,
        supervisor: guide.supervisor,
        department: guide.department,
        nps: guide.nps,
        nrpc: guide.nrpc,
        refund_percent: guide.refundPercent,
        total_tickets: guide.totalTickets,
        won_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }));

      try {
        await addWinners(winnersData);
        setLastDrawResults(selectedWinners);
      } catch (error) {
        console.error('Failed to save winners:', error);
        alert('Failed to save winners. Please try again.');
      }
      
      setIsDrawing(false);
      setIsModalOpen(false);
    }, 2000);
  };

  const stats = useMemo(() => {
    const totalTickets = filteredGuides.reduce((sum, guide) => sum + guide.totalTickets, 0);
    const avgNPS = filteredGuides.length > 0 ? 
      filteredGuides.reduce((sum, guide) => sum + guide.nps, 0) / filteredGuides.length : 0;
    
    return { totalTickets, avgNPS };
  }, [filteredGuides]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Raffle System</h2>
            <p className="text-purple-100">Run weighted lottery draws with customizable settings</p>
          </div>
          <Shuffle className="w-12 h-12 text-purple-200" />
        </div>
      </div>

      {/* Current Pool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Available Guides</p>
              <p className="text-2xl font-bold text-gray-900">{filteredGuides.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pool Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTickets.toLocaleString()}</p>
            </div>
            <Ticket className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pool Avg NPS</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgNPS.toFixed(1)}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Raffle Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Settings</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Max Winners: <span className="font-medium">{settings.maxWinners}</span></p>
              <p>Draw From: <span className="font-medium capitalize">{settings.drawFrom}</span></p>
              {settings.drawFrom === 'departments' && settings.selectedDepartments.length > 0 && (
                <p>Departments: <span className="font-medium">{settings.selectedDepartments.join(', ')}</span></p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </button>
            
            <button
              onClick={handleRunRaffle}
              disabled={isDrawing || filteredGuides.length === 0}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {isDrawing ? 'Drawing...' : 'Run Raffle'}
            </button>
          </div>
        </div>
      </div>

      {/* Last Draw Results */}
      {lastDrawResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Latest Draw Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lastDrawResults.map((winner, index) => (
              <div key={winner.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                    #{index + 1}
                  </span>
                  <span className="text-xs text-gray-500">{winner.totalTickets} tickets</span>
                </div>
                <h4 className="font-semibold text-gray-900">{winner.name}</h4>
                <p className="text-sm text-gray-600">{winner.department}</p>
                <p className="text-xs text-gray-500 mt-1">Supervisor: {winner.supervisor}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <RaffleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        departments={departments}
        availableGuides={availableGuides}
        onRunRaffle={handleRunRaffle}
        isDrawing={isDrawing}
      />
    </div>
  );
};