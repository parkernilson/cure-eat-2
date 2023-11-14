/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  collection.viewRule = "@request.auth.id != \"\" && @request.auth.id = owner"
  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = owner"
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.id = owner"
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.id = owner"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
