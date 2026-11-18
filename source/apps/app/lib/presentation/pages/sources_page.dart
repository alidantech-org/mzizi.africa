import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';

/// The datasets and documents behind the platform, filterable by text. Hand-built.
class SourcesPage extends ConsumerStatefulWidget {
  const SourcesPage({super.key});

  @override
  ConsumerState<SourcesPage> createState() => _SourcesPageState();
}

class _SourcesPageState extends ConsumerState<SourcesPage> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    final text = Theme.of(context).textTheme;
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          tr(language, 'sources'),
          style: text.headlineMedium?.copyWith(fontFamily: 'Georgia'),
        ),
        const SizedBox(height: 6),
        Text(tr(language, 'sourcesBody'), style: text.bodyMedium),
        const SizedBox(height: 14),
        TextField(
          onChanged: (value) => setState(() => _query = value.trim()),
          decoration: InputDecoration(
            hintText: tr(language, 'filterSources'),
            prefixIcon: MzIcon('filter'),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(32)),
            filled: true,
          ),
        ),
        const SizedBox(height: 12),
        AsyncPage<LocalitySourceCollection>(
          reloadKey: _query,
          load: (_) => LocalityFeature(MziziApi.connection).browseSources(
            input: LocalitySourceSearchInput(
              query: _query.isEmpty ? null : _query,
              limit: 60,
            ),
          ),
          builder: (context, result) => Column(
            children: [
              for (final source in result.sources)
                Card(
                  child: ListTile(
                    title: Text(source.name),
                    subtitle: Text(source.publisherName ?? source.code),
                    trailing: Text(
                      '${source.artifactCount} ${tr(language, 'files')}\n${source.citationCount} ${tr(language, 'citations')}',
                      textAlign: TextAlign.end,
                      style: text.bodySmall,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
