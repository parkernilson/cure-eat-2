/// <reference path="../pb_data/types.d.ts" />

onModelBeforeCreate((e) => {

	const listItemsAfter = $app
		.dao()
		.findRecordsByExpr(
            'list_items',
            $dbx.exp('ordinal >= {:newOrdinal}', { newOrdinal: e.model.getInt('ordinal') }),
            $dbx.exp('list = {:curList}', { curList: e.model.get('list') })
		);

    listItemsAfter.forEach((item) => {
        item.set('ordinal', item.getInt('ordinal') + 1)
        $app.dao().saveRecord(item)
    })

}, 'list_items');

onModelAfterDelete((e) => {
    
    const listItemsAfter = $app
        .dao()
        .findRecordsByExpr(
            'list_items',
            $dbx.exp('ordinal > {:curOrdinal}', { curOrdinal: e.model.getInt('ordinal') }),
            $dbx.exp('list = {:list}', { list: e.model.get('list') })
        )

    listItemsAfter.forEach((item) => {
        item.set('ordinal', item.getInt('ordinal') - 1)
        $app.dao().saveRecord(item)
    })

}, 'list_items')

onModelBeforeUpdate((e) => {

    const originalCopy = e.model.originalCopy()
    const oldOrdinal = originalCopy.get('ordinal')
    const newOrdinal = e.model.get('ordinal')

    if (oldOrdinal < newOrdinal) {
        const itemsBetweenAndIncludingNewOrdinal = $app.dao().findRecordsByExpr(
            'list_items',
            $dbx.exp('ordinal > {:oldOrdinal}', { oldOrdinal }),
            $dbx.exp('ordinal <= {:newOrdinal}', { newOrdinal }),
            $dbx.exp('list = {:list}', { list: e.model.get('list') })
        )

        itemsBetweenAndIncludingNewOrdinal.forEach((item) => {
            item.set('ordinal', item.get('ordinal') - 1)
            $app.dao().withoutHooks().saveRecord(item)
        })

    } else if (oldOrdinal > newOrdinal) {
        const itemsBetweenAndIncludingNewOrdinal = $app.dao().findRecordsByExpr(
            'list_items',
            $dbx.exp('ordinal < {:oldOrdinal}', { oldOrdinal }),
            $dbx.exp('ordinal >= {:newOrdinal}', { newOrdinal }),
            $dbx.exp('list = {:list}', { list: e.model.get('list') })
        )

        itemsBetweenAndIncludingNewOrdinal.forEach((item) => {
            item.set('ordinal', item.get('ordinal') + 1)
            $app.dao().withoutHooks().saveRecord(item)
        })

    }

}, 'list_items')
