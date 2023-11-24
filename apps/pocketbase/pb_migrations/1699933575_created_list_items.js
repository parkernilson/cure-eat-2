/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "x1h18efs0yhvl93",
    "created": "2023-11-14 03:46:15.336Z",
    "updated": "2023-11-14 03:46:15.336Z",
    "name": "list_items",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zfxwt1kl",
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
      },
      {
        "system": false,
        "id": "lzoqhbsn",
        "name": "value",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("x1h18efs0yhvl93");

  return dao.deleteCollection(collection);
})
