'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Building,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Settings,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Activity,
  X,
} from 'lucide-react';

export default function Profiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedProfile, setSelectedProfile] = useState<(typeof profiles)[0] | null>(null);

  // Sample profiles data
  const profiles = [
    {
      id: 1,
      type: 'candidate',
      name: 'John Kamau',
      position: 'Governor',
      county: 'Nairobi',
      party: 'Jubilee Party',
      email: 'john.kamau@example.com',
      phone: '+254 712 345 678',
      status: 'active',
      registrationDate: '2024-01-15',
      lastActivity: '2024-01-20',
      compliance: 92,
      riskLevel: 'low',
      totalFunds: 45000000,
      donations: 320,
    },
    {
      id: 2,
      type: 'party',
      name: 'Jubilee Party',
      position: 'National Party',
      county: 'National',
      party: 'Jubilee Party',
      email: 'info@jubilee.co.ke',
      phone: '+254 20 123 456',
      status: 'active',
      registrationDate: '2023-12-01',
      lastActivity: '2024-01-19',
      compliance: 88,
      riskLevel: 'medium',
      totalFunds: 850000000,
      donations: 480,
    },
    {
      id: 3,
      type: 'organization',
      name: 'Kenya Holdings Ltd',
      position: 'Corporate Donor',
      county: 'Nairobi',
      party: 'Various',
      email: 'donations@kenyaholdings.co.ke',
      phone: '+254 20 987 654',
      status: 'verified',
      registrationDate: '2023-11-15',
      lastActivity: '2024-01-18',
      compliance: 95,
      riskLevel: 'low',
      totalFunds: 120000000,
      donations: 89,
    },
    {
      id: 4,
      type: 'candidate',
      name: 'Mary Wanjiku',
      position: 'Senator',
      county: 'Mombasa',
      party: 'ODM',
      email: 'mary.wanjiku@example.com',
      phone: '+254 734 567 890',
      status: 'active',
      registrationDate: '2024-01-10',
      lastActivity: '2024-01-17',
      compliance: 78,
      riskLevel: 'high',
      totalFunds: 28000000,
      donations: 180,
    },
    {
      id: 5,
      type: 'organization',
      name: 'Transparency Watch NGO',
      position: 'Monitoring Organization',
      county: 'Nakuru',
      party: 'Independent',
      email: 'info@transparencywatch.org',
      phone: '+254 722 111 222',
      status: 'active',
      registrationDate: '2023-10-20',
      lastActivity: '2024-01-16',
      compliance: 94,
      riskLevel: 'low',
      totalFunds: 5000000,
      donations: 12,
    },
  ];

  const profileTypes = [
    { id: 'all', name: 'All Profiles', icon: Users },
    { id: 'candidate', name: 'Candidates', icon: UserCheck },
    { id: 'party', name: 'Parties', icon: Building },
    { id: 'organization', name: 'Organizations', icon: Building },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'candidate':
        return UserCheck;
      case 'party':
        return Building;
      case 'organization':
        return Building;
      default:
        return Users;
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.county.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || profile.type === selectedType;
    return matchesSearch && matchesType;
  });

  const stats = {
    totalProfiles: profiles.length,
    activeProfiles: profiles.filter((p) => p.status === 'active').length,
    highRiskProfiles: profiles.filter((p) => p.riskLevel === 'high').length,
    avgCompliance: Math.round(profiles.reduce((sum, p) => sum + p.compliance, 0) / profiles.length),
  };

  const formatCurrency = (amount: number) => {
    return `KES ${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-6 py-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Profiles</p>
                <p className="text-2xl font-bold">{stats.totalProfiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Profiles</p>
                <p className="text-2xl font-bold">{stats.activeProfiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold">{stats.highRiskProfiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Compliance</p>
                <p className="text-2xl font-bold">{stats.avgCompliance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Types */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Profile Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profileTypes.map((type) => {
            const Icon = type.icon;
            const count = type.id === 'all' ? profiles.length : profiles.filter((p) => p.type === type.id).length;

            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  selectedType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium text-sm">{type.name}</p>
                  <p className="text-xs text-gray-500">{count} profiles</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search profiles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Profile
          </Button>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => {
          const TypeIcon = getTypeIcon(profile.type);
          return (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.position}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(profile.status)}>{profile.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.county}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    {profile.party}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {profile.phone}
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Compliance</span>
                      <span className={`font-medium ${getComplianceColor(profile.compliance)}`}>{profile.compliance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          profile.compliance >= 90 ? 'bg-green-500' : profile.compliance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${profile.compliance}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <Badge className={getRiskColor(profile.riskLevel)}>{profile.riskLevel}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Funds</p>
                      <p className="font-semibold">{formatCurrency(profile.totalFunds)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined: {profile.registrationDate}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Last: {profile.lastActivity}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View Modal */}
      {selectedProfile && (
        <Card className="fixed inset-0 z-50 bg-white bg-opacity-95 flex items-center justify-center p-6">
          <CardHeader className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Profile Details</CardTitle>
              <p className="text-gray-600">{selectedProfile.name}</p>
            </div>
            <Button variant="ghost" onClick={() => setSelectedProfile(null)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Detailed profile view would go here */}
            <p>Detailed profile information and analytics</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
