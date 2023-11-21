/// <reference path="../pb_data/types.d.ts" />

onModelBeforeCreate((e) => {

    $app.dao().runInTransaction((txDao) => {
        const listItemsAfter = txDao
            .findRecordsByExpr(
                'list_items',
                $dbx.exp('ordinal >= {:newOrdinal}', { newOrdinal: e.model.getInt('ordinal') }),
                $dbx.exp('list = {:curList}', { curList: e.model.get('list') })
            );

        listItemsAfter.forEach((item) => {
            item.set('ordinal', item.getInt('ordinal') + 1)
            txDao.withoutHooks().saveRecord(item)
        })
    })

}, 'list_items');

onModelAfterDelete((e) => {

    $app.dao().runInTransaction((txDao => {
        const listItemsAfter = txDao.findRecordsByExpr(
            'list_items',
            $dbx.exp('ordinal > {:curOrdinal}', { curOrdinal: e.model.getInt('ordinal') }),
            $dbx.exp('list = {:list}', { list: e.model.get('list') })
        )

        for (let item of listItemsAfter) {
            item.set('ordinal', item.get('ordinal') - 1)
            txDao.saveRecord(item)
        }
    }))

}, 'list_items')

onModelBeforeUpdate((e) => {

    $app.dao().runInTransaction((txDao) => {
        const originalCopy = e.model.originalCopy()
        const oldOrdinal = originalCopy.get('ordinal')
        const newOrdinal = e.model.get('ordinal')

        if (oldOrdinal < newOrdinal) {
            const itemsBetweenAndIncludingNewOrdinal = txDao.findRecordsByExpr(
                'list_items',
                $dbx.exp('ordinal > {:oldOrdinal}', { oldOrdinal }),
                $dbx.exp('ordinal <= {:newOrdinal}', { newOrdinal }),
                $dbx.exp('list = {:list}', { list: e.model.get('list') })
            )

            itemsBetweenAndIncludingNewOrdinal.forEach((item) => {
                item.set('ordinal', item.get('ordinal') - 1)
                txDao.withoutHooks().saveRecord(item)
            })

        } else if (oldOrdinal > newOrdinal) {
            const itemsBetweenAndIncludingNewOrdinal = txDao.findRecordsByExpr(
                'list_items',
                $dbx.exp('ordinal < {:oldOrdinal}', { oldOrdinal }),
                $dbx.exp('ordinal >= {:newOrdinal}', { newOrdinal }),
                $dbx.exp('list = {:list}', { list: e.model.get('list') })
            )

            itemsBetweenAndIncludingNewOrdinal.forEach((item) => {
                item.set('ordinal', item.get('ordinal') + 1)
                txDao.withoutHooks().saveRecord(item)
            })
        }
    })

}, 'list_items')
