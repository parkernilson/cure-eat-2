/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"
  collection.viewRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"
  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
})
