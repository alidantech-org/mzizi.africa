// A connected, pannable governance tree driven by backend categories, bodies, edges and level references.
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/governance/content_screen.dart';
import 'package:mzizi_app/presentation/governance/parse/documents.dart';
import 'package:mzizi_app/presentation/governance/graph_selection.dart';
import 'package:mzizi_app/presentation/governance/tree_canvas.dart';
import 'package:mzizi_app/presentation/governance/node_sheet.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';
import 'package:mzizi_app/presentation/widgets/async_page.dart';
import 'package:mzizi_app/presentation/widgets/state_views.dart';

class LeaderTreeScreen extends StatefulWidget {
  const LeaderTreeScreen({super.key, this.institution});
  final String? institution;
  @override
  State<LeaderTreeScreen> createState() => _LeaderTreeScreenState();
}

class _LeaderTreeScreenState extends State<LeaderTreeScreen> {
  String? _category, _institution, _level;
  bool _levelWasChosen = false;
  @override
  void initState() {
    super.initState();
    _institution = widget.institution;
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Tx('Your leaders'),
      actions: [
        IconButton(
          tooltip: t(context, 'Institutions'),
          icon: const Icon(Icons.account_balance_outlined),
          onPressed: () => context.push('/institutions'),
        ),
      ],
    ),
    body: AsyncPage<InsightsGovernanceTabs>(
      reloadKey: 'governance-menu',
      load: (_) => InsightsFeature(MziziApi.connection).getGovernanceTabs(),
      builder: (context, raw) {
        final menu = GovernanceMenu(raw);
        final selected =
            _category ??
            (_institution == null && menu.categories.isNotEmpty
                ? menu.categories.first.code
                : null);
        final bodyNames = [
          for (final arm in menu.arms) ...arm.institutions,
        ].where((i) => i.code == _institution);
        final bodyName = bodyNames.isEmpty
            ? t(context, 'All institutions')
            : bodyNames.first.name;
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.account_balance_outlined),
                  label: Text(
                    bodyName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  onPressed: () => _pickInstitution(context, menu),
                ),
              ),
            ),
            if (menu.categories.isNotEmpty)
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    if (_institution != null)
                      Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: const Tx('All office holders'),
                          selected: selected == null,
                          onSelected: (_) => setState(() {
                            _category = null;
                            _levelWasChosen = false;
                          }),
                        ),
                      ),
                    for (final category in menu.categories)
                      Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(category.label),
                          selected: selected == category.code,
                          onSelected: (_) => setState(() {
                            _category = category.code;
                            _levelWasChosen = false;
                          }),
                        ),
                      ),
                  ],
                ),
              ),
            Expanded(
              child: AsyncPage<InsightsGovernanceTree>(
                reloadKey:
                    'gov-tree|$selected|$_institution|${UserStore.instance.placeId}',
                loading: const LoadingView(layout: LoadingLayout.tree),
                load: (_) =>
                    InsightsFeature(MziziApi.connection).getGovernanceTree(
                      input: InsightsGovTreeInput(
                        tab: selected,
                        institution: _institution,
                        featureId: _institution == null
                            ? UserStore.instance.placeId
                            : null,
                      ),
                    ),
                builder: (context, tree) =>
                    _tree(context, GovernanceDocument(tree)),
              ),
            ),
          ],
        );
      },
    ),
  );

  Widget _tree(BuildContext context, GovernanceDocument document) {
    if (document.nodes.isEmpty) {
      return ListView(
        children: [
          const EmptyState(
            icon: 'tree',
            title: 'No leaders are recorded for this selection.',
            body: 'Choose another category or institution.',
          ),
          GapsNote(items: document.gaps, topic: 'leaders'),
        ],
      );
    }
    final levelCode = _levelWasChosen
        ? _level
        : preferredGovernanceLevel(document);
    final selection = GovernanceSelection(document, levelCode);
    final active = document.levels.where((l) => l.code == levelCode);
    return Column(
      children: [
        if (document.category.about.isNotEmpty)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
            child: Text(
              document.category.about,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              const Icon(Icons.pinch_outlined, size: 16),
              const SizedBox(width: 6),
              Expanded(
                child: Tx(
                  'Drag to explore. Pinch to zoom. Tap a person or body.',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
            ],
          ),
        ),
        if (active.isNotEmpty)
          Padding(
            padding: const EdgeInsets.all(10),
            child: Text(
              active.first.about,
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
        Expanded(
          child: selection.nodes.isEmpty
              ? ListView(
                  children: [
                    const EmptyState(
                      icon: 'tree',
                      title: 'No leaders are recorded at this level.',
                      body: 'Choose another level below.',
                    ),
                  ],
                )
              : GovernanceCanvas(
                  selection: selection,
                  selectionKey:
                      '${document.category.code}|$_institution|$levelCode|${UserStore.instance.placeId}',
                  onNode: (node) => showGovernanceNode(context, node),
                ),
        ),
        if (levelCode != null && selection.hiddenRelationships > 0)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 6, 16, 0),
            child: Tx(
              'Only relationships within the selected level are shown.',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
        SafeArea(
          top: false,
          bottom: false,
          child: SingleChildScrollView(
            key: const ValueKey('tree-level-controls'),
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                _levelButton(
                  context,
                  null,
                  t(context, 'All levels'),
                  true,
                  levelCode,
                ),
                for (final level in document.levels)
                  _levelButton(
                    context,
                    level.code,
                    level.label,
                    level.count > 0,
                    levelCode,
                  ),
              ],
            ),
          ),
        ),
        TextButton.icon(
          icon: const Icon(Icons.info_outline),
          label: const Tx('How to read this tree'),
          onPressed: () => showModalBottomSheet<void>(
            context: context,
            isScrollControlled: true,
            showDragHandle: true,
            builder: (context) => DraggableScrollableSheet(
              expand: false,
              initialChildSize: 0.65,
              builder: (context, controller) => ListView(
                controller: controller,
                padding: const EdgeInsets.all(20),
                children: [
                  Tx(
                    'How to read this tree',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  for (final legend in document.legend)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Text(legend.label),
                    ),
                  GapsNote(items: document.gaps, topic: 'leaders'),
                  const DevelopmentNotice(),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _levelButton(
    BuildContext context,
    String? code,
    String label,
    bool available,
    String? selectedLevel,
  ) => Padding(
    padding: const EdgeInsets.only(right: 8),
    child: ChoiceChip(
      key: ValueKey('tree-level-${code ?? 'all'}'),
      label: Text(label),
      avatar: Icon(
        available ? Icons.layers_outlined : Icons.layers_clear_outlined,
        size: 18,
      ),
      selected: selectedLevel == code,
      onSelected: (_) => setState(() {
        _level = code;
        _levelWasChosen = true;
      }),
    ),
  );

  Future<void> _pickInstitution(
    BuildContext context,
    GovernanceMenu menu,
  ) async {
    final result = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.8,
        minChildSize: 0.4,
        maxChildSize: 0.95,
        builder: (context, controller) => ListView(
          controller: controller,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          children: [
            Tx(
              'Choose an institution',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            ListTile(
              title: const Tx('All institutions'),
              trailing: const Icon(Icons.account_tree_outlined),
              onTap: () => Navigator.pop(context, ''),
            ),
            for (final arm in menu.arms) ...[
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: Text(
                  arm.label,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              for (final institution in arm.institutions)
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(institution.name),
                  subtitle: Text(institution.kind),
                  onTap: () => Navigator.pop(context, institution.code),
                ),
            ],
          ],
        ),
      ),
    );
    if (result != null && mounted) {
      setState(() {
        _institution = result.isEmpty ? null : result;
        _category = null;
        _level = null;
        _levelWasChosen = false;
      });
    }
  }
}
