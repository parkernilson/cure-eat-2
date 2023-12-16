/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  collection.listRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "
  collection.viewRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "
  collection.createRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "
  collection.updateRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "
  collection.deleteRule = "@request.auth.id != \"\" && @collection.list_items.product.id = id && @collection.list_items.list.owner.id = @request.auth.id "

  // remove
  collection.schema.removeField("npnur7nt")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  collection.listRule = "@request.auth.id != \"\" && @request.auth.id = list_item.list.owner.id"
  collection.viewRule = "@request.auth.id != \"\" && @request.auth.id = list_item.list.owner.id"
  collection.createRule = "@request.auth.id != \"\" && @request.auth.id = list_item.list.owner.id"
  collection.updateRule = "@request.auth.id != \"\" && @request.auth.id = list_item.list.owner.id"
  collection.deleteRule = "@request.auth.id != \"\" && @request.auth.id = list_item.list.owner.id"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "npnur7nt",
    "name": "list_item",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "x1h18efs0yhvl93",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
