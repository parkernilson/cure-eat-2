/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0saxk1tx",
    "name": "product",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ib9psy42p9vfce1",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  // remove
  collection.schema.removeField("0saxk1tx")

  return dao.saveCollection(collection)
})
