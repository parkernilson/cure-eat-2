/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "mrvw2mbqfv3s5hs",
    "created": "2023-11-13 04:11:23.268Z",
    "updated": "2023-11-13 04:11:23.268Z",
    "name": "client_tokens",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jtymr5lz",
        "name": "access_token",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "cfz0b8hk",
        "name": "company",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "iys0p91i",
        "name": "expires",
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
  const collection = dao.findCollectionByNameOrId("mrvw2mbqfv3s5hs");

  return dao.deleteCollection(collection);
})
