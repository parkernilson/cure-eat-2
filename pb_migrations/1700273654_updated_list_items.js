/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r65skkrz",
    "name": "checked",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  // remove
  collection.schema.removeField("r65skkrz")

  return dao.saveCollection(collection)
})
