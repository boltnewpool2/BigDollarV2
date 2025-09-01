import React, { useMemo } from 'react';
import { Trophy, Calendar, User, Award, Percent, Ticket, TrendingUp } from 'lucide-react';
import { useWinners } from '../hooks/useWinners';

export const WinnersView: React.FC = () => {
  const { winners, loading } = useWinners();

  const stats = useMemo(() => {
    if (winners.length === 0) return { totalWinners: 0, totalTickets: 0, avgNPS: 0, avgNRPC: 0 };
    
    const totalTickets = winners.reduce((sum, winner) => sum + winner.total_tickets, 0);
    const avgNPS = winners.reduce((sum, winner) => sum + winner.nps, 0) / winners.length;
    const avgNRPC = winners.reduce((sum, winner) => sum + winner.nrpc, 0) / winners.length;
    
    return { totalWinners: winners.length, totalTickets, avgNPS, avgNRPC };
  }, [winners]);

  const departmentStats = useMemo(() => {
    const deptMap = new Map<string, number>();
    winners.forEach(winner => {
      deptMap.set(winner.department, (deptMap.get(winner.department) || 0) + 1);
    });
    return Array.from(deptMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [winners]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Winners Dashboard</h2>
            <p className="text-yellow-100">Live tracking of all contest winners</p>
          </div>
          <Trophy className="w-12 h-12 text-yellow-200" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Winners</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWinners}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tickets Won</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTickets.toLocaleString()}</p>
            </div>
            <Ticket className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Winner NPS</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgNPS.toFixed(1)}</p>
            </div>
            <Award className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Winner NRPC</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgNRPC.toFixed(1)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      {departmentStats.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Winners by Department</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentStats.map(([department, count]) => (
              <div key={department} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{department}</h4>
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-xs text-gray-500">winners</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winners List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Winners</h3>
        </div>
        
        {winners.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No winners yet. Run your first raffle to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Winner
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
                    Tickets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Won At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {winners.map((winner, index) => (
                  <tr key={winner.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {winner.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {winner.name}
                            <Trophy className="w-4 h-4 ml-2 text-yellow-500" />
                          </div>
                          <div className="text-xs text-gray-500">Winner #{winners.length - index}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {winner.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {winner.supervisor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        winner.nps >= 90 ? 'bg-green-100 text-green-800' :
                        winner.nps >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {winner.nps}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        winner.nrpc >= 90 ? 'bg-green-100 text-green-800' :
                        winner.nrpc >= 85 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {winner.nrpc}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        winner.refund_percent <= 3 ? 'bg-green-100 text-green-800' :
                        winner.refund_percent <= 4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {winner.refund_percent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Ticket className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{winner.total_tickets}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(winner.won_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};