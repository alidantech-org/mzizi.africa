import 'package:flutter/material.dart';

import '../data/sample_data_store.dart';
import '../screens/sample_data_screen.dart';

/// An immediately visible, clearly labeled offline sample dashboard card.
class SampleOverviewPanel extends StatelessWidget {
  const SampleOverviewPanel({super.key});

  static const _store = SampleDataStore();

  @override
  Widget build(BuildContext context) => FutureBuilder<SampleDocument>(
    future: _store.load(SampleTopic.statistics),
    builder: (context, snapshot) {
      if (!snapshot.hasData) {
        if (snapshot.hasError) {
          return const Card(
            child: ListTile(
              title: Text('Sample data unavailable'),
              subtitle: Text('Verify the bundled sample data assets.'),
            ),
          );
        }
        return const Padding(
          padding: EdgeInsets.all(14),
          child: Center(child: CircularProgressIndicator()),
        );
      }
      final data = snapshot.data!.data;
      final indicator = data['indicator'] as Map<String, dynamic>;
      final points = (data['points'] as List).cast<Map<String, dynamic>>();
      final values = points.map((p) => p['value']).whereType<num>().toList();
      final peak = values.isEmpty
          ? 0
          : values.reduce((a, b) => a > b ? a : b);
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.science_outlined, size: 18),
                  SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'SAMPLE DATA · FICTIONAL',
                      style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                indicator['name']?.toString() ?? 'Example indicator',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
              ),
              Text('Values are for layout testing only · ' +
                  (indicator['unitOfMeasure']?.toString() ?? 'units')),
              const SizedBox(height: 12),
              for (final p in points)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    children: [
                      SizedBox(width: 44, child: Text(p['period'].toString())),
                      Expanded(
                        child: p['value'] is num && peak > 0
                            ? LinearProgressIndicator(
                                value: ((p['value'] as num) / peak)
                                    .clamp(0.0, 1.0)
                                    .toDouble(),
                                minHeight: 10,
                                borderRadius: BorderRadius.circular(5),
                              )
                            : const Text('No data', textAlign: TextAlign.center),
                      ),
                      SizedBox(
                        width: 48,
                        child: Text(
                          p['value']?.toString() ?? '—',
                          textAlign: TextAlign.end,
                        ),
                      ),
                    ],
                  ),
                ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton.icon(
                  onPressed: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const SampleDataScreen(
                        initialTopic: SampleTopic.statistics,
                      ),
                    ),
                  ),
                  icon: const Icon(Icons.open_in_new, size: 16),
                  label: const Text('Explore all sample data'),
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}
