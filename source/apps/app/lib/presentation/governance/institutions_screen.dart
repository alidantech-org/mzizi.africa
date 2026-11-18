// Backend-defined institution directory, body details and explanatory content library.
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/governance/content_screen.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';
import 'package:mzizi_app/presentation/widgets/media_gallery.dart';
import 'package:mzizi_app/presentation/widgets/state_views.dart';

class InstitutionsScreen extends StatefulWidget {
  const InstitutionsScreen({super.key});
  @override
  State<InstitutionsScreen> createState() => _InstitutionsScreenState();
}

class _InstitutionsScreenState extends State<InstitutionsScreen> {
  String _query = '';
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Tx('Institutions')),
    body: AsyncPage<InsightsInstitutionList>(
      reloadKey: 'institutions',
      load: (_) => InsightsFeature(MziziApi.connection).listInstitutions(),
      builder: (context, raw) {
        final arms = raw.arms.map(InstitutionArm.parse).toList();
        return ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Tx(
              'Understand public bodies',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            const Tx('What they do, who leads them and the law behind them.'),
            const SizedBox(height: 18),
            TextField(
              onChanged: (v) => setState(() => _query = v),
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search),
                hintText: t(context, 'Find an institution'),
              ),
            ),
            const SizedBox(height: 16),
            if (arms.every((a) => a.institutions.where(_matches).isEmpty))
              const EmptyState(
                icon: 'parliament',
                title: 'No institutions match your search.',
              ),
            for (final arm in arms)
              if (arm.institutions.any(_matches)) ...[
                Padding(
                  padding: const EdgeInsets.only(top: 18, bottom: 6),
                  child: Text(
                    arm.label,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ),
                Text(arm.about, style: Theme.of(context).textTheme.bodySmall),
                const SizedBox(height: 10),
                for (final body in arm.institutions.where(_matches))
                  InstitutionRow(item: body),
              ],
            GapsNote(items: raw.gaps, topic: 'institutions'),
          ],
        );
      },
    ),
  );
  bool _matches(InstitutionItem item) =>
      '${item.name} ${item.purpose} ${item.kind}'.toLowerCase().contains(
        _query.toLowerCase(),
      );
}

class InstitutionRow extends StatelessWidget {
  const InstitutionRow({super.key, required this.item});
  final InstitutionItem item;
  @override
  Widget build(BuildContext context) => Column(
    children: [
      ListTile(
        contentPadding: const EdgeInsets.symmetric(vertical: 8),
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: NetImage(item.image, width: 52, height: 52),
        ),
        title: Text(item.name),
        subtitle: Text(
          item.purpose.isEmpty ? item.kind : item.purpose,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () =>
            context.push('/institutions/${Uri.encodeComponent(item.code)}'),
      ),
      const Divider(height: 1),
    ],
  );
}

class InstitutionScreen extends StatelessWidget {
  const InstitutionScreen({super.key, required this.code});
  final String code;
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Tx('Institution')),
    body: AsyncPage<InsightsInstitutionDetail>(
      reloadKey: 'institution|$code',
      loading: const LoadingView(layout: LoadingLayout.article),
      load: (_) =>
          InsightsFeature(MziziApi.connection).getInstitution(code: code),
      builder: (context, raw) {
        final d = InstitutionDocument(raw),
            body = InstitutionDocument(raw).institution;
        return ListView(
          padding: const EdgeInsets.all(20),
          children: [
            if (body.name.isEmpty)
              const EmptyState(
                icon: 'parliament',
                title: 'This institution is not recorded yet.',
              )
            else ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(22),
                child: NetImage(
                  body.image,
                  width: double.infinity,
                  height: 170,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                body.name,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: [
                  for (final label in [
                    body.arm,
                    body.kind,
                    body.basis,
                  ].where((e) => e.isNotEmpty))
                    Chip(label: Text(label)),
                ],
              ),
              const SizedBox(height: 10),
              Text(body.purpose, style: Theme.of(context).textTheme.bodyLarge),
              const DevelopmentNotice(),
              FilledButton.icon(
                onPressed: () => context.push(
                  '/leaders-tree?institution=${Uri.encodeComponent(code)}',
                ),
                icon: const Icon(Icons.account_tree_outlined),
                label: const Tx('Explore leadership tree'),
              ),
              if (body.functions.isNotEmpty) ...[
                const SizedBox(height: 20),
                Tx(
                  'What it does',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                for (final function in body.functions)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('•  '),
                        Expanded(child: Text(function)),
                      ],
                    ),
                  ),
              ],
              if (d.leaders.isNotEmpty) ...[
                const SizedBox(height: 20),
                Tx('Leadership', style: Theme.of(context).textTheme.titleLarge),
                for (final leader in d.leaders) ...[
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Portrait(
                      name: leader.name,
                      url: leader.photo,
                      size: 44,
                    ),
                    title: Text(leader.name),
                    subtitle: Text('${leader.title} · ${leader.how}'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => context.push('/leader/${leader.id}'),
                  ),
                  const Divider(height: 1),
                ],
              ] else
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 18),
                  child: Tx('No office holders are recorded yet.'),
                ),
              for (final item in d.content) ...[
                const SizedBox(height: 22),
                ExplanationBody(item: item),
              ],
              LegalBasisList(items: d.legal),
              if (d.parents.isNotEmpty) ...[
                const SizedBox(height: 22),
                Tx(
                  'Related bodies',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                for (final parent in d.parents) InstitutionRow(item: parent),
              ],
              if (d.children.isNotEmpty) ...[
                const SizedBox(height: 22),
                Tx(
                  'Bodies within this institution',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                for (final child in d.children) InstitutionRow(item: child),
              ],
            ],
            GapsNote(items: raw.gaps, topic: body.name),
          ],
        );
      },
    ),
  );
}

class ContentLibraryScreen extends StatelessWidget {
  const ContentLibraryScreen({
    super.key,
    this.category,
    this.title = 'Read & understand',
  });
  final String? category;
  final String title;
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Tx(title)),
    body: AsyncPage<InsightsContentList>(
      reloadKey: 'content-library|$category',
      load: (language) => InsightsFeature(MziziApi.connection).listContent(
        input: InsightsContentListInput(
          category: category,
          languageCode: language,
          limit: 200,
        ),
      ),
      builder: (context, raw) {
        final items = raw.items.map(ContentItem.parse).toList();
        return ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Tx(title, style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 8),
            const Tx(
              'Explore explanations and the evidence behind public life.',
            ),
            const DevelopmentNotice(),
            if (items.isEmpty)
              const EmptyState(
                icon: 'book',
                title: 'No explanations are recorded in this language yet.',
              ),
            for (final item in items) ...[
              ListTile(
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
                leading: const Icon(Icons.menu_book_outlined),
                title: Text(item.title),
                subtitle: Text(
                  item.summary,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => context.push(
                  '/content?slug=${Uri.encodeQueryComponent(item.slug)}',
                ),
              ),
              const Divider(height: 1),
            ],
            GapsNote(items: raw.gaps, topic: title),
          ],
        );
      },
    ),
  );
}
