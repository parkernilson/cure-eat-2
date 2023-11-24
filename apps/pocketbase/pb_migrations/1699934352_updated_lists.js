/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.id = owner"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  collection.listRule = null

  return dao.saveCollection(collection)
})
