'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import PageWrapper from '../../(components)/PageWrapper';
import CustomLoader from '../../(components)/Components/utils/Loader';
import { Ticket, Copy, RefreshCw, Plus, Calendar, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import getAxiosErrorMessage from '../../../utils/Variables/getAxiosError.util';
import { InviteToken } from '../../../types/InviteCode/InviteToken.type';
import { InviteTokenResponseDTO } from '../../../types/DTO/InviteToken.DTO';
import { SuccessResponseDTO } from '../../../types/DTO/Global.DTO';

export default function InviteTokensPage() {
  const { data: session } = useSession();
  const [tokens, setTokens] = useState<InviteToken[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

  const [expiresAt, setExpiresAt] = useState<string>('');

  const fetchTokens = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<InviteTokenResponseDTO>('/api/admin/invite-code-manager');
      setTokens(response.data.tokens);
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, 'Failed to fetch tokens'));
    } finally {
      setLoading(false);
    }
  }, []);

  const disableToken = async (tokenString: string) => {
    try {
      const response = await axios.post<SuccessResponseDTO>('/api/admin/invite-code-manager/disable', {
        token: tokenString
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setTokens(prevTokens =>
          prevTokens.map(token =>
            token.token === tokenString
              ? { ...token, active: false }
              : token
          )
        );
      }
    } catch (err: unknown) {
      setTokens(prevTokens =>
        prevTokens.map(token =>
          token.token === tokenString
            ? { ...token, active: true }
            : token
        )
      );
      toast.error(getAxiosErrorMessage(err, 'Failed to disable token'));
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const createToken = async () => {
    if (!expiresAt) {
      toast.error('Please select expiration date');
      return;
    }

    try {
      setCreating(true);
      const localDate = new Date(expiresAt);
      const utcDateString = localDate.toISOString();
      await axios.post('/api/admin/invite-code-manager/create', {
        expires_at: utcDateString
      });

      toast.success('Token created successfully!');
      setExpiresAt('');
      await fetchTokens();
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, 'Failed to create token'));
    } finally {
      setCreating(false);
    }
  };

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return 'Never expires';

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;

    return `${day} ${month}, ${year} ${formattedHours}:${minutes}${ampm}`;
  };

  const getTimeUntilExpiry = (dateString: string) => {
    const now = new Date();
    const expiry = new Date(dateString);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) return '.. wait a second ! Select proper expiry date & time';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  };


  const getStatusInfo = (token: InviteToken) => {
    if (!token.active) {
      return {
        text: 'Inactive',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/50',
        icon: XCircle
      };
    }

    const now = new Date();
    const expiresAt = token.expires_at ? new Date(token.expires_at) : null;

    if (expiresAt && expiresAt < now) {
      return {
        text: 'Expired',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/50',
        icon: AlertCircle
      };
    }

    return {
      text: 'Active',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/50',
      icon: CheckCircle
    };
  };

  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('Token copied to clipboard!');
  };

  if (loading) {
    return <CustomLoader fullscreen random_text />;
  }

  if (!session) {
    return null;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen p-6 relative overflow-hidden select-text">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-green-900/10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Ticket className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Invite Tokens
                </h1>
                <p className="text-gray-300 text-lg mt-2">
                  Create and manage invitation codes for user registration
                </p>

                {/* Go Back Button */}
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-black rounded-full transition-all duration-300 text-xs bg-white shadow-xl/10 shadow-white"
                >
                  ← Go Back to Dashboard
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Create Token Card - Enhanced Responsiveness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Plus className="w-6 h-6 text-emerald-400" />
              Create New Token
            </h2>

            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
              <div className="flex-1 w-full">
                <label htmlFor="expiresAt" className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Expiration Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-stone-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all duration-300 cursor-pointer"
                  min={new Date().toISOString().slice(0, 16)}
                  step="60"
                />

                {/* Expiry Preview */}
                {expiresAt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
                  >
                    <p className="text-emerald-400 text-sm">
                      This token will expire in <span className="font-semibold">{getTimeUntilExpiry(expiresAt)}</span>
                    </p>
                    <p className="text-emerald-300 text-xs mt-1">
                      {formatExpiryDate(expiresAt)}
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={createToken}
                  disabled={creating || !expiresAt}
                  className="px-8 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 flex-1"
                >
                  {creating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Token
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchTokens}
                  className="px-6 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-300 flex items-center justify-center gap-2 flex-1 lg:hidden"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview - Updated without max uses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-1">{tokens.length}</div>
              <div className="text-gray-400 text-sm">Total Tokens</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {tokens.filter(t => getStatusInfo(t).text === 'Active').length}
              </div>
              <div className="text-gray-400 text-sm">Active</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {tokens.filter(t => getStatusInfo(t).text === 'Expired').length}
              </div>
              <div className="text-gray-400 text-sm">Expired</div>
            </div>
          </motion.div>

          {/* Tokens List - Updated without max uses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/40 backdrop-blur-sm border border-stone-800 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-stone-700">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Ticket className="w-6 h-6 text-emerald-400" />
                Manage Tokens ({tokens.length})
              </h2>
            </div>

            {tokens.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Ticket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No invite tokens found.</p>
                <p className="text-sm">Create your first one above to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/20 border-b border-stone-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Token
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Uses
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Expires
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-700">
                    {tokens.map((token, index) => {
                      const statusInfo = getStatusInfo(token);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <motion.tr
                          key={token.token}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="hover:bg-black/30 transition-colors duration-200"
                        >
                          <td className="px-6 py-4">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="flex items-center gap-3 group cursor-pointer"
                              onClick={() => copyToClipboard(token.token)}
                            >
                              <code className="font-mono text-white bg-black/40 px-3 py-2 rounded-lg border border-stone-700 group-hover:border-emerald-500/50 transition-colors">
                                {token.token}
                              </code>
                              <Copy className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                            </motion.div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-white">{token.creator_name || 'System'}</div>
                                <div className="text-gray-400 text-xs">{token.creator_email || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-white text-sm">
                                {token.uses} / {token.max_uses}
                              </div>
                              <div className="w-20 bg-stone-700 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(token.uses / token.max_uses) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
                              <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                              <span className={`text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {token.active && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => disableToken(token.token)}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-all duration-200 group cursor-pointer"
                                title="Disable token"
                              >
                                <div className="w-6 h-6 rounded-full border border-gray-400 group-hover:border-red-400 flex items-center justify-center transition-colors">
                                  <XCircle className="w-3 h-3" />
                                </div>
                              </motion.button>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Clock className="w-4 h-4" />
                              {formatExpiryDate(token.expires_at)}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Refresh Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchTokens}
              className="px-6 py-3 bg-stone-700 text-white rounded-xl hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Tokens
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}