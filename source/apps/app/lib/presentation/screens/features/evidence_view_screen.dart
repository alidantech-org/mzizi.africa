import 'dart:convert';

import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_ui/mzizi_ui.dart';

/// One citation with its source and files.
class EvidenceViewScreen extends StatefulWidget {
  const EvidenceViewScreen({super.key});

  @override
  State<EvidenceViewScreen> createState() => _EvidenceViewScreenState();
}

class _EvidenceViewScreenState extends State<EvidenceViewScreen> {
  static const _scalars = <ColumnSpec>[
    ColumnSpec(key: 'editionLabel', label: 'Edition Label'),
    ColumnSpec(key: 'quotedText', label: 'Quoted Text'),
    ColumnSpec(key: 'sourceCode', label: 'Source Code'),
    ColumnSpec(key: 'sourceId', label: 'Source Id'),
  ];

  static const _lists = <String, ({String label, List<ColumnSpec> columns})>{
    'files': (
      label: 'Files',
      columns: <ColumnSpec>[
        ColumnSpec(key: 'fileVersionId', label: 'File Version Id'),
        ColumnSpec(key: 'kind', label: 'Kind'),
        ColumnSpec(key: 'mimeType', label: 'Mime Type'),
        ColumnSpec(key: 'title', label: 'Title'),
        ColumnSpec(key: 'url', label: 'Url'),
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
    final citationId = address['citationId'];
    if (citationId == null) {
      setState(() => _error = 'Missing address value.');
      return;
    }
    final result = await LocalityFeature(
      MziziApi.connection,
    ).getEvidence(citationId: citationId);
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
      title: 'Evidence View',
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
