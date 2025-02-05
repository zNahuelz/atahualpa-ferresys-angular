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
  UNIT_TYPE_UPDATED: 'Presentación actualizada correctamente.'
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
  'POD ID',
  'POR NOMBRE',
]
