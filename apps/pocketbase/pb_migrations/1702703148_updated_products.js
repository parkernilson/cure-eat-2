/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gwmwwx0z",
    "name": "thumbnail_url",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ib9psy42p9vfce1")

  // remove
  collection.schema.removeField("gwmwwx0z")

  return dao.saveCollection(collection)
})
