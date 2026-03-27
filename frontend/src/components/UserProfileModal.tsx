import { useState } from 'react';
import { X, Mail, User as UserIcon, Shield, Trash2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function UserProfileModal({ isOpen, onClose, user, onLogout, onDeleteAccount }: Readonly<UserProfileModalProps>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !user) return null;

  const getRoleLabel = (role: string) => {
    const roles: { [key: string]: string } = {
      admin: 'Administrador',
      cliente: 'Cliente',
      user: 'Usuario'
    };
    return roles[role] || role;
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDeleteAccount();
  };

  return (
    <div className=" inset-0 z-50 flex items-center justify-center ">
      <button
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
        type="button"
        aria-label="Cerrar modal"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
          type="button"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {showDeleteConfirm ? (
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">¿Eliminar Cuenta?</h2>
              <p className="text-slate-600 mt-2">Esta acción no se puede deshacer</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">
                Se eliminarán permanentemente:
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1 ml-4">
                <li>• Tu perfil de usuario</li>
                <li>• Todos tus datos personales</li>
                <li>• Tus cotizaciones guardadas</li>
                <li>• Tu historial de cuenta</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Sí, Eliminar Mi Cuenta
              </Button>

              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex justify-center items-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Tu Perfil</h2>
            </div>

            {/* Información del Usuario */}
            <div className="space-y-4 mb-8">
              {/* Nombre */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 font-medium mb-1">Nombre</p>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-900 font-semibold">{user.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 font-medium mb-1">Correo Electrónico</p>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-900 font-semibold">{user.email}</p>
                </div>
              </div>

              {/* Rol */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600 font-medium mb-1">Tipo de Cuenta</p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-900 font-semibold">{getRoleLabel(user.role)}</p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>

              <Button
                onClick={handleDeleteClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar Cuenta
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
