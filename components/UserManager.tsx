'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, X, User, Shield, ShieldCheck, LogOut, Key } from 'lucide-react'
import { User as UserType, UserRole } from '@/types'
import { getUsers, saveUsers, getUsersSync, saveUsersSync, deleteUserSync } from '@/lib/storage'
import { useLanguage } from '@/lib/language'
import { hasPermission, getCurrentUser, logout } from '@/lib/auth'
import ChangePasswordModal from './ChangePasswordModal'

export default function UserManager() {
  const { t } = useLanguage()
  const [users, setUsers] = useState<UserType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserRole, setNewUserRole] = useState<UserRole>('user')
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const canAddUsers = hasPermission('addUsers')
  const canManageSubAdmins = hasPermission('manageSubAdmins')

  useEffect(() => {
    loadUsers()
    setCurrentUser(getCurrentUser())
  }, [])

  const loadUsers = async () => {
    const usersData = await getUsers()
    setUsers(usersData)
  }

  const handleAdd = () => {
    if (!newUserName.trim()) return

    // 检查用户名是否已存在
    if (users.some(u => u.name === newUserName.trim())) {
      alert('用户名已存在')
      return
    }

    // 检查主管理员用户名
    if (newUserName.trim() === '舜') {
      alert('不能使用主管理员用户名')
      return
    }

    // 所有用户都可以设置初始密码（如果提供了）
    const newUser: UserType = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      role: newUserRole,
      password: newUserPassword.trim() || undefined, // 如果提供了密码就设置，否则为undefined
    }

    const updatedUsers = [...users, newUser]
    saveUsersSync(updatedUsers)
    setUsers(updatedUsers)
    setNewUserName('')
    setNewUserPassword('')
    setNewUserRole('user')
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    const userToDelete = users.find(u => u.id === id)
    if (!userToDelete) return

    const current = getCurrentUser()
    // 主管理员不能被删除
    if (userToDelete.id === 'main-admin') {
      alert('主管理员不能被删除')
      return
    }

    // 副管理员只能被主管理员删除
    if (userToDelete.role === 'subAdmin' && current?.role !== 'admin') {
      alert('只有主管理员可以删除副管理员')
      return
    }

    // 不能删除自己
    if (userToDelete.id === current?.id) {
      alert('不能删除自己')
      return
    }

    if (confirm(t('users.deleteConfirm'))) {
      // 使用 deleteUserSync 来删除用户（会同时更新本地存储和数据库）
      deleteUserSync(id)
      // 重新加载用户列表以确保UI正确更新
      await loadUsers()
    }
  }

  const handleLogout = () => {
    if (confirm('确定要登出吗？')) {
      logout()
      window.location.reload()
    }
  }

  const getRoleLabel = (role?: UserRole) => {
    if (role === 'admin') return '主管理员'
    if (role === 'subAdmin') return '副管理员'
    return '普通用户'
  }

  const getRoleIcon = (role?: UserRole) => {
    if (role === 'admin') return <ShieldCheck className="w-4 h-4 text-red-500" />
    if (role === 'subAdmin') return <Shield className="w-4 h-4 text-blue-500" />
    return null
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-lg p-6 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-ski-primary" />
          <h2 className="text-xl font-bold text-gray-800">{t('users.title')}</h2>
        </div>
        <div className="flex items-center space-x-3">
          {currentUser && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>当前用户: {currentUser.name}</span>
              {getRoleIcon(currentUser.role)}
              <span className="text-xs">({getRoleLabel(currentUser.role)})</span>
            </div>
          )}
          {canAddUsers && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-1 text-ski-primary hover:text-ski-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('users.addUser')}</span>
            </button>
          )}
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center space-x-1 text-gray-600 hover:text-ski-primary transition-colors"
            title="修改密码"
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">修改密码</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
            title="登出"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">登出</span>
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>{t('users.noUsers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 显示主管理员 */}
          {currentUser?.id === 'main-admin' && (
            <div className="flex items-center justify-between p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  舜
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">舜</span>
                  <span className="text-xs text-gray-500 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-red-500" />
                    <span>主管理员</span>
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* 显示其他用户 */}
          {users.map((user) => {
            const canDelete = 
              user.id !== 'main-admin' && 
              user.id !== currentUser?.id &&
              (user.role !== 'subAdmin' || canManageSubAdmins) &&
              (user.role !== 'admin' || currentUser?.role === 'admin')
            
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  user.role === 'admin' || user.role === 'subAdmin'
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                    user.role === 'admin' ? 'bg-red-500' : user.role === 'subAdmin' ? 'bg-blue-500' : 'bg-ski-primary'
                  }`}>
                    {user.name[0]}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-gray-800 truncate">{user.name}</span>
                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                      {getRoleIcon(user.role)}
                      <span>{getRoleLabel(user.role)}</span>
                    </span>
                  </div>
                </div>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                    title="删除用户"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 添加用户表单 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{t('users.addUser')}</h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setNewUserName('')
                  setNewUserPassword('')
                  setNewUserRole('user')
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('users.username')}
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
                  placeholder={t('users.usernamePlaceholder')}
                  autoFocus
                />
              </div>
              
              {canManageSubAdmins && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    用户角色
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
                  >
                    <option value="user">普通用户</option>
                    <option value="subAdmin">副管理员</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  初始密码（可选，建议设置）
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-ski-primary focus:border-transparent"
                  placeholder="输入初始密码（用户登录后可自行修改）"
                />
                <p className="text-xs text-gray-500 mt-1">
                  提示：设置初始密码后，用户首次登录需要使用此密码，之后可以自行修改
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-ski-primary text-white py-2 rounded-lg font-medium hover:bg-ski-primary/90 transition-colors"
                >
                  {t('users.add')}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setNewUserName('')
                    setNewUserPassword('')
                    setNewUserRole('user')
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 修改密码弹窗 */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={() => {
          alert('密码修改成功！')
          setShowChangePassword(false)
        }}
      />
    </div>
  )
}

