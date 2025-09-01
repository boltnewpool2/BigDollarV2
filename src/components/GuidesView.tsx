import React, { useState, useMemo } from 'react';
import { Search, Filter, User, Award, Percent, Ticket } from 'lucide-react';
import { Guide } from '../types';
import guidesData from '../data/guides.json';

export const GuidesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  const guides = guidesData as Guide[];

  const departments = useMemo(() => {
    return Array.from(new Set(guides.map(guide => guide.department))).sort();
  }, [guides]);

  const supervisors = useMemo(() => {
    return Array.from(new Set(guides.map(guide => guide.supervisor))).sort();
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !selectedDepartment || guide.department === selectedDepartment;
      const matchesSupervisor = !selectedSupervisor || guide.supervisor === selectedSupervisor;
      
      return matchesSearch && matchesDepartment && matchesSupervisor;
    });
  }, [guides, searchTerm, selectedDepartment, selectedSupervisor]);

  const stats = useMemo(() => {
    const totalTickets = guides.reduce((sum, guide) => sum + guide.totalTickets, 0);
    const avgNPS = guides.reduce((sum, guide) => sum + guide.nps, 0) / guides.length;
    const avgNRPC = guides.reduce((sum, guide) => sum + guide.nrpc, 0) / guides.length;
    const avgRefund = guides.reduce((sum, guide) => sum + guide.refundPercent, 0) / guides.length;

    return { totalTickets, avgNPS, avgNRPC, avgRefund };
  }, [guides]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Guides</p>
              <p className="text-3xl font-bold">{guides.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Tickets</p>
              <p className="text-3xl font-bold">{stats.totalTickets.toLocaleString()}</p>
            </div>
            <Ticket className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg NPS</p>
              <p className="text-3xl font-bold">{stats.avgNPS.toFixed(1)}</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg Refund%</p>
              <p className="text-3xl font-bold">{stats.avgRefund.toFixed(1)}%</p>
            </div>
            <Percent className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={selectedSupervisor}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Supervisors</option>
              {supervisors.map(supervisor => (
                <option key={supervisor} value={supervisor}>{supervisor}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Guides Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guide
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NRPC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tickets
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {guide.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{guide.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {guide.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {guide.supervisor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      guide.nps >= 90 ? 'bg-green-100 text-green-800' :
                      guide.nps >= 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {guide.nps}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      guide.nrpc >= 90 ? 'bg-green-100 text-green-800' :
                      guide.nrpc >= 85 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {guide.nrpc}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      guide.refundPercent <= 3 ? 'bg-green-100 text-green-800' :
                      guide.refundPercent <= 4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {guide.refundPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Ticket className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{guide.totalTickets}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No guides found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};