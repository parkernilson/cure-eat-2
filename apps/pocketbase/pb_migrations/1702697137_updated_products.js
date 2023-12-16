/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "d1yyqdaz",
    "name": "list",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "9lkow3g2mqhqray",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  // remove
  collection.schema.removeField("d1yyqdaz")

  return dao.saveCollection(collection)
})
