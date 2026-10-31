import 'package:flutter/material.dart';

import '../data/saved_library.dart';
import '../theme/app_colors.dart';

class SavedScreen extends StatefulWidget {
  const SavedScreen({super.key, this.onNavigate});
  final ValueChanged<int>? onNavigate;

  @override
  State<SavedScreen> createState() => _SavedScreenState();
}

class _SavedScreenState extends State<SavedScreen> {
  final search = TextEditingController();
  String filter = 'All';
  static const filters = ['All', 'Briefings', 'Records', 'Projects'];

  @override
  void dispose() {
    search.dispose();
    super.dispose();
  }

  void detail(SavedEntry entry) => showModalBottomSheet<void>(
    context: context,
    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => SafeArea(
      child: Padding(
        padding: EdgeInsets.fromLTRB(18, 18, 18, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: context.colors.outlineVariant,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
            SizedBox(height: 17),
            _pill(
              entry.type.toUpperCase(),
              context.colors.secondaryContainer,
              context.colors.primary,
            ),
            SizedBox(height: 8),
            Text(
              entry.title,
              style: TextStyle(
                fontSize: 21.5,
                fontWeight: FontWeight.w800,
                color: context.colors.onSurface,
              ),
            ),
            SizedBox(height: 7),
            Text(
              entry.description,
              style: TextStyle(
                fontSize: 16,
                height: 1.4,
                color: context.colors.onSurfaceVariant,
              ),
            ),
            SizedBox(height: 10),
            Text(
              entry.reference,
              style: TextStyle(
                fontSize: 13,
                color: context.colors.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
            SizedBox(height: 13),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      SavedLibrary.instance.remove(entry.id);
                      Navigator.pop(ctx);
                    },
                    icon: Icon(Icons.bookmark_remove_outlined, size: 16),
                    label: Text('Remove saved'),
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: context.colors.primary,
                      foregroundColor: context.colors.onPrimary,
                    ),
                    child: Text('Done'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    ),
  );

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
    body: SafeArea(
      bottom: false,
      child: Column(
        children: [
          _header(),
          Expanded(
            child: AnimatedBuilder(
              animation: SavedLibrary.instance,
              builder: (context, _) => CustomScrollView(
                slivers: [
                  SliverPadding(
                    padding: EdgeInsets.fromLTRB(13, 12, 13, 18),
                    sliver: SliverList.list(
                      children: [
                        _intro(),
                        SizedBox(height: 11),
                        _searchBar(),
                        SizedBox(height: 9),
                        _filterChips(),
                        SizedBox(height: 11),
                        _summary(),
                        SizedBox(height: 10),
                        _savedItems(),
                        SizedBox(height: 12),
                        _privacyNote(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          _bottomNav(),
        ],
      ),
    ),
  );

  Widget _header() => Container(
    padding: EdgeInsets.fromLTRB(12, 7, 12, 7),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      border: Border(bottom: BorderSide(color: context.colors.outlineVariant)),
    ),
    child: Row(
      children: [
        Icon(Icons.bookmark_outline, size: 19, color: context.colors.primary),
        SizedBox(width: 7),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mzizi Africa',
                style: TextStyle(
                  fontFamily: 'serif',
                  fontSize: 14.5,
                  fontWeight: FontWeight.w800,
                  color: context.colors.primary,
                ),
              ),
              Text(
                'KENYA PUBLIC EVIDENCE',
                style: TextStyle(
                  fontSize: 10.5,
                  color: context.colors.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ),
        Text(
          'MY LIBRARY',
          style: TextStyle(
            fontSize: 10.5,
            letterSpacing: .4,
            color: context.colors.onSurfaceVariant,
            fontWeight: FontWeight.w700,
          ),
        ),
        SizedBox(width: 7),
        CircleAvatar(
          radius: 12,
          backgroundColor: context.colors.outline,
          child: Icon(Icons.person, size: 14, color: context.colors.primary),
        ),
      ],
    ),
  );

  Widget _intro() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Row(
        children: [
          Icon(
            Icons.collections_bookmark_outlined,
            size: 13,
            color: context.colors.primary,
          ),
          SizedBox(width: 5),
          Text(
            'YOUR CIVIC RESEARCH LIBRARY',
            style: TextStyle(
              fontSize: 11.5,
              letterSpacing: .4,
              color: context.colors.primary,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
      SizedBox(height: 4),
      Text(
        'Saved Evidence',
        style: TextStyle(
          fontFamily: 'serif',
          fontSize: 24.5,
          height: 1.1,
          color: context.colors.primary,
          fontWeight: FontWeight.w800,
        ),
      ),
      SizedBox(height: 3),
      Text(
        'Keep useful explainers, records, and public projects together for later review.',
        style: TextStyle(
          fontSize: 14,
          height: 1.3,
          color: context.colors.onSurfaceVariant,
        ),
      ),
    ],
  );

  Widget _searchBar() => Container(
    height: 35,
    padding: EdgeInsets.symmetric(horizontal: 9),
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border.all(color: context.colors.outlineVariant),
      borderRadius: BorderRadius.circular(18),
    ),
    child: Row(
      children: [
        Icon(Icons.search, size: 14, color: context.colors.primary),
        SizedBox(width: 5),
        Expanded(
          child: TextField(
            controller: search,
            onChanged: (_) => setState(() {}),
            style: TextStyle(fontSize: 12.5),
            decoration: InputDecoration(
              border: InputBorder.none,
              isDense: true,
              hintText: 'Search your saved evidence…',
              hintStyle: TextStyle(
                fontSize: 12.5,
                color: context.colors.onSurfaceVariant,
              ),
            ),
          ),
        ),
        if (search.text.isNotEmpty)
          InkWell(
            onTap: () {
              search.clear();
              setState(() {});
            },
            child: Icon(
              Icons.cancel_outlined,
              size: 14,
              color: context.colors.onSurfaceVariant,
            ),
          ),
      ],
    ),
  );

  Widget _filterChips() => SizedBox(
    height: 28,
    child: ListView(
      scrollDirection: Axis.horizontal,
      children: filters
          .map(
            (item) => Padding(
              padding: EdgeInsets.only(right: 5),
              child: ChoiceChip(
                label: Text(
                  item,
                  style: TextStyle(
                    fontSize: 12,
                    color: filter == item
                        ? context.colors.onPrimary
                        : context.colors.onSurface,
                  ),
                ),
                selected: filter == item,
                onSelected: (_) => setState(() => filter = item),
                selectedColor: context.colors.primary,
                backgroundColor: context.colors.outlineVariant,
                side: BorderSide.none,
                showCheckmark: false,
                visualDensity: VisualDensity.compact,
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 0),
              ),
            ),
          )
          .toList(),
    ),
  );

  Widget _summary() {
    final items = SavedLibrary.instance.entries;
    return Container(
      padding: EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: context.colors.secondaryContainer,
        borderRadius: BorderRadius.circular(11),
      ),
      child: Row(
        children: [
          Container(
            width: 31,
            height: 31,
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              Icons.bookmarks_outlined,
              size: 17,
              color: context.colors.primary,
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${items.length} saved ${items.length == 1 ? 'item' : 'items'}',
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: context.colors.primary,
                  ),
                ),
                Text(
                  'Available in this app session',
                  style: TextStyle(
                    fontSize: 11,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          _pill(
            '${items.length}',
            context.colors.secondaryContainer,
            context.colors.primary,
          ),
        ],
      ),
    );
  }

  Widget _savedItems() {
    final query = search.text.toLowerCase();
    final entries = SavedLibrary.instance.entries.where((entry) {
      final typeMatches =
          filter == 'All' ||
          entry.type.toLowerCase() ==
              filter.substring(0, filter.length - 1).toLowerCase();
      final textMatches =
          '${entry.title} ${entry.description} ${entry.reference}'
              .toLowerCase()
              .contains(query);
      return typeMatches && textMatches;
    }).toList();
    if (entries.isEmpty) {
      final hasSaved = SavedLibrary.instance.entries.isNotEmpty;
      return Container(
        padding: EdgeInsets.fromLTRB(17, 23, 17, 20),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          border: Border.all(color: context.colors.outlineVariant),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: context.colors.secondaryContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.bookmark_add_outlined,
                color: context.colors.primary,
                size: 23,
              ),
            ),
            SizedBox(height: 9),
            Text(
              hasSaved
                  ? 'No ${filter.toLowerCase()} found'
                  : 'Your library is ready',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: context.colors.onSurface,
              ),
            ),
            SizedBox(height: 4),
            Text(
              hasSaved ? 'Try another category or search term.' : 'Tap a bookmark on a briefing to keep it here. Your saved items will appear in this list.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 12,
                height: 1.35,
                color: context.colors.onSurfaceVariant,
              ),
            ),
            SizedBox(height: 10),
            OutlinedButton.icon(
              onPressed: () => widget.onNavigate?.call(1),
              icon: Icon(Icons.explore_outlined, size: 15),
              label: Text('Explore civic evidence'),
              style: OutlinedButton.styleFrom(
                foregroundColor: context.colors.primary,
                side: BorderSide(color: context.colors.outlineVariant),
              ),
            ),
          ],
        ),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'SAVED ITEMS',
                style: TextStyle(
                  fontSize: 11.5,
                  color: context.colors.onSurfaceVariant,
                  fontWeight: FontWeight.w700,
                  letterSpacing: .3,
                ),
              ),
            ),
            Text(
              '${entries.length} items',
              style: TextStyle(
                fontSize: 11,
                color: context.colors.onSurfaceVariant,
              ),
            ),
          ],
        ),
        SizedBox(height: 5),
        ...entries.map(_savedCard),
      ],
    );
  }

  Widget _savedCard(SavedEntry entry) => InkWell(
    onTap: () => detail(entry),
    child: Container(
      margin: EdgeInsets.only(bottom: 6),
      padding: EdgeInsets.all(9),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        border: Border.all(color: context.colors.outlineVariant),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 31,
            height: 31,
            decoration: BoxDecoration(
              color: context.colors.secondaryContainer,
              borderRadius: BorderRadius.circular(7),
            ),
            child: Icon(
              entry.type == 'Briefing'
                  ? Icons.article_outlined
                  : Icons.description_outlined,
              size: 16,
              color: context.colors.primary,
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _pill(
                  entry.type.toUpperCase(),
                  context.colors.secondaryContainer,
                  context.colors.primary,
                ),
                SizedBox(height: 4),
                Text(
                  entry.title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: context.colors.onSurface,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  entry.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    height: 1.2,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  entry.reference,
                  style: TextStyle(
                    fontSize: 10.5,
                    color: context.colors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => SavedLibrary.instance.remove(entry.id),
            icon: Icon(Icons.bookmark, size: 17, color: context.colors.primary),
            visualDensity: VisualDensity.compact,
            tooltip: 'Remove saved item',
          ),
        ],
      ),
    ),
  );

  Widget _privacyNote() => Container(
    padding: EdgeInsets.all(9),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerHighest,
      borderRadius: BorderRadius.circular(9),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(Icons.info_outline, size: 13, color: context.colors.primary),
        SizedBox(width: 6),
        Expanded(
          child: Text(
            'Bookmarks are held locally for this app session. Verify all public records against the original source before relying on them.',
            style: TextStyle(
              fontSize: 11,
              height: 1.3,
              color: context.colors.onSurfaceVariant,
            ),
          ),
        ),
      ],
    ),
  );

  Widget _pill(String text, Color bg, Color fg) => Container(
    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 3),
    decoration: BoxDecoration(
      color: bg,
      borderRadius: BorderRadius.circular(12),
    ),
    child: Text(
      text,
      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: fg),
    ),
  );

  Widget _bottomNav() => Container(
    decoration: BoxDecoration(
      color: Theme.of(context).scaffoldBackgroundColor,
      border: Border(top: BorderSide(color: context.colors.outlineVariant)),
    ),
    padding: EdgeInsets.only(
      top: 5,
      bottom: MediaQuery.of(context).padding.bottom > 0
          ? MediaQuery.of(context).padding.bottom
          : 7,
    ),
    child: Row(
      children: [
        _nav(0, Icons.home_outlined, 'Home'),
        _nav(1, Icons.explore_outlined, 'Explore'),
        _nav(2, Icons.account_balance_wallet_outlined, 'Money'),
        _nav(3, Icons.history, 'History'),
        _nav(4, Icons.bookmark_border, 'Saved'),
      ],
    ),
  );
  Widget _nav(int i, IconData icon, String label) => Expanded(
    child: InkWell(
      onTap: () => widget.onNavigate?.call(i),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 17,
            color: i == 4
                ? context.colors.primary
                : context.colors.onSurfaceVariant,
          ),
          SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 10.5,
              color: i == 4
                  ? context.colors.primary
                  : context.colors.onSurfaceVariant,
              fontWeight: i == 4 ? FontWeight.w700 : FontWeight.w400,
            ),
          ),
        ],
      ),
    ),
  );
}
