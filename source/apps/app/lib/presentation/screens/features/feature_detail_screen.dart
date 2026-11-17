import 'dart:convert';

import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_ui/mzizi_ui.dart';

/// One geographic feature with its names.
class FeatureDetailScreen extends StatefulWidget {
  const FeatureDetailScreen({super.key});

  @override
  State<FeatureDetailScreen> createState() => _FeatureDetailScreenState();
}

class _FeatureDetailScreenState extends State<FeatureDetailScreen> {
  static const _scalars = <ColumnSpec>[
    ColumnSpec(key: 'code', label: 'Code'),
    ColumnSpec(key: 'featureId', label: 'Feature Id'),
    ColumnSpec(key: 'featureTypeId', label: 'Feature Type Id'),
    ColumnSpec(key: 'validFrom', label: 'Valid From'),
    ColumnSpec(key: 'validUntil', label: 'Valid Until'),
  ];

  static const _lists = <String, ({String label, List<ColumnSpec> columns})>{
    'names': (
      label: 'Names',
      columns: <ColumnSpec>[
        ColumnSpec(key: 'languageTag', label: 'Language Tag'),
        ColumnSpec(key: 'name', label: 'Name'),
      ],
    ),
  };

  Map<String, Object?>? _record;
  String? _error;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _load();
  }

  Future<void> _load() async {
    final address = GoRouterState.of(context).uri.queryParameters;
    final featureId = address['featureId'];
    if (featureId == null) {
      setState(() => _error = 'Missing address value.');
      return;
    }
    final result = await GeographyFeature(MziziApi.connection)
        .getFeature(featureId: featureId);
    if (!mounted) return;
    setState(() {
      if (result.isError) {
        _error = result.message;
        return;
      }
      _error = null;
      _record =
          jsonDecode(jsonEncode(result.dataOrNull)) as Map<String, Object?>?;
    });
  }

  @override
  Widget build(BuildContext context) {
    final record = _record;
    return MziziPageScaffold(
      title: 'Feature Detail',
      children: [
        if (_error != null) Text(_error!),
        if (record != null) ...[
          MziziSection(
            child: MziziDetailList(
              entries: [
                for (final column in _scalars)
                  DetailEntry(
                    label: column.label,
                    value: record[column.key] == null
                        ? null
                        : '${record[column.key]}',
                  ),
              ],
              missingText: 'Not recorded',
            ),
          ),
          for (final entry in _lists.entries)
            MziziSection(
              title: entry.value.label,
              child: MziziRowList(
                columns: entry.value.columns,
                rows: ((record[entry.key] as List?) ?? const [])
                    .cast<Map<String, Object?>>(),
                emptyText: 'None recorded.',
              ),
            ),
        ],
      ],
    );
  }
}
