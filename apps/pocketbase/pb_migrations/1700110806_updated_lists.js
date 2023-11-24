/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0azp4y1j",
    "name": "color",
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
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  // remove
  collection.schema.removeField("0azp4y1j")

  return dao.saveCollection(collection)
})
