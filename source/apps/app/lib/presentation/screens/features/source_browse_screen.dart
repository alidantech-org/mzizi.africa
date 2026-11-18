import 'dart:convert';
import 'dart:math';

import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_ui/mzizi_ui.dart';
import 'package:mzizi_app/presentation/paging/locality/browse_sources_paging.dart';

/// The data sources behind the platform.
class SourceBrowseScreen extends StatefulWidget {
  const SourceBrowseScreen({super.key});

  @override
  State<SourceBrowseScreen> createState() => _SourceBrowseScreenState();
}

class _SourceBrowseScreenState extends State<SourceBrowseScreen> {
  static const _pageSize = 20;

  static const _filterFields = <FieldSpec>[
    FieldSpec(name: 'query', label: 'Query'),
  ];

  static const _columns = <ColumnSpec>[
    ColumnSpec(key: 'artifactCount', label: 'Artifact Count'),
    ColumnSpec(key: 'citationCount', label: 'Citation Count'),
    ColumnSpec(key: 'code', label: 'Code'),
    ColumnSpec(key: 'name', label: 'Name'),
    ColumnSpec(key: 'publisherName', label: 'Publisher Name'),
    ColumnSpec(key: 'sourceId', label: 'Source Id'),
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
    final paging = browseSourcesPaging;
    if (paging.isPaged) {
      input[paging.limit] = min(_window.limit, paging.maxLimit);
      input[paging.offset] = _window.offset;
    }
    final result = await LocalityFeature(
      MziziApi.connection,
    ).browseSources(input: LocalitySourceSearchInput.fromJson(input));
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
      _rows = ((json?['sources'] as List?) ?? const [])
          .cast<Map<String, Object?>>();
    });
  }

  @override
  Widget build(BuildContext context) {
    return MziziPageScaffold(
      title: 'Source Browse',
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
