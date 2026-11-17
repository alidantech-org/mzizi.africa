import 'dart:convert';
import 'dart:math';

import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_ui/mzizi_ui.dart';
import 'package:mzizi_app/presentation/paging/geography/browse_features_paging.dart';

/// Browse geographic features, narrowed by feature kind or code prefix.
class FeatureBrowseScreen extends StatefulWidget {
  const FeatureBrowseScreen({super.key});

  @override
  State<FeatureBrowseScreen> createState() => _FeatureBrowseScreenState();
}

class _FeatureBrowseScreenState extends State<FeatureBrowseScreen> {
  static const _pageSize = 20;

  static const _filterFields = <FieldSpec>[
    FieldSpec(name: 'featureTypeId', label: 'Feature Type Id'),
    FieldSpec(name: 'codePrefix', label: 'Code Prefix'),
  ];

  static const _columns = <ColumnSpec>[
    ColumnSpec(key: 'code', label: 'Code'),
    ColumnSpec(key: 'featureId', label: 'Feature Id'),
    ColumnSpec(key: 'featureTypeId', label: 'Feature Type Id'),
    ColumnSpec(key: 'fromToPrecision', label: 'From To Precision'),
    ColumnSpec(key: 'fromYear', label: 'From Year'),
    ColumnSpec(key: 'toYear', label: 'To Year'),
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
    final paging = browseFeaturesPaging;
    if (paging.isPaged) {
      input[paging.limit] = min(_window.limit, paging.maxLimit);
      input[paging.offset] = _window.offset;
    }
    final result = await GeographyFeature(
      MziziApi.connection,
    ).browseFeatures(input: GeographyFeatureWindow.fromJson(input));
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
      _rows = ((json?['features'] as List?) ?? const [])
          .cast<Map<String, Object?>>();
    });
  }

  @override
  Widget build(BuildContext context) {
    return MziziPageScaffold(
      title: 'Feature Browse',
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
                      if (entry.value is String)
                        entry.key: entry.value as String,
                  };
                  context.go(
                    Uri(
                      path: '/feature-detail',
                      queryParameters: values,
                    ).toString(),
                  );
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
