export const ERROR_MESSAGES = {
  ERROR_TAG: 'Oops! Ha sucedido un error.',
  INVALID_SUPPLIER_AND_UNIT_TYPE: 'El proveedor y la presentación seleccionada no estan disponibles. Intente nuevamente.',
  INVALID_SUPPLIER: 'El proveedor seleccionado no se encuentra disponible. Intente nuevamente.',
  INVALID_UNIT_TYPE: 'La presentación seleccionada no se encuentra disponible. Intente nuevamente.',
  SERVER_ERROR: 'Error interno del servidor. Intente nuevamente, si el error persiste comuniquese con administración.',
  PRODUCT_NOT_FOUND: 'Oops! Producto no encontrado.',
  PRODUCT_UPDATE_FAILED: 'Error al actualizar el producto. Intente nuevamente, si el error persiste comuniquese con administración',
  RUC_TAKEN: 'El RUC ingresado ya se encuentra en uso por otro proveedor.',
  SUPPLIER_NOT_FOUND: 'Oops! Proveedor no encontrado.',
  SUPPLIER_UPDATE_FAILED: 'Error al actualizar el proveedor. Intente nuevamente, si el error persiste comuniquese con administración',
  UNIT_TYPE_TAKEN: 'El nombre de presentación ingresado ya se encuentra en uso. Intente nuevamente.',
  UNIT_TYPE_NOT_FOUND: 'Oops! Presentación no encontrada.',
  CUSTOMER_NOT_FOUND: 'Oops! Cliente no encontrado.',
  DNI_TAKEN: 'El DNI ingresado ya se encuentra en uso por otro cliente.',
  CUSTOMER_UPDATE_FAILED: 'Error al actualizar el cliente. Intente nuevamente, si el error persiste comuniquese con admistración',
  EXPIRED_TOKEN: 'Token expirado o invalido. Intente nuevamente, si el problema persiste comuniquese con administración.',
  VOUCHERS_ERROR_BY_DATE: 'No se encontraron comprobantes de pago en el mes actual. Intente nuevamente.',
  VOUCHERS_ERROR_BY_RANGE: 'No se encontraron comprobantes de pago en el rango ingresado. Intente nuevamente.',
  VOUCHER_DOWNLOAD_FAILED: 'Error al descargar el comprobante de pago. Intente nuevamente, si el problema persiste comuniquese con administración',
  VOUCHER_NOT_FOUND: 'El comprobante solicitado no existe o no esta disponible. Intente nuevamente, si el error persiste comuniquese con administración.',
  VOUCHER_NOT_FOUND_DNI: 'El DNI ingresado no tiene comprobantes registrados o no existe. Intente nuevamente, si el error persiste comuniquese con administración',
  EMAIL_TAKEN: 'El E-Mail ingresado ya pertenece a otro usuario del sistema. Intente nuevamente.',
  USERNAME_TAKEN: 'El nombre de usuario ingresado ya pertenece a otro usuario del sistema. Intente nuevamente.',
  ACCOUNT_DELETED: 'La cuenta de usuario que intenta modificar no existe o ha sido eliminada. Comuniquese con administración.',
  INCORRECT_CREDENTIALS: 'La contraseña ingresada no coincide con los registros del sistema. Vuelva a intentarlo, si el problema persiste comuniquese con administración.',
  ROLE_NOT_FOUND: 'El rol seleccionado no esta disponible o no existe. Intente nuevamente.',
}

export const SUCCESS_MESSAGES = {
  SUCCESS_TAG: 'Operación exitosa.',
  PRODUCT_CREATED: 'Producto creado correctamente.',
  PRODUCT_DELETED: 'Producto eliminado correctamente.',
  PRODUCT_UPDATED: 'Producto actualizado correctamente.',
  SUPPLIER_CREATED: 'Proveedor creado correctamente.',
  SUPPLIER_DELETED: 'Proveedor eliminado correctamente.',
  SUPPLIER_UPDATED: 'Proveedor actualizado correctamente.',
  UNIT_TYPE_CREATED: 'Presentación creada correctamente.',
  UNIT_TYPE_DELETED: 'Presentación eliminada con correctamente.',
  UNIT_TYPE_UPDATED: 'Presentación actualizada correctamente.',
  UNIT_TYPE_DETAIL: 'Detalle de Presentación',
  CUSTOMER_CREATED: 'Cliente creado correctamente.',
  CUSTOMER_UPDATED: 'Cliente actualizado correctamente.',
  CUSTOMER_DELETED: 'Cliente eliminado correctamente.',
  RECOVERY_MAIL_SENDED: 'Si el E-Mail ingresado pertenece a un usuario, las instrucciones para recuperar tu cuenta serán enviadas.',
  RECOVERY_PASSWORD_CHANGED: 'Contraseña actualizada correctamente. Usted puede iniciar sesión a continuación.',
  UPDATED_USER_DATA: 'Datos de la cuenta actualizados correctamente. Usted debe iniciar sesión con sus nuevas credenciales.',
  SALE_COMPLETED: 'Venta completada correctamente.',
  ACCOUNT_CREATED: 'Cuenta de Usuario creada correctamente. Se han enviado las credenciales de acceso al e-mail proporcionado.',
  ACCOUNT_DELETED: 'Cuenta de Usuario eliminada correctamente.',
  ACCOUNT_RESET: 'Credenciales de la Cuenta de Usuario reseteadas correctamente.',
  ACCOUNT_UPDATED: 'Datos de la cuenta actualizados correctamente.',
}

export const PRODUCT_SEARCH_MODES = [
  'POR ID',
  'POR NOMBRE',
  'POR PROVEEDOR',
  'POR PRESENTACIÓN',
]

export const SUPPLIER_SEARCH_MODES = [
  'POR ID',
  'POR NOMBRE',
  'POR RUC',
]

export const UNIT_TYPE_SEARCH_MODES = [
  'POR ID',
  'POR NOMBRE',
]

export const CUSTOMER_SEARCH_MODES = [
  'POR ID',
  'POR DNI',
]

export const SM_PRODUCT_SEARCH_MODES = [
  'POR ID',
  'POR NOMBRE',
]

export const VOUCHER_SEARCH_MODES = [
  'POR ID',
  'POR DNI/RUC',
]

export const VOUCHER_FILTER_TYPES = [
  'POR MES-AÑO',
  'POR RANGO'
]
