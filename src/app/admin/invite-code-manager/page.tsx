/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface InviteToken {
  token: string;
  created_by: string | null;
  uses: number;
  max_uses: number;
  active: boolean;
  created_at: string;
  expires_at: string | null;
  creator_email?: string;
  creator_name?: string;
}

interface ApiResponse {
  tokens: InviteToken[];
  count: number;
}

export default function InviteTokensPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [tokens, setTokens] = useState<InviteToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [expiresAt, setExpiresAt] = useState('');

  // Fetch tokens on component mount
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchTokens();
  }, [session, status, router]);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<ApiResponse>('/api/admin/invite-code-manager');
      setTokens(response.data.tokens);
    } catch (err: any) {
      console.error('Error fetching tokens:', err);
      setError(err.response?.data?.error || 'Failed to fetch invite tokens');
    } finally {
      setLoading(false);
    }
  };

  const createToken = async () => {
    if (!expiresAt) {
      setError('Please select an expiration date');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      setSuccess(null);

      await axios.post('/api/admin/invite-code-manager/create', {
        expires_at: expiresAt
      });

      setSuccess('Invite token created successfully!');
      setExpiresAt('');
      
      // Refresh the tokens list
      await fetchTokens();
    } catch (err: any) {
      console.error('Error creating token:', err);
      setError(err.response?.data?.error || 'Failed to create invite token');
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (token: InviteToken) => {
    if (!token.active) {
      return <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded">Inactive</span>;
    }
    
    const now = new Date();
    const expiresAt = token.expires_at ? new Date(token.expires_at) : null;
    
    if (expiresAt && expiresAt < now) {
      return <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">Expired</span>;
    }
    
    if (token.uses >= token.max_uses) {
      return <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">Max Used</span>;
    }
    
    return <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const copyToClipboard = (token: string) => {
  navigator.clipboard.writeText(token);
  toast.success('Token copied');
};

  if (!session) {
    return null; // Router will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 select-text">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Invite Tokens Management</h1>
          <p className="text-gray-600 mt-2">Create and manage invitation codes for user registration</p>
        </div>

        {/* Create Token Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Invite Token</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date & Time
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            
            <button
              onClick={createToken}
              disabled={creating || !expiresAt}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Creating...' : 'Create Token'}
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}
        </div>

        {/* Tokens List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Invite Tokens ({tokens.length})
            </h2>
          </div>

          {tokens.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No invite tokens found. Create your first one above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tokens.map((token) => (
                    <tr key={token.token} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-gray-100" onClick={() => copyToClipboard(token.token)}>
                        <code className="text-base font-mono text-gray-900 px-2 py-1 rounded">
                          {token.token}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {token.creator_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {token.creator_email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {token.uses} / {token.max_uses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(token)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(token.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(token.expires_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchTokens}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Refresh Tokens
          </button>
        </div>
      </div>
    </div>
  );
}