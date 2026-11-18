/// Rows as tiles: the first column is the title and the others are labelled lines under it. A row can be
/// opened; an empty list says so instead of showing nothing.
library;

import 'package:material_ui/material_ui.dart';
import 'package:mzizi_ui/src/types.dart';

class MziziRowList extends StatelessWidget {
  const MziziRowList({
    super.key,
    required this.columns,
    required this.rows,
    required this.emptyText,
    this.onOpen,
  });

  final List<ColumnSpec> columns;
  final List<Map<String, Object?>> rows;
  final String emptyText;
  final void Function(Map<String, Object?> row)? onOpen;

  String _cell(Map<String, Object?> row, String key) => '${row[key] ?? ''}';

  @override
  Widget build(BuildContext context) {
    if (rows.isEmpty) return Text(emptyText);
    return Column(
      children: [
        for (final row in rows)
          ListTile(
            title: Text(_cell(row, columns.first.key)),
            subtitle: Text(
              [
                for (final column in columns.skip(1))
                  if (_cell(row, column.key).isNotEmpty)
                    '${column.label}: ${_cell(row, column.key)}',
              ].join('\n'),
            ),
            isThreeLine: columns.length > 2,
            onTap: onOpen == null ? null : () => onOpen!(row),
          ),
      ],
    );
  }
}
