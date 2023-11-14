/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.id = list.owner.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  collection.listRule = "@request.auth.id != \"\" && @collection.lists.id = @collection.list_items.id && @collection.lists.owner = @request.auth.id"

  return dao.saveCollection(collection)
})
