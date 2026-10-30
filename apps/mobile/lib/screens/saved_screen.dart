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
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (ctx) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(18, 18, 18, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: line,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
            const SizedBox(height: 17),
            _pill(entry.type.toUpperCase(), const Color(0xFFE3F0E6), forest),
            const SizedBox(height: 8),
            Text(
              entry.title,
              style: const TextStyle(
                fontSize: 21.5,
                fontWeight: FontWeight.w800,
                color: ink,
              ),
            ),
            const SizedBox(height: 7),
            Text(
              entry.description,
              style: const TextStyle(fontSize: 16, height: 1.4, color: muted),
            ),
            const SizedBox(height: 10),
            Text(
              entry.reference,
              style: const TextStyle(
                fontSize: 13,
                color: forest,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 13),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      SavedLibrary.instance.remove(entry.id);
                      Navigator.pop(ctx);
                    },
                    icon: const Icon(Icons.bookmark_remove_outlined, size: 16),
                    label: const Text('Remove saved'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: deepGreen,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Done'),
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
    backgroundColor: const Color(0xFFF4F9F3),
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
                    padding: const EdgeInsets.fromLTRB(13, 12, 13, 18),
                    sliver: SliverList.list(
                      children: [
                        _intro(),
                        const SizedBox(height: 11),
                        _searchBar(),
                        const SizedBox(height: 9),
                        _filterChips(),
                        const SizedBox(height: 11),
                        _summary(),
                        const SizedBox(height: 10),
                        _savedItems(),
                        const SizedBox(height: 12),
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
    padding: const EdgeInsets.fromLTRB(12, 7, 12, 7),
    decoration: const BoxDecoration(
      color: Color(0xFFF8FBF7),
      border: Border(bottom: BorderSide(color: line)),
    ),
    child: Row(
      children: [
        const Icon(Icons.bookmark_outline, size: 19, color: forest),
        const SizedBox(width: 7),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mzizi Africa',
                style: TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w800,
                  color: deepGreen,
                ),
              ),
              Text(
                'KENYA PUBLIC EVIDENCE',
                style: TextStyle(fontSize: 10.5, color: muted),
              ),
            ],
          ),
        ),
        const Text(
          'MY LIBRARY',
          style: TextStyle(
            fontSize: 10.5,
            letterSpacing: .4,
            color: muted,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(width: 7),
        const CircleAvatar(
          radius: 12,
          backgroundColor: Color(0xFFBFD1C3),
          child: Icon(Icons.person, size: 14, color: deepGreen),
        ),
      ],
    ),
  );

  Widget _intro() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const Row(
        children: [
          Icon(Icons.collections_bookmark_outlined, size: 13, color: forest),
          SizedBox(width: 5),
          Text(
            'YOUR CIVIC RESEARCH LIBRARY',
            style: TextStyle(
              fontSize: 11.5,
              letterSpacing: .4,
              color: forest,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
      const SizedBox(height: 4),
      const Text(
        'Saved Evidence',
        style: TextStyle(
          fontSize: 24.5,
          height: 1.1,
          color: deepGreen,
          fontWeight: FontWeight.w800,
        ),
      ),
      const SizedBox(height: 3),
      const Text(
        'Keep useful explainers, records, and public projects together for later review.',
        style: TextStyle(fontSize: 14, height: 1.3, color: muted),
      ),
    ],
  );

  Widget _searchBar() => Container(
    height: 35,
    padding: const EdgeInsets.symmetric(horizontal: 9),
    decoration: BoxDecoration(
      color: Colors.white,
      border: Border.all(color: line),
      borderRadius: BorderRadius.circular(18),
    ),
    child: Row(
      children: [
        const Icon(Icons.search, size: 14, color: forest),
        const SizedBox(width: 5),
        Expanded(
          child: TextField(
            controller: search,
            onChanged: (_) => setState(() {}),
            style: const TextStyle(fontSize: 12.5),
            decoration: const InputDecoration(
              border: InputBorder.none,
              isDense: true,
              hintText: 'Search your saved evidence…',
              hintStyle: TextStyle(fontSize: 12.5, color: muted),
            ),
          ),
        ),
        if (search.text.isNotEmpty)
          InkWell(
            onTap: () {
              search.clear();
              setState(() {});
            },
            child: const Icon(Icons.cancel_outlined, size: 14, color: muted),
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
              padding: const EdgeInsets.only(right: 5),
              child: ChoiceChip(
                label: Text(
                  item,
                  style: TextStyle(
                    fontSize: 12,
                    color: filter == item ? Colors.white : ink,
                  ),
                ),
                selected: filter == item,
                onSelected: (_) => setState(() => filter = item),
                selectedColor: deepGreen,
                backgroundColor: const Color(0xFFE7EEE8),
                side: BorderSide.none,
                showCheckmark: false,
                visualDensity: VisualDensity.compact,
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
              ),
            ),
          )
          .toList(),
    ),
  );

  Widget _summary() {
    final items = SavedLibrary.instance.entries;
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFEAF3EC),
        borderRadius: BorderRadius.circular(11),
      ),
      child: Row(
        children: [
          Container(
            width: 31,
            height: 31,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.bookmarks_outlined,
              size: 17,
              color: forest,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${items.length} saved ${items.length == 1 ? 'item' : 'items'}',
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: deepGreen,
                  ),
                ),
                const Text(
                  'Available in this app session',
                  style: TextStyle(fontSize: 11, color: muted),
                ),
              ],
            ),
          ),
          _pill('${items.length}', const Color(0xFFD3F2DE), forest),
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
        padding: const EdgeInsets.fromLTRB(17, 23, 17, 20),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: const Color(0xFFE6ECE7)),
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: const BoxDecoration(
                color: Color(0xFFEAF2EB),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.bookmark_add_outlined,
                color: forest,
                size: 23,
              ),
            ),
            const SizedBox(height: 9),
            Text(
              hasSaved
                  ? 'No ${filter.toLowerCase()} found'
                  : 'Your library is ready',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: ink,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              hasSaved ? 'Try another category or search term.' : 'Tap a bookmark on a briefing to keep it here. Your saved items will appear in this list.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, height: 1.35, color: muted),
            ),
            const SizedBox(height: 10),
            OutlinedButton.icon(
              onPressed: () => widget.onNavigate?.call(1),
              icon: const Icon(Icons.explore_outlined, size: 15),
              label: const Text('Explore civic evidence'),
              style: OutlinedButton.styleFrom(
                foregroundColor: forest,
                side: const BorderSide(color: line),
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
            const Expanded(
              child: Text(
                'SAVED ITEMS',
                style: TextStyle(
                  fontSize: 11.5,
                  color: muted,
                  fontWeight: FontWeight.w700,
                  letterSpacing: .3,
                ),
              ),
            ),
            Text(
              '${entries.length} items',
              style: const TextStyle(fontSize: 11, color: muted),
            ),
          ],
        ),
        const SizedBox(height: 5),
        ...entries.map(_savedCard),
      ],
    );
  }

  Widget _savedCard(SavedEntry entry) => InkWell(
    onTap: () => detail(entry),
    child: Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.all(9),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFE5ECE6)),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 31,
            height: 31,
            decoration: BoxDecoration(
              color: const Color(0xFFEAF2EB),
              borderRadius: BorderRadius.circular(7),
            ),
            child: Icon(
              entry.type == 'Briefing'
                  ? Icons.article_outlined
                  : Icons.description_outlined,
              size: 16,
              color: forest,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _pill(
                  entry.type.toUpperCase(),
                  const Color(0xFFE7F1E8),
                  forest,
                ),
                const SizedBox(height: 4),
                Text(
                  entry.title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: ink,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  entry.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11,
                    height: 1.2,
                    color: muted,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  entry.reference,
                  style: const TextStyle(
                    fontSize: 10.5,
                    color: forest,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => SavedLibrary.instance.remove(entry.id),
            icon: const Icon(Icons.bookmark, size: 17, color: forest),
            visualDensity: VisualDensity.compact,
            tooltip: 'Remove saved item',
          ),
        ],
      ),
    ),
  );

  Widget _privacyNote() => Container(
    padding: const EdgeInsets.all(9),
    decoration: BoxDecoration(
      color: const Color(0xFFE9F0EA),
      borderRadius: BorderRadius.circular(9),
    ),
    child: const Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(Icons.info_outline, size: 13, color: forest),
        SizedBox(width: 6),
        Expanded(
          child: Text(
            'Bookmarks are held locally for this app session. Verify all public records against the original source before relying on them.',
            style: TextStyle(fontSize: 11, height: 1.3, color: muted),
          ),
        ),
      ],
    ),
  );

  Widget _pill(String text, Color bg, Color fg) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
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
    decoration: const BoxDecoration(
      color: Color(0xFFFAFCFA),
      border: Border(top: BorderSide(color: line)),
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
          Icon(icon, size: 17, color: i == 4 ? forest : muted),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 10.5,
              color: i == 4 ? forest : muted,
              fontWeight: i == 4 ? FontWeight.w700 : FontWeight.w400,
            ),
          ),
        ],
      ),
    ),
  );
}
