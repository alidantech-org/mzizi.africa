import 'dart:convert';
import 'dart:math';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_ui/mzizi_ui.dart';
import 'package:mzizi_app/presentation/paging/locality/search_localities_paging.dart';

/// Find a place by name and open its profile.
class PlaceSearchScreen extends StatefulWidget {
  const PlaceSearchScreen({super.key});

  @override
  State<PlaceSearchScreen> createState() => _PlaceSearchScreenState();
}

class _PlaceSearchScreenState extends State<PlaceSearchScreen> {
  static const _pageSize = 20;

  static const _filterFields = <FieldSpec>[
    FieldSpec(name: 'query', label: 'Query'),
  ];

  static const _columns = <ColumnSpec>[
    ColumnSpec(key: 'code', label: 'Code'),
    ColumnSpec(key: 'depth', label: 'Depth'),
    ColumnSpec(key: 'featureId', label: 'Feature Id'),
    ColumnSpec(key: 'kindCode', label: 'Kind Code'),
    ColumnSpec(key: 'kindLabel', label: 'Kind Label'),
    ColumnSpec(key: 'name', label: 'Name'),
  ];

  Map<String, String> _filters = const {};
  PageWindow _window = const PageWindow(limit: _pageSize, offset: 0);
  List<Map<String, Object?>> _rows = const [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final input = <String, Object?>{
      for (final entry in _filters.entries)
        if (entry.value.isNotEmpty) entry.key: entry.value,
    };
    final paging = searchLocalitiesPaging;
    if (paging.isPaged) {
      input[paging.limit] = min(_window.limit, paging.maxLimit);
      input[paging.offset] = _window.offset;
    }
    final result = await LocalityFeature(MziziApi.connection).searchLocalities(
      input: LocalitySearchInput.fromJson(input),
    );
    if (!mounted) return;
    setState(() {
      if (result.isError) {
        _error = result.message;
        _rows = const [];
        return;
      }
      _error = null;
      final json =
          jsonDecode(jsonEncode(result.dataOrNull)) as Map<String, Object?>?;
      _rows = ((json?['places'] as List?) ?? const [])
          .cast<Map<String, Object?>>();
    });
  }

  @override
  Widget build(BuildContext context) {
    return MziziPageScaffold(
      title: 'Place Search',
      children: [
        MziziSection(
          child: MziziFilterBar(
            fields: _filterFields,
            initial: _filters,
            submitLabel: 'Apply',
            onSubmit: (values) {
              _filters = values;
              _window = PageWindow(limit: _window.limit, offset: 0);
              _load();
            },
          ),
        ),
        MziziSection(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (_error != null) Text(_error!),
              MziziRowList(
                columns: _columns,
                rows: _rows,
                emptyText: 'Nothing matches.',
                onOpen: (row) {
                  // The row's text values travel as the target's context values, matched by name.
                  final values = <String, String>{
                    for (final entry in row.entries)
                      if (entry.value is String) entry.key: entry.value as String,
                  };
                  context.go(Uri(path: '/place-profile', queryParameters: values).toString());
                },
              ),
              MziziPaginationBar(
                window: _window,
                received: _rows.length,
                onChange: (window) {
                  _window = window;
                  _load();
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}