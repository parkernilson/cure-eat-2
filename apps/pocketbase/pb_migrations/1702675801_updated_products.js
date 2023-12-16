/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  collection.listRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  collection.listRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "

  return dao.saveCollection(collection)
})
