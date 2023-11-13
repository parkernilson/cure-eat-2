/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const admin = new Admin()
  admin.email = "admin@admin.com"
  admin.setPassword("password12")

  try {
    dao.saveAdmin(admin)
  } catch (_) { /* most likely already created */ }

}, (db) => {
  const dao = new Dao(db)
  
  try {
    const admin = dao.findAdminByEmail("admin@admin.com")

    dao.deleteAdmin(admin)
  } catch (_) { /* most likely already deleted */ }
})
