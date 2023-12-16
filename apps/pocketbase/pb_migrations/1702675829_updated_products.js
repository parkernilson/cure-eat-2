/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  collection.viewRule = ""
  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  collection.viewRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "
  collection.updateRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "
  collection.deleteRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "

  return dao.saveCollection(collection)
})
