package org.wikipedia.search;

import org.wikipedia.data.ContentPersister;
import org.wikipedia.data.SQLiteContentProvider;
import android.content.Context;

public class RecentSearchPersister extends ContentPersister<RecentSearch> {
    public RecentSearchPersister(Context context) {
        // lolJava
        super(
                context.getContentResolver().acquireContentProviderClient(
                        SQLiteContentProvider.getAuthorityForTable(
                                RecentSearch.PERSISTANCE_HELPER.getTableName()
                        )
                ),
                RecentSearch.PERSISTANCE_HELPER
        );
    }
}
