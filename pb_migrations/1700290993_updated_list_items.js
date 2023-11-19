/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dmjmo00g",
    "name": "ordinal",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93")

  // remove
  collection.schema.removeField("dmjmo00g")

  return dao.saveCollection(collection)
})
