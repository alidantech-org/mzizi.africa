import 'package:material_ui/material_ui.dart';
import 'package:mzizi_api/api.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/insights/kit.dart';

/// A place chosen in the picker: its id, name and kind code.
typedef PickedPlace = ({String id, String name, String kind});

/// Picks a place the way the website's Places page does: start at the counties, tap one to narrow to what is inside it
/// (constituencies, sub-counties, wards and so on) and choose at any level. A search box finds a place by name and an
/// optional button uses the phone's position.
class PlacePicker extends StatefulWidget {
  const PlacePicker({
    super.key,
    required this.onPicked,
    this.onLocate,
    this.scrollController,
  });
  final void Function(PickedPlace place) onPicked;
  final Future<void> Function()? onLocate;
  final ScrollController? scrollController;

  @override
  State<PlacePicker> createState() => _PlacePickerState();
}

class _PlacePickerState extends State<PlacePicker> {
  InsightsPlaceBrowse? _level;
  bool _loading = true;
  bool _failed = false;
  String _query = '';
  List<LocalityLocalityUnit> _matches = const [];
  bool _locating = false;

  @override
  void initState() {
    super.initState();
    _open(null);
  }

  Future<void> _open(String? featureId) async {
    setState(() {
      _loading = true;
      _failed = false;
    });
    final r = await InsightsFeature(
      MziziApi.connection,
    ).browsePlaces(input: InsightsBrowseInput(featureId: featureId));
    if (!mounted) return;
    setState(() {
      _level = r.dataOrNull;
      _failed = r.dataOrNull == null;
      _loading = false;
    });
  }

  Future<void> _search(String q) async {
    _query = q;
    if (q.trim().length < 2) return setState(() => _matches = const []);
    final r = await LocalityFeature(MziziApi.connection).searchLocalities(
      input: LocalitySearchInput(query: q.trim(), languageCode: uiLanguage),
    );
    if (mounted && _query == q) {
      setState(() => _matches = r.dataOrNull?.places ?? const []);
    }
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final scheme = Theme.of(context).colorScheme;
    final level = _level;
    final atRoot = level == null || level.chain.length <= 1;
    final searching = _query.trim().length >= 2;
    return ListView(
      controller: widget.scrollController,
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
      children: [
        TextField(
          onChanged: _search,
          textInputAction: TextInputAction.search,
          decoration: InputDecoration(
            hintText: t(context, 'Search a county, town or ward'),
            prefixIcon: MzIcon('search'),
            filled: true,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(32),
              borderSide: BorderSide.none,
            ),
          ),
        ),
        if (widget.onLocate != null)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: OutlinedButton.icon(
              icon: _locating
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : MzIcon('locate', size: 18),
              label: Tx('Use my location'),
              onPressed: _locating
                  ? null
                  : () async {
                      setState(() => _locating = true);
                      await widget.onLocate!();
                      if (mounted) setState(() => _locating = false);
                    },
            ),
          ),
        const SizedBox(height: 12),
        if (searching) ...[
          for (final m in _matches.take(15))
            _Row(
              title: m.name,
              subtitle: m.kindLabel,
              onTap: () => widget.onPicked((
                id: m.featureId,
                name: m.name,
                kind: m.kindCode,
              )),
              trailing: MzIcon('check', size: 18),
            ),
          if (_matches.isEmpty)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Tx('No places match.'),
            ),
        ] else ...[
          if (level != null && !atRoot) ...[
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  for (var i = 0; i < level.chain.length; i++) ...[
                    if (i > 0)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 2),
                        child: MzIcon('chevron-right', size: 14),
                      ),
                    ActionChip(
                      label: Text(
                        i == 0 ? t(context, 'Kenya') : level.chain[i].name,
                      ),
                      visualDensity: VisualDensity.compact,
                      onPressed: i == level.chain.length - 1
                          ? null
                          : () =>
                                _open(i == 0 ? null : level.chain[i].featureId),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 10),
            FilledButton.icon(
              icon: MzIcon('check', size: 18, color: scheme.onPrimary),
              label: Text(tf(context, 'Choose {}', [level.chain.last.name])),
              onPressed: () {
                final p = level.chain.last;
                widget.onPicked((
                  id: p.featureId,
                  name: p.name,
                  kind: p.kindCode,
                ));
              },
            ),
            const SizedBox(height: 14),
          ],
          if (level != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Text(
                atRoot
                    ? t(context, 'Counties of Kenya')
                    : tf(context, 'Inside {}', [level.chain.last.name]),
                style: text.titleSmall,
              ),
            ),
          if (_loading)
            const Padding(
              padding: EdgeInsets.all(32),
              child: Center(child: CircularProgressIndicator()),
            ),
          if (_failed)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Tx('Could not load places. Check your connection.'),
            ),
          if (!_loading && level != null) ...[
            for (final c in level.children)
              _Row(
                title: c.name,
                subtitle: [
                  c.kindLabel,
                  if (c.population != null)
                    '${compact(c.population)} ${t(context, 'people')}',
                ].join(' · '),
                badge: c.childCount > 0
                    ? tf(context, '{} inside', [c.childCount])
                    : null,
                onTap: c.childCount > 0
                    ? () => _open(c.featureId)
                    : () => widget.onPicked((
                        id: c.featureId,
                        name: c.name,
                        kind: c.kindCode,
                      )),
                trailing: c.childCount > 0
                    ? MzIcon('chevron-right', size: 18)
                    : MzIcon('check', size: 18),
                onChoose: c.childCount > 0
                    ? () => widget.onPicked((
                        id: c.featureId,
                        name: c.name,
                        kind: c.kindCode,
                      ))
                    : null,
              ),
            if (level.children.isEmpty)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Tx('Nothing is recorded inside this place.'),
              ),
          ],
        ],
      ],
    );
  }
}

class _Row extends StatelessWidget {
  const _Row({
    required this.title,
    required this.subtitle,
    required this.onTap,
    required this.trailing,
    this.badge,
    this.onChoose,
  });
  final String title;
  final String subtitle;
  final String? badge;
  final VoidCallback onTap;
  final VoidCallback? onChoose;
  final Widget trailing;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.fromLTRB(4, 10, 4, 10),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: Theme.of(context).dividerColor.withValues(alpha: 0.6),
            ),
          ),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: text.titleSmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    subtitle,
                    style: text.bodySmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (badge != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Pill(badge!),
                    ),
                ],
              ),
            ),
            if (onChoose != null)
              TextButton(onPressed: onChoose, child: Tx('Choose')),
            trailing,
            const SizedBox(width: 6),
          ],
        ),
      ),
    );
  }
}
