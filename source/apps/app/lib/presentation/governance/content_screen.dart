// Native, selectable Markdown explanations and reviewable legal foundations.
import 'package:flutter/services.dart';
import 'package:flutter_markdown_plus/flutter_markdown_plus.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';
import 'package:mzizi_app/presentation/widgets/media_gallery.dart';
import 'package:mzizi_app/presentation/widgets/state_views.dart';

class ContentScreen extends StatelessWidget {
  const ContentScreen({
    super.key,
    this.slug,
    this.subjectTable,
    this.subjectCode,
    this.title = 'Read & understand',
  });
  final String? slug, subjectTable, subjectCode;
  final String title;
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Tx(title)),
    body: AsyncPage<InsightsContentPage>(
      reloadKey: 'content|$slug|$subjectTable|$subjectCode',
      loading: const LoadingView(layout: LoadingLayout.article),
      load: (language) => InsightsFeature(MziziApi.connection).getContent(
        input: InsightsContentInput(
          slug: slug,
          subjectTable: subjectTable,
          subjectCode: subjectCode,
          languageCode: language,
        ),
      ),
      builder: (context, raw) {
        final item = ContentItem.parse(raw.content);
        return ListView(
          padding: const EdgeInsets.all(20),
          children: [
            if (raw.content == null)
              const EmptyState(
                icon: 'book',
                title: 'No explanation is recorded yet.',
              )
            else ...[
              if (item.image.isNotEmpty)
                ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: NetImage(
                    item.image,
                    height: 180,
                    width: double.infinity,
                  ),
                ),
              const SizedBox(height: 16),
              Text(
                item.title,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 10),
              if (item.development) const DevelopmentNotice(),
              if (item.tags.isNotEmpty)
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: [
                    for (final tag in item.tags) Chip(label: Text(tag)),
                  ],
                ),
              const SizedBox(height: 14),
              ExplanationBody(item: item),
              if (item.subjectCode.isNotEmpty &&
                  item.subjectTable != 'legal.provisions' &&
                  item.subjectTable != 'legal.instruments')
                LegalBasisSection(
                  subjectTable: item.subjectTable,
                  subjectCode: item.subjectCode,
                ),
            ],
            if (raw.related.isNotEmpty) ...[
              const SizedBox(height: 24),
              Tx(
                'Continue reading',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              for (final related in raw.related.map(ContentItem.parse)) ...[
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(related.title),
                  subtitle: related.summary.isEmpty
                      ? null
                      : Text(
                          related.summary,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => context.push(
                    '/content?slug=${Uri.encodeQueryComponent(related.slug)}',
                  ),
                ),
                const Divider(height: 1),
              ],
            ],
            GapsNote(items: raw.gaps, topic: title),
          ],
        );
      },
    ),
  );
}

class DevelopmentNotice extends StatelessWidget {
  const DevelopmentNotice({super.key, this.compact = false});
  final bool compact;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 12),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          Icons.info_outline,
          size: 18,
          color: Theme.of(context).colorScheme.tertiary,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Tx(
            compact
                ? 'Development preview: some figures are illustrative and unverified.'
                : 'Development content. Names, explanations and figures may be illustrative and are not verified public records.',
            style: compact ? Theme.of(context).textTheme.bodySmall : null,
          ),
        ),
      ],
    ),
  );
}

class ExplanationBody extends StatelessWidget {
  const ExplanationBody({super.key, required this.item});
  final ContentItem item;
  @override
  Widget build(BuildContext context) => MarkdownBody(
    data: item.body.isEmpty ? item.summary : item.body,
    selectable: true,
    imageBuilder: (uri, title, alt) =>
        NetImage(uri.toString(), width: double.infinity, height: 200),
    onTapLink: (text, href, title) {
      if (href == null) return;
      final uri = Uri.tryParse(href);
      if (uri == null) return;
      if (href.startsWith('/') && !href.startsWith('//')) {
        context.push(href);
      } else if (uri.scheme == 'https' || uri.scheme == 'http') {
        showModalBottomSheet<void>(
          context: context,
          showDragHandle: true,
          builder: (context) => SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(text, style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 12),
                  SelectableText(href),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: href));
                      Navigator.pop(context);
                    },
                    icon: const Icon(Icons.copy),
                    label: const Tx('Copy source link'),
                  ),
                ],
              ),
            ),
          ),
        );
      }
    },
  );
}

class LegalBasisSection extends StatelessWidget {
  const LegalBasisSection({
    super.key,
    required this.subjectTable,
    required this.subjectCode,
  });
  final String subjectTable, subjectCode;
  @override
  Widget build(BuildContext context) => AsyncPage<InsightsLegalBasis>(
    reloadKey: 'legal|$subjectTable|$subjectCode',
    loading: const LoadingView(layout: LoadingLayout.compact),
    load: (_) => InsightsFeature(MziziApi.connection).getLegalBasis(
      input: InsightsLegalBasisInput(
        subjectTable: subjectTable,
        subjectCode: subjectCode,
      ),
    ),
    builder: (context, raw) => LegalBasisList(
      items: raw.items.map(LegalItem.parse).toList(),
      gaps: raw.gaps,
    ),
  );
}

class LegalBasisList extends StatelessWidget {
  const LegalBasisList({super.key, required this.items, this.gaps = const []});
  final List<LegalItem> items;
  final List<String> gaps;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const SizedBox(height: 20),
      Tx('Legal basis', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: 8),
      if (items.isEmpty)
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 16),
          child: Tx('No legal reference is recorded yet.'),
        ),
      for (final item in items) ...[
        ExpansionTile(
          tilePadding: EdgeInsets.zero,
          title: Text(
            [
                  item.designation,
                  item.heading,
                ].where((e) => e.isNotEmpty).join(' · ').isEmpty
                ? item.instrument
                : [
                    item.designation,
                    item.heading,
                  ].where((e) => e.isNotEmpty).join(' · '),
          ),
          subtitle: Text(item.instrument),
          childrenPadding: const EdgeInsets.only(bottom: 16),
          expandedCrossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (item.excerpt.isNotEmpty) SelectableText(item.excerpt),
            if (item.explanation.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(item.explanation),
              ),
            const SizedBox(height: 8),
            Text(
              tf(context, 'Review status: {}', [
                item.status.isEmpty
                    ? t(context, 'Not recorded yet')
                    : item.status,
              ]),
              style: Theme.of(context).textTheme.bodySmall,
            ),
            if (item.provisionCode.isEmpty)
              const Tx(
                'The full legal provision is not available in this record.',
              )
            else
              TextButton.icon(
                onPressed: () => context.push(
                  '/content?slug=${Uri.encodeQueryComponent('legal/${item.provisionCode}')}',
                ),
                icon: const Icon(Icons.menu_book_outlined),
                label: const Tx('Read full provision'),
              ),
          ],
        ),
        const Divider(height: 1),
      ],
      GapsNote(items: gaps, topic: 'legal basis'),
    ],
  );
}
