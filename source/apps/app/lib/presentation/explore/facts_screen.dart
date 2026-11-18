import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// Every "Did you know?" fact for Kenya and, when a place is chosen, the ones tagged to it first.
class FactsScreen extends StatelessWidget {
  const FactsScreen({super.key});
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsFactList>(
    reloadKey: 'facts|${UserStore.instance.placeId}',
    load: (_) => InsightsFeature(MziziApi.connection).listFacts(
      input: InsightsFactsInput(
        featureId: UserStore.instance.placeId,
        limit: 100,
      ),
    ),
    builder: (context, d) => PageFrame(
      children: [
        for (final f in asMaps(d.facts))
          GlassCard(
            margin: const EdgeInsets.only(bottom: 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    MzIcon('sparkle', size: 18),
                    const SizedBox(width: 6),
                    if (asText(f['topic']).isNotEmpty) Pill(asText(f['topic'])),
                    if (f['tagged'] == true &&
                        asText(f['place']).isNotEmpty) ...[
                      const SizedBox(width: 6),
                      Pill(asText(f['place'])),
                    ],
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  asText(f['statement']),
                  style: Theme.of(context).textTheme.titleSmall,
                ),
                if (asText(f['detail']).isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      asText(f['detail']),
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ),
              ],
            ),
          ),
        GapsNote(items: d.gaps, topic: t(context, 'facts')),
      ],
    ),
  );
}
