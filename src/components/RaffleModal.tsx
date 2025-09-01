import React from 'react';
import { X, Settings, Users, Shuffle } from 'lucide-react';
import { RaffleSettings, Guide } from '../types';

interface RaffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RaffleSettings;
  onSettingsChange: (settings: RaffleSettings) => void;
  departments: string[];
  availableGuides: Guide[];
  onRunRaffle: () => void;
  isDrawing: boolean;
}

export const RaffleModal: React.FC<RaffleModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  departments,
  availableGuides,
  onRunRaffle,
  isDrawing
}) => {
  if (!isOpen) return null;

  const filteredGuides = settings.drawFrom === 'all' 
    ? availableGuides 
    : availableGuides.filter(guide => 
        settings.selectedDepartments.length === 0 || 
        settings.selectedDepartments.includes(guide.department)
      );

  const handleDepartmentToggle = (department: string) => {
    const newDepartments = settings.selectedDepartments.includes(department)
      ? settings.selectedDepartments.filter(d => d !== department)
      : [...settings.selectedDepartments, department];
    
    onSettingsChange({
      ...settings,
      selectedDepartments: newDepartments
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Raffle Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Winner Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Winners (Max: 28)
            </label>
            <input
              type="number"
              min="1"
              max="28"
              value={settings.maxWinners}
              onChange={(e) => onSettingsChange({
                ...settings,
                maxWinners: Math.min(28, Math.max(1, parseInt(e.target.value) || 1))
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Draw From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Draw From
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={settings.drawFrom === 'all'}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    drawFrom: e.target.value as 'all' | 'departments',
                    selectedDepartments: []
                  })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-900">Entire Pool</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="departments"
                  checked={settings.drawFrom === 'departments'}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    drawFrom: e.target.value as 'all' | 'departments'
                  })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-900">Specific Departments</span>
              </label>
            </div>
          </div>

          {/* Department Selection */}
          {settings.drawFrom === 'departments' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Departments
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {departments.map(department => {
                  const deptGuides = availableGuides.filter(g => g.department === department);
                  return (
                    <label key={department} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={settings.selectedDepartments.includes(department)}
                        onChange={() => handleDepartmentToggle(department)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <span className="text-sm font-medium text-gray-900">{department}</span>
                        <p className="text-xs text-gray-500">{deptGuides.length} guides available</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pool Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Current Pool Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Available Guides:</span>
                <span className="font-medium text-blue-900 ml-1">{filteredGuides.length}</span>
              </div>
              <div>
                <span className="text-blue-700">Total Tickets:</span>
                <span className="font-medium text-blue-900 ml-1">
                  {filteredGuides.reduce((sum, guide) => sum + guide.totalTickets, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
            
            <button
              onClick={onRunRaffle}
              disabled={isDrawing || filteredGuides.length === 0}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {isDrawing ? 'Drawing Winners...' : 'Run Raffle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};