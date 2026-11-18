/// Labelled values of one record, in the order given. A missing value is shown as such, never as blank.
library;

import 'package:material_ui/material_ui.dart';

class DetailEntry {
  const DetailEntry({required this.label, required this.value});

  final String label;
  final String? value;
}

class MziziDetailList extends StatelessWidget {
  const MziziDetailList({
    super.key,
    required this.entries,
    required this.missingText,
  });

  final List<DetailEntry> entries;
  final String missingText;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final entry in entries)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(entry.label, style: theme.textTheme.labelMedium),
                Text(entry.value ?? missingText),
              ],
            ),
          ),
      ],
    );
  }
}
