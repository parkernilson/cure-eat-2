/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2kou20aq",
    "name": "location_id",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "og0yxlh6",
    "name": "location_name",
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
  collection.schema.removeField("2kou20aq")

  // remove
  collection.schema.removeField("og0yxlh6")

  return dao.saveCollection(collection)
})
