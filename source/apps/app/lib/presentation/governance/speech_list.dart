// Recorded speeches as readable, divided contributions with explicit development provenance.
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/governance/content_screen.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

class SpeechList extends StatelessWidget {
  const SpeechList({super.key, required this.items});
  final List<SpeechItem> items;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const SizedBox(height: 24),
      Tx(
        'Speeches & contributions',
        style: Theme.of(context).textTheme.titleLarge,
      ),
      if (items.isEmpty)
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 16),
          child: Tx('No speeches are recorded here yet.'),
        )
      else ...[
        const DevelopmentNotice(),
        for (final speech in items) ...[
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (speech.name.isNotEmpty)
                  Text(
                    speech.name,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                if (speech.motion.isNotEmpty)
                  Text(
                    speech.motion,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                if (speech.date.isNotEmpty)
                  Text(
                    speech.date,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                const SizedBox(height: 8),
                SelectableText(speech.summary),
                if (speech.words != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      tf(context, '{} words', [speech.words]),
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ),
                if (speech.holderId.isNotEmpty)
                  TextButton(
                    onPressed: () => context.push('/leader/${speech.holderId}'),
                    child: const Tx('View leader'),
                  ),
                if (speech.motionCode.isNotEmpty)
                  TextButton(
                    onPressed: () =>
                        context.push('/motion/${speech.motionCode}'),
                    child: const Tx('View debate'),
                  ),
              ],
            ),
          ),
          const Divider(height: 1),
        ],
      ],
    ],
  );
}
