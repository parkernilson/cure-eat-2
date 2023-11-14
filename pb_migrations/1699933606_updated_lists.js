/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "js5lyr0a",
    "name": "owner",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lkow3g2mqhqray")

  // remove
  collection.schema.removeField("js5lyr0a")

  return dao.saveCollection(collection)
})
