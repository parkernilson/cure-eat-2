/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  collection.viewRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"
  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
