import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:mzizi_app/presentation/widgets/dryv_result.dart';
import 'feature_list_providers.dart';

/// Feature List
///
/// Scaffolded by Dryv once; this screen belongs to the app. Design it here — state and calls stay
/// in the generated feature_list_providers.dart.
class FeatureListScreen extends ConsumerWidget {
  const FeatureListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Feature List')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DryvResultView.async(
            ref.watch(featureListFeaturesProvider),
            select: const <String>['features'],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
