import 'dart:convert';

import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_ui/mzizi_ui.dart';

/// Who serves a place: officials, procurement, media and the evidence for each claim.
class PlaceProfileScreen extends StatefulWidget {
  const PlaceProfileScreen({super.key});

  @override
  State<PlaceProfileScreen> createState() => _PlaceProfileScreenState();
}

class _PlaceProfileScreenState extends State<PlaceProfileScreen> {
  static const _scalars = <ColumnSpec>[
    ColumnSpec(key: 'languageRequested', label: 'Language Requested'),
    ColumnSpec(key: 'languageServed', label: 'Language Served'),
  ];

  static const _lists = <String, ({String label, List<ColumnSpec> columns})>{
    'chain': (
      label: 'Chain',
      columns: <ColumnSpec>[
        ColumnSpec(key: 'code', label: 'Code'),
        ColumnSpec(key: 'depth', label: 'Depth'),
        ColumnSpec(key: 'featureId', label: 'Feature Id'),
        ColumnSpec(key: 'kindCode', label: 'Kind Code'),
        ColumnSpec(key: 'kindLabel', label: 'Kind Label'),
        ColumnSpec(key: 'name', label: 'Name'),
      ],
    ),
    'media': (
      label: 'Media',
      columns: <ColumnSpec>[
        ColumnSpec(key: 'fileVersionId', label: 'File Version Id'),
        ColumnSpec(key: 'kind', label: 'Kind'),
        ColumnSpec(key: 'mimeType', label: 'Mime Type'),
        ColumnSpec(key: 'title', label: 'Title'),
        ColumnSpec(key: 'url', label: 'Url'),
      ],
    ),
    'officials': (
      label: 'Officials',
      columns: <ColumnSpec>[
        ColumnSpec(key: 'holderId', label: 'Holder Id'),
        ColumnSpec(key: 'leftOfficeOn', label: 'Left Office On'),
        ColumnSpec(key: 'officeCode', label: 'Office Code'),
        ColumnSpec(key: 'officeTitle', label: 'Office Title'),
        ColumnSpec(key: 'partyName', label: 'Party Name'),
        ColumnSpec(key: 'personName', label: 'Person Name'),
        ColumnSpec(key: 'tookOfficeOn', label: 'Took Office On'),
        ColumnSpec(key: 'unitFeatureId', label: 'Unit Feature Id'),
        ColumnSpec(key: 'unitName', label: 'Unit Name'),
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
    final result = await LocalityFeature(MziziApi.connection)
        .getLocality(featureId: featureId);
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
      title: 'Place Profile',
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
