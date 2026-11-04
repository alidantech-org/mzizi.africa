import 'dart:async';

import 'package:flutter/material.dart';

import '../data/domain_api.dart';
import '../data/geography_api.dart' show JsonObject;
import '../data/saved_library.dart';
import '../theme/app_colors.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key, this.onNavigate});
  final ValueChanged<int>? onNavigate;

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final search = TextEditingController();
  final searchFocus = FocusNode();
  final List<JsonObject> _events = [];
  Timer? _searchDebounce;
  String? _error;
  bool _loading = true;
  bool _loadingMore = false;
  int _page = 1;
  int _totalPages = 0;
  int _request = 0;

  @override
  void initState() {
    super.initState();
    _loadEvents(reset: true);
  }

  @override
  void dispose() {
    _searchDebounce?.cancel();
    search.dispose();
    searchFocus.dispose();
    super.dispose();
  }

  Future<void> _loadEvents({required bool reset}) async {
    final request = ++_request;
    final page = reset ? 1 : _page + 1;
    setState(() {
      _error = null;
      if (reset) {
        _loading = true;
        _events.clear();
      } else {
        _loadingMore = true;
      }
    });
    try {
      final result = await DomainApiClient.instance.events(
        query: search.text,
        page: page,
      );
      if (!mounted || request != _request) return;
      setState(() {
        _events.addAll(result.items);
        _page = result.page;
        _totalPages = result.totalPages;
        _loading = false;
        _loadingMore = false;
      });
    } catch (error) {
      if (!mounted || request != _request) return;
      setState(() {
        _error = error.toString();
        _loading = false;
        _loadingMore = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
    body: SafeArea(
      bottom: false,
      child: Column(
        children: [
          _header(),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 28),
              children: [
                Text(
                  'History & events',
                  style: TextStyle(
                    fontFamily: 'serif',
                    fontSize: 25,
                    fontWeight: FontWeight.w800,
                    color: context.colors.primary,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'Public event records from the Mzizi database. Place and source links appear when the API provides them.',
                  style: TextStyle(
                    fontSize: 14,
                    height: 1.35,
                    color: context.colors.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 16),
                _searchBar(),
                const SizedBox(height: 18),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'EVENT RECORDS',
                        style: TextStyle(
                          fontSize: 11.5,
                          letterSpacing: .35,
                          color: context.colors.onSurfaceVariant,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    Text(
                      '${_events.length} loaded',
                      style: TextStyle(
                        fontSize: 11,
                        color: context.colors.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                if (_loading)
                  const Padding(
                    padding: EdgeInsets.all(28),
                    child: Center(child: CircularProgressIndicator()),
                  )
                else if (_error != null)
                  _message(
                    icon: Icons.cloud_off_outlined,
                    title: 'Could not load Mzizi events',
                    body:
                        '${_error!.replaceFirst('Exception: ', '').replaceFirst('Bad state: ', '')} Check the API connection and try again.',
                    action: 'Retry',
                    onPressed: () => _loadEvents(reset: true),
                  )
                else if (_events.isEmpty)
                  _message(
                    icon: Icons.history_toggle_off,
                    title: 'No event records found',
                    body: search.text.isEmpty
                        ? 'The API returned no public events for this request.'
                        : 'No public events match “${search.text.trim()}”.',
                  )
                else ...[
                  ..._events.map(_eventCard),
                  if (_page < _totalPages)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: OutlinedButton.icon(
                        onPressed: _loadingMore
                            ? null
                            : () => _loadEvents(reset: false),
                        icon: _loadingMore
                            ? const SizedBox.square(
                                dimension: 16,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              )
                            : const Icon(Icons.expand_more),
                        label: Text(_loadingMore ? 'Loading…' : 'Load more'),
                      ),
                    ),
                ],
              ],
            ),
          ),
        ],
      ),
    ),
  );

  Widget _header() => Container(
    padding: const EdgeInsets.fromLTRB(12, 7, 12, 7),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      border: Border(bottom: BorderSide(color: context.colors.outlineVariant)),
    ),
    child: Row(
      children: [
        Icon(Icons.history_edu, size: 20, color: context.colors.primary),
        const SizedBox(width: 7),
        Expanded(
          child: Text(
            'Mzizi Africa',
            style: TextStyle(
              fontFamily: 'serif',
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: context.colors.primary,
            ),
          ),
        ),
        IconButton(
          onPressed: searchFocus.requestFocus,
          icon: const Icon(Icons.search, size: 19),
          visualDensity: VisualDensity.compact,
        ),
      ],
    ),
  );

  Widget _searchBar() => TextField(
    controller: search,
    focusNode: searchFocus,
    onChanged: (_) {
      _searchDebounce?.cancel();
      _searchDebounce = Timer(
        const Duration(milliseconds: 350),
        () => _loadEvents(reset: true),
      );
    },
    decoration: InputDecoration(
      hintText: 'Search event records',
      prefixIcon: const Icon(Icons.search),
      suffixIcon: search.text.isEmpty
          ? null
          : IconButton(
              onPressed: () {
                search.clear();
                setState(() {});
                _loadEvents(reset: true);
              },
              icon: const Icon(Icons.close),
            ),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      isDense: true,
    ),
  );

  Widget _eventCard(JsonObject event) {
    final title = event['title']?.toString().trim();
    final description = event['description']?.toString().trim();
    final date = event['startsOn']?.toString();
    final status = event['status']?.toString();
    final code = event['code']?.toString();
    final id = event['id']?.toString();
    return Card(
      margin: const EdgeInsets.only(bottom: 9),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 13, vertical: 7),
        leading: CircleAvatar(
          backgroundColor: context.colors.secondaryContainer,
          child: Icon(Icons.event_note, color: context.colors.primary),
        ),
        title: Text(
          (title == null || title.isEmpty) ? 'Untitled event' : title,
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            [
              if (date != null && date.isNotEmpty) date,
              if (status != null && status.isNotEmpty) status,
              if (description != null && description.isNotEmpty) description,
            ].join(' · '),
          ),
        ),
        trailing: IconButton(
          tooltip: 'Save event',
          onPressed: id == null
              ? null
              : () {
                  SavedLibrary.instance.toggle(
                    SavedEntry(
                      id: 'event:$id',
                      title: title ?? 'Event record',
                      type: 'Event record',
                      description: description ?? 'No description provided.',
                      reference: 'Mzizi event ${code ?? id}',
                    ),
                  );
                  setState(() {});
                },
          icon: Icon(
            SavedLibrary.instance.contains('event:$id')
                ? Icons.bookmark
                : Icons.bookmark_border,
          ),
        ),
        onTap: () => _showEventDetail(
          title ?? 'Event record',
          description,
          date,
          status,
          code,
          id,
        ),
      ),
    );
  }

  void _showEventDetail(
    String title,
    String? description,
    String? date,
    String? status,
    String? code,
    String? id,
  ) => showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    builder: (sheetContext) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.titleLarge),
            if (description != null && description.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(description),
            ],
            const SizedBox(height: 14),
            if (date != null) _detailLine('Event date', date),
            if (status != null) _detailLine('Record status', status),
            if (code != null) _detailLine('Record code', code),
            if (id != null) _detailLine('Record ID', id),
            const SizedBox(height: 12),
            Text(
              'The event API does not currently return source citations or place names in this list response.',
              style: TextStyle(color: context.colors.onSurfaceVariant),
            ),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: () => Navigator.pop(sheetContext),
                child: const Text('Close'),
              ),
            ),
          ],
        ),
      ),
    ),
  );

  Widget _detailLine(String label, String value) => Padding(
    padding: const EdgeInsets.only(bottom: 5),
    child: Text('$label: $value'),
  );

  Widget _message({
    required IconData icon,
    required String title,
    required String body,
    String? action,
    VoidCallback? onPressed,
  }) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: context.colors.surfaceContainerLow,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: context.colors.outlineVariant),
    ),
    child: Column(
      children: [
        Icon(icon, color: context.colors.primary),
        const SizedBox(height: 8),
        Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
        const SizedBox(height: 5),
        Text(
          body,
          textAlign: TextAlign.center,
          style: TextStyle(color: context.colors.onSurfaceVariant),
        ),
        if (action != null && onPressed != null) ...[
          const SizedBox(height: 8),
          TextButton(onPressed: onPressed, child: Text(action)),
        ],
      ],
    ),
  );
}
